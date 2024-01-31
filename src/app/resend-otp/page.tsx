import { redirect } from 'next/navigation'

import { ResendOTPForm } from '@/app/components/resend-otp'
import { validateRequest } from '@/app/auth/lucia'

export default async function ResendOTPPage() {
  const { user } = await validateRequest()
  const userExists = user && user.emailVerified
  if (userExists) return redirect('/dashboard')

  return (
    <>
      <ResendOTPForm />
    </>
  )
}
