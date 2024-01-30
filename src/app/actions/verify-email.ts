'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { parseWithZod } from '@conform-to/zod'
import { z } from 'zod'
import { isWithinExpirationDate, TimeSpan } from 'oslo'

import { lucia, validateRequest } from '@/app/auth/lucia'
import { db } from '@/app/db/index'
import { emailVerificationCodeTable, userTable } from '@/app/db/drizzle.schema'
import { verifyEmailSchema } from '@/app/lib/zod.schema'
import { VERIFIED_EMAIL_ALERT } from '@/app/lib/constants'

export async function verifyEmail(prevState: unknown, formData: FormData) {
  const { user } = await validateRequest()
  console.log({ user })
  if (!user) {
    return redirect('/login')
  }

  const code = formData.get('code')

  const submission = await parseWithZod(formData, {
    schema: verifyEmailSchema.transform(async (data, ctx) => {
      const databaseCode = await db.transaction(async (tx) => {
        const code = await tx
          .select()
          .from(emailVerificationCodeTable)
          .where(eq(emailVerificationCodeTable.userId, user.id))
          .execute()
          .then((s) => s[0])
        console.log({ code })
        if (code) {
          await tx
            .delete(emailVerificationCodeTable)
            .where(eq(emailVerificationCodeTable.id, code.id))
        }
        return code
      })

      console.log({ databaseCode })
      if (!databaseCode || databaseCode.code !== code) {
        ctx.addIssue({
          path: ['code'],
          code: z.ZodIssueCode.custom,
          message: 'Invalid OTP. Try again!',
        })
        return z.NEVER
      }

      if (
        databaseCode.expiresAt &&
        !isWithinExpirationDate(new Date(databaseCode.expiresAt))
      ) {
        ctx.addIssue({
          path: ['code'],
          code: z.ZodIssueCode.custom,
          message: 'Verification code expired',
        })
        return z.NEVER
      }

      return { ...data, databaseCode }
    }),
    async: true,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  await lucia.invalidateUserSessions(user.id)
  await db
    .update(userTable)
    .set({ emailVerified: 1 })
    .where(eq(userTable.id, user.id))

  const session = await lucia.createSession(user.id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies().set(sessionCookie)

  cookies().set(VERIFIED_EMAIL_ALERT, 'true', {
    maxAge: new TimeSpan(10, 'm').seconds(), // 10 minutes = 60 * 60 * 1
  })

  return redirect('/dashboard')
}
