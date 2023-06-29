import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/app/auth/lucia'

export const DELETE = async (request: Request) => {
  console.log('🏁 DELETE /api/logout/route')

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

  await auth.invalidateSession(session.sessionId)
  authRequest.setSession(null)

  return NextResponse.json(null, {
    status: 200,
    statusText: 'logout successful!!!',
  })
}
