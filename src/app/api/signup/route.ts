import { NextResponse } from 'next/server'
import vine, { errors } from '@vinejs/vine'
import { eq } from 'drizzle-orm'

import { auth } from '@/app/auth/lucia'
import { db } from '@/app/db'
import { users } from '@/app/db/schema'
import { MagicLinkEmail } from '@/components/resend/MagicLink'
import { resend } from '@/lib/resend'
import { generateVerificationToken } from '@/lib/verification-token'
import { EMAIL_VERIFICATION_URL } from '@/lib/constants'

export const POST = async (request: Request) => {
  const req = await request.json()
  console.log('🏁 /api/signup/route')

  const schema = vine.object({
    email: vine.string(),
  })

  try {
    const validator = vine.compile(schema)
    await validator.validate(req)
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      console.log(error.messages)
      return NextResponse.json({ error: error.messages }, { status: 400 })
    }
  }

  try {
    const email = req.email
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
    const session = await auth.createSession({
      userId: newUser.userId,
      attributes: {},
    })
    const magicLink = await generateVerificationToken(session.user.userId)

    console.log({
      magicLink: `${EMAIL_VERIFICATION_URL}/${magicLink}`,
    })

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Magic Link',
      react: MagicLinkEmail({ magicLink }),
    })

    return NextResponse.json(null, {
      status: 200,
      statusText: 'check your email for magic link!!!',
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(error, {
      status: 400,
    })
  }
}
