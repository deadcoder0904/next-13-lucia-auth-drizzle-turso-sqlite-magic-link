import { NextResponse } from 'next/server'
import vine, { errors } from '@vinejs/vine'
import { eq } from 'drizzle-orm'

import { auth } from '@/app/auth/lucia'
import { db } from '@/app/db'
import { users } from '@/app/db/schema'
import { sendEmail } from '@/lib/send-email'

export const POST = async (request: Request) => {
  const req = await request.json()
  console.log('🏁 POST /api/signup/route')

  const schema = vine.object({
    email: vine.string(),
  })

  try {
    const validator = vine.compile(schema)
    const { email } = await validator.validate(req)

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .run()

    if (user.rows.length) {
      return NextResponse.json(null, {
        status: 400,
        statusText: 'email is already taken.',
      })
    }

    const newUser = await auth.createUser({
      key: {
        providerId: 'email',
        providerUserId: req.email,
        password: null,
      },
      attributes: {
        email: req.email,
      },
    })

    await auth.createSession({
      userId: newUser.userId,
      attributes: {},
    })

    sendEmail(newUser.userId, email)

    return NextResponse.json(null, {
      status: 200,
      statusText: 'check your email for magic link!!!',
    })
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      console.log(error.messages)
      return NextResponse.json({ error: error.messages }, { status: 400 })
    }

    console.error(error)
    return NextResponse.json(error, {
      status: 400,
    })
  }
}
