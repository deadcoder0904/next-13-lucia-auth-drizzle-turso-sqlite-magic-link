import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { lucia, validateRequest } from '@/app/auth/lucia'

export const DELETE = async (request: Request) => {
  console.log('🏁 DELETE /api/logout/route')

  const { session } = await validateRequest()
  console.log({ session })

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

  await lucia.invalidateSession(session.id)

  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )

  await lucia.deleteExpiredSessions()

  return NextResponse.json(null, {
    status: 200,
    statusText: 'logout successful!!!',
  })
}
