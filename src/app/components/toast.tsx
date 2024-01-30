'use client'

import React from 'react'
import { useCookies } from 'next-client-cookies'

import { VERIFIED_EMAIL_ALERT } from '@/app/lib/constants'

export function Toast({ message }: { message: string }) {
  const cookies = useCookies()

  React.useEffect(() => {
    const toast = cookies.get(VERIFIED_EMAIL_ALERT)
    if (toast) {
      alert(message)
      cookies.remove(VERIFIED_EMAIL_ALERT)
    }
  }, [cookies, message])

  return null
}
