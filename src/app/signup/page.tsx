import { redirect } from 'next/navigation'

import { SignupForm } from '@/app/components/signup'
import { validateRequest } from '@/app/auth/lucia'

export default async function SignupPage() {
  const { user } = await validateRequest()
  const userExists = user && user.emailVerified
  if (userExists) return redirect('/dashboard')

  return (
    <>
      <SignupForm />
    </>
  )
}
