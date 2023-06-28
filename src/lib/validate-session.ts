import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/app/auth/lucia'

export const validateSession = async (url: string, sessionExists: boolean) => {
  const authRequest = auth.handleRequest({ cookies, request: null })
  const session = await authRequest.validate()

  if (sessionExists) {
    if (session) redirect(url)
  } else {
    if (!session) redirect(url)
    return session
  }
}
