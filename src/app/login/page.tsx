import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import { LoginForm } from '@/app/components/form'
import { validateRequest } from '@/app/auth/lucia'
import { key } from '@/app/lib/constants'

export default async function Login() {
  const cookieAlert = cookies().get(key)
  const { session } = await validateRequest()
  if (session && !cookieAlert) return redirect('/dashboard')

  return (
    <>
      <LoginForm />
    </>
  )
}
