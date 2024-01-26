'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { generateId } from 'lucia'
import { eq } from 'drizzle-orm'
import { parseWithZod } from '@conform-to/zod'

import { lucia } from '@/app/auth/lucia'
import { db } from '@/app/db/index'
import { userTable } from '@/app/db/schema'
import { createSignupSchema } from '@/app/lib/zod-schema'

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

  const session = await lucia.createSession(userId, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )

  cookies().set('registration_alert', 'true', {
    maxAge: 60 * 60 * 1, // 10 minutes
  })

  return redirect('/login')
}
