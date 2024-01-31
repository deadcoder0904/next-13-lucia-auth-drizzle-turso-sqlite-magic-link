'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { parseWithZod } from '@conform-to/zod'
import { z } from 'zod'
import { isWithinExpirationDate, TimeSpan } from 'oslo'

import { lucia } from '@/app/auth/lucia'
import { db } from '@/app/db/index'
import { emailVerificationCodeTable, userTable } from '@/app/db/drizzle.schema'
import { verifyEmailSchema } from '@/app/lib/zod.schema'
import { VERIFIED_EMAIL_ALERT } from '@/app/lib/constants'

export async function verifyEmail(prevState: unknown, formData: FormData) {
  const submission = await parseWithZod(formData, {
    schema: verifyEmailSchema.transform(async (data, ctx) => {
      const { code } = data

      const databaseCode = await db
        .select()
        .from(emailVerificationCodeTable)
        .where(eq(emailVerificationCodeTable.code, code))
        .execute()
        .then((s) => s[0])

      if (!databaseCode) {
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

      await db
        .delete(emailVerificationCodeTable)
        .where(eq(emailVerificationCodeTable.id, databaseCode.id))

      return { ...data, ...databaseCode }
    }),
    async: true,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, submission.value.userId))
    .execute()
    .then((s) => s[0])

  await lucia.invalidateUserSessions(user.id)
  await db
    .update(userTable)
    .set({ emailVerified: 1 })
    .where(eq(userTable.id, user.id))

  console.log(`\n😊 ${user.email} has been verified.\n`)

  const session = await lucia.createSession(user.id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies().set(sessionCookie)

  cookies().set(VERIFIED_EMAIL_ALERT, 'true', {
    maxAge: new TimeSpan(1, 'm').seconds(), // 10 minutes = 60 * 60 * 1
  })

  return redirect('/dashboard')
}
