import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import { LoginForm } from '@/app/components/login'
import { validateRequest } from '@/app/auth/lucia'
import { VERIFIED_EMAIL_ALERT } from '@/app/lib/constants'

export default async function Login() {
  // const cookieAlert = cookies().get(VERIFIED_EMAIL_ALERT)
  const { user } = await validateRequest()
  const userExists = user && user.emailVerified
  if (userExists) return redirect('/dashboard')

  return (
    <>
      <LoginForm />
    </>
  )
}
