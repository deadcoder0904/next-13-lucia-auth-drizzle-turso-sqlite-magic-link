import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { auth } from '@/app/auth/lucia'

export const DELETE = async (request: Request) => {
  const authRequest = auth.handleRequest({ request, cookies })
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
