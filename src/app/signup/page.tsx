import { redirect } from 'next/navigation'

import { SignupForm } from '@/app/components/form'
import { validateRequest } from '@/app/auth/lucia'

export default async function SignupPage() {
  const { session } = await validateRequest()
  if (session) return redirect('/dashboard')

  return (
    <>
      <SignupForm />
    </>
  )
}
