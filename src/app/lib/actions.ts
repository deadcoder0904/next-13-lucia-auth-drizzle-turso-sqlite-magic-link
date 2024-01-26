'use server'

import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import Link from 'next/link'
import { Argon2id } from 'oslo/password'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { generateId } from 'lucia'
import { z } from 'zod'
import { countDistinct, eq } from 'drizzle-orm'
import { getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { lucia } from '@/app/auth/lucia'
import { db } from '@/app/db/index'
import { userTable } from '@/app/db/schema'
import { createSignupSchema, signupSchema } from '@/app/lib/zod-schema'

export async function signup(prevState: unknown, formData: FormData) {
  const userId = generateId(15)
  console.log('signup')
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
        console.log('parseWithZod')
        const session = await db
          .insert(userTable)
          .values({ id: userId, ...data })

        console.log('action')
        console.log({ session })
        if (!session) {
          ctx.addIssue({
            path: ['email'],
            code: z.ZodIssueCode.custom,
            message: 'Email already exists!',
          })
          return z.NEVER
        }
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
  return redirect('/')
}
