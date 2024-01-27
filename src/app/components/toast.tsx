'use client'

import React from 'react'
import { useCookies } from 'next-client-cookies'

import { key } from '@/app/lib/constants'

export function Toast() {
  const cookies = useCookies()

  React.useEffect(() => {
    const toast = cookies.get(key)
    if (toast) {
      alert('Signup Successful!')
      cookies.remove(key)
    }
  }, [cookies])

  return null
}
