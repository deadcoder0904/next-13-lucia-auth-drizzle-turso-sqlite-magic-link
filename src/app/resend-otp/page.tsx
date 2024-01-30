import { redirect } from 'next/navigation'

import { ResendOTPForm } from '@/app/components/resend-otp'
import { validateRequest } from '@/app/auth/lucia'

export default async function ResendOTPPage() {
  const { user } = await validateRequest()
  if (user && user.emailVerified) return redirect('/dashboard')

  return (
    <>
      <ResendOTPForm />
    </>
  )
}
