import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import { lucia, validateRequest } from '@/app/auth/lucia'
import { VERIFIED_EMAIL_ALERT } from '@/app/lib/constants'
import { Toast } from '@/app/components/toast'

const Dashboard = async () => {
  const { user } = await validateRequest()
  const userExists = user && user.emailVerified
  if (!userExists) return redirect('/login')

  return (
    <>
      <Link href="/" className="anchor-dark">
        go home
      </Link>
      <form action={logout}>
        <button type="submit">logout</button>
      </form>
      <Toast message="Email has been verifed!" />
    </>
  )
}

async function logout() {
  'use server'
  const { session } = await validateRequest()

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

  cookies().delete(VERIFIED_EMAIL_ALERT)

  return redirect('/login')
}

export default Dashboard
