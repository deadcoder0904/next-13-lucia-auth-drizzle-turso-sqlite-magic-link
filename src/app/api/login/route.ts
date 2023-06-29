import { NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'
import vine, { errors } from '@vinejs/vine'

import { users } from '@/app/db/schema'
import { db } from '@/app/db/index'
import { sendEmail } from '@/lib/send-email'

export const POST = async (request: Request) => {
  const req = await request.json()
  console.log('🏁 POST /api/login/route')

  const schema = vine.object({
    email: vine.string(),
  })

  try {
    const validator = vine.compile(schema)
    const { email } = await validator.validate(req)

    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email)))
      .all()

    if (!user.length) {
      return NextResponse.json({ success: false })
    }

    sendEmail(user[0].id, email)

    return NextResponse.json(null, {
      status: 200,
      statusText: 'check your email for magic link!!!',
    })
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json({ error: error.messages }, { status: 400 })
    }

    console.error({ error })
    return NextResponse.json(null, {
      status: 400,
    })
  }
}
