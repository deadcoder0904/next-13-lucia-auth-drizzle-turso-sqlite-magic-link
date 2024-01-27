'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { generateId, TimeSpan } from 'lucia'
import { eq } from 'drizzle-orm'
import { parseWithZod } from '@conform-to/zod'
import { z } from 'zod'

import { lucia } from '@/app/auth/lucia'
import { db } from '@/app/db/index'
import { userTable } from '@/app/db/drizzle.schema'
import { createSignupSchema, loginSchema } from '@/app/lib/zod.schema'

export async function signup(prevState: unknown, formData: FormData) {
  const userId = generateId(15)
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
        const session = await db
          .insert(userTable)
          .values({ id: userId, ...data })

        return { ...data, session }
      }),
    async: true,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  cookies().set('registration_alert', 'true', {
    maxAge: new TimeSpan(10, 'm').seconds(), // 10 minutes = 60 * 60 * 1
  })

  return redirect('/login')
}

export async function login(prevState: unknown, formData: FormData) {
  const submission = await parseWithZod(formData, {
    schema: loginSchema.transform(async (data, ctx) => {
      const existingEmail = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, data.email))
      if (!(existingEmail && existingEmail[0].id)) {
        ctx.addIssue({
          path: ['email'],
          code: z.ZodIssueCode.custom,
          message: 'Invalid email',
        })
        return z.NEVER
      }
      return { ...data, userId: existingEmail[0].id }
    }),
    async: true,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  try {
    const session = await lucia.createSession(submission.value.userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )
  } catch (err) {
    console.error({ err })
  }

  return redirect('/dashboard')
}
