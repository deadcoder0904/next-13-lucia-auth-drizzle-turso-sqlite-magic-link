import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import vine, { errors } from '@vinejs/vine'

import { auth } from '@/app/auth/lucia'

export const POST = async (request: Request) => {
  const req = await request.json()
  console.log('fetch /api/signup/route')

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

  console.log('2nd try..catch')

  try {
    console.log('user')
    const user = await auth.createUser({
      key: {
        providerId: 'email',
        providerUserId: req.email,
        password: null,
      },
      attributes: {
        email: req.email,
      },
    })
    console.log({ user })
    const session = await auth.createSession(user.userId)
    const authRequest = auth.handleRequest({ request, cookies })
    authRequest.setSession(session)

    console.log({ session })
    // using redirect() ignores cookie

    return new Response(null, {
      status: 302,
      headers: {
        location: '/dashboard',
      },
    })
  } catch (error) {
    console.error({ error })
    // email taken
    return NextResponse.json(null, {
      status: 400,
    })
  }
}
