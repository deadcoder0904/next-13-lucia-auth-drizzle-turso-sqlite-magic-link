'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { parseWithZod } from '@conform-to/zod'
import { TimeSpan } from 'oslo'
import { ulid } from 'ulidx'

import { lucia } from '@/app/auth/lucia'
import { db } from '@/app/db/index'
import { userTable } from '@/app/db/drizzle.schema'
import { createSignupSchema } from '@/app/lib/zod.schema'
import { generateEmailVerificationCode } from '@/app/lib/emailVerificationCode'
import { VERIFIED_EMAIL_ALERT } from '@/app/lib/constants'

export async function sendEmailVerificationCode(userId: string, email: string) {
  const code = await generateEmailVerificationCode(userId)
  console.log(`\n🤫 OTP for ${email} is ${code}\n`) // send an email to user with this OTP
}

export async function signup(prevState: unknown, formData: FormData) {
  const userId = ulid()
  const submission = await parseWithZod(formData, {
    schema: (control) =>
      // create a zod schema base on the control
      createSignupSchema(control, {
        isEmailUnique(email) {
          const user = db
            .select()
            .from(userTable)
            .where(eq(userTable.email, email))
            .all()
          return !user.length
        },
      }).transform(async (data, ctx) => {
        const user = await db
          .insert(userTable)
          .values({ id: userId, emailVerified: 0, ...data })
          .returning()
          .then((s) => s[0])

        return { ...data, ...user }
      }),
    async: true,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    sendEmailVerificationCode(userId, submission.value.email)

    cookies().set(VERIFIED_EMAIL_ALERT, 'true', {
      maxAge: new TimeSpan(1, 'm').seconds(), // 10 minutes = 60 * 60 * 1
    })
  } catch (err) {
    console.error(`Signup error while creating Lucia session:`)
    console.error(err)
  }

  return redirect('/verify-email')
}
