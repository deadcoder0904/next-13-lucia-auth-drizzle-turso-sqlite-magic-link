import { redirect } from 'next/navigation'

import { VerifyEmailForm } from '@/app/components/verify-email'
import { validateRequest } from '@/app/auth/lucia'

export default async function VerifyEmailPage() {
  const { user } = await validateRequest()
  if (user && user.emailVerified) return redirect('/dashboard')

  return (
    <>
      <VerifyEmailForm />
    </>
  )
}
