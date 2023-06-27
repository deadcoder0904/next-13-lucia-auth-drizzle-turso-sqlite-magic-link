import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import vine, { errors } from '@vinejs/vine'

import { auth } from '@/app/auth/lucia'
import { validateEmailVerificationToken } from '@/lib/verification-token'

export const POST = async (request: Request) => {
  const req = await request.json()
  console.log('🏁 /api/verify-email')

  const schema = vine.object({
    token: vine.string(),
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
    const userId = await validateEmailVerificationToken(req.token)

    if (!userId) {
      return NextResponse.json(null, {
        status: 422,
        statusText: 'invalid or expired token. try again.',
      })
    }
    await auth.invalidateAllUserSessions(userId)
    const session = await auth.createSession({
      userId,
      attributes: {},
    })
    const authRequest = auth.handleRequest({
      cookies,
      request: request as NextRequest | null,
    })
    authRequest.setSession(session)

    return NextResponse.json(null, {
      status: 200,
      statusText: 'logging in...',
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(error, {
      status: 400,
    })
  }
}
