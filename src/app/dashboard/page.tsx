import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import { lucia, validateRequest } from '@/app/auth/lucia'

const Dashboard = () => {
  return (
    <>
      <Link href="/" className="anchor-dark">
        go home
      </Link>
      <form action={logout}>
        <button type="submit">logout</button>
      </form>
    </>
  )
}

async function logout() {
  'use server'
  const { session } = await validateRequest()
  console.log({ session })
  if (!session) {
    return {
      error: 'Unauthorized',
    }
  }

  await lucia.invalidateSession(session.id)

  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
  await lucia.deleteExpiredSessions()

  return redirect('/login')
}

export default Dashboard
