'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { parseWithZod } from '@conform-to/zod'
import { z } from 'zod'

import { lucia } from '@/app/auth/lucia'
import { db } from '@/app/db/index'
import { userTable } from '@/app/db/drizzle.schema'
import { loginSchema } from '@/app/lib/zod.schema'

import { sendEmailVerificationCode } from '@/app/actions/signup'

export async function login(prevState: unknown, formData: FormData) {
  const isLoginForm = formData.get('intent') === 'login'
  const submission = await parseWithZod(formData, {
    schema: loginSchema.transform(async (data, ctx) => {
      const existingEmail = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, data.email))
        .execute()
        .then((s) => s[0])
      if (!(existingEmail && existingEmail.id)) {
        ctx.addIssue({
          path: ['email'],
          code: z.ZodIssueCode.custom,
          message: 'Invalid email',
        })
        return z.NEVER
      }
      console.log('login ation')
      console.log({ ...data, ...existingEmail })
      return { ...data, ...existingEmail }
    }),
    async: true,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    if (isLoginForm) {
      const session = await lucia.createSession(submission.value.id, {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }
    sendEmailVerificationCode(submission.value.id, submission.value.email)
  } catch (err) {
    console.error(`Login error while creating Lucia session:`)
    console.error(err)
  }

  return redirect('/verify-email')
}
