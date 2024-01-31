import { redirect } from 'next/navigation'

import { VerifyEmailForm } from '@/app/components/verify-email'
import { validateRequest } from '@/app/auth/lucia'

export default async function VerifyEmailPage() {
  const { user } = await validateRequest()
  const userExists = user && user.emailVerified
  if (userExists) return redirect('/dashboard')

  return (
    <>
      <VerifyEmailForm />
    </>
  )
}
