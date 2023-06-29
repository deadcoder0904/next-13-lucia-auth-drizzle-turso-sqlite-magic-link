import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/app/auth/lucia'
import { sendEmail } from '@/lib/send-email'

export const POST = async (request: Request) => {
  console.log('🏁 POST /api/resend/route')

  try {
    const authRequest = auth.handleRequest({
      request: request as NextRequest,
      cookies,
    })
    const session = await authRequest.validate()

    if (!session) {
      return NextResponse.json(
        {
          error: 'unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    sendEmail(session.user.id, session.user.email)

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
