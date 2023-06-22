import { NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'
import vine, { errors } from '@vinejs/vine'

import { users } from '@/app/db/schema'
import { db } from '@/app/db/index'
import { MagicLinkEmail } from '@/components/resend/MagicLink'
import { resend } from '@/lib/resend'
import { generateVerificationToken } from '@/lib/verification-token'
import { EMAIL_VERIFICATION_URL } from '@/lib/constants'

export const POST = async (request: Request) => {
  const req = await request.json()
  console.log('fetch /api/login/route', req)

  const schema = vine.object({
    email: vine.string(),
  })

  try {
    const validator = vine.compile(schema)
    await validator.validate(req)
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json({ error: error.messages }, { status: 400 })
    }
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.email, req.email)))
      .all()

    if (!user.length) {
      return NextResponse.json({ success: false })
    }

    const magicLink = await generateVerificationToken(user[0].id)

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user[0].email,
      subject: 'Magic Link',
      react: MagicLinkEmail({ magicLink }),
    })

    console.log({
      magicLink: `${EMAIL_VERIFICATION_URL}/${magicLink}`,
    })

    return NextResponse.json(null, {
      status: 200,
      statusText: 'check your email for magic link!!!',
    })
  } catch (error) {
    console.error({ error })

    return NextResponse.json(null, {
      status: 400,
    })
  }
}
