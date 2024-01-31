'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { parseWithZod } from '@conform-to/zod'
import { z } from 'zod'
import { TimeSpan } from 'oslo'

import { db } from '@/app/db/index'
import { userTable } from '@/app/db/drizzle.schema'
import { loginSchema } from '@/app/lib/zod.schema'

import { sendEmailVerificationCode } from '@/app/actions/signup'
import { VERIFIED_EMAIL_ALERT } from '@/app/lib/constants'

export async function login(prevState: unknown, formData: FormData) {
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

      return { ...data, ...existingEmail }
    }),
    async: true,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    sendEmailVerificationCode(submission.value.id, submission.value.email)
    cookies().set(VERIFIED_EMAIL_ALERT, 'true', {
      maxAge: new TimeSpan(1, 'm').seconds(), // 10 minutes = 60 * 60 * 1
    })
  } catch (err) {
    console.error(`Login error while creating Lucia session:`)
    console.error(err)
  }

  return redirect('/verify-email')
}
