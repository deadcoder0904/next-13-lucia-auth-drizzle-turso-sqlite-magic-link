import { redirect } from 'next/navigation'

import { SignupForm } from '@/app/components/signup'
import { validateRequest } from '@/app/auth/lucia'

export default async function SignupPage() {
  const { user } = await validateRequest()
  if (user && user.emailVerified) return redirect('/dashboard')

  return (
    <>
      <SignupForm />
    </>
  )
}
