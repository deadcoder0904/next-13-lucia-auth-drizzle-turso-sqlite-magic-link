import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'
import vine, { errors } from '@vinejs/vine'

import { validateRequest } from '@/app/auth/lucia'
import { userTable } from '@/app/db/schema'
import { db } from '@/app/db/index'

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
    const user = db
      .select()
      .from(userTable)
      .where(and(eq(userTable.email, req.email)))
      .all()

    console.log({ user })

    if (!user.length) {
      return NextResponse.json({ success: false })
    }

    // if email does not exist, then return with an error msg asking to buy the product or signing up with the email
    // if email exists in the database, then
    const key = await auth.useKey('email', req.email, null)
    const session = await auth.createSession(key.userId)
    const authRequest = auth.handleRequest({ request, cookies })
    authRequest.setSession(session)
    // using redirect() ignores cookie

    // resend.emails.send({
    //   from: 'onboarding@resend.dev',
    //   to: 'akshaykadam0904@gmail.com',
    //   subject: 'Hello World',
    //   react: EmailTemplate({ firstName: "John" }),
    // })
    console.log({ key, session })
    // return NextResponse.json({ success: true, url: '/dashboard' })
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
