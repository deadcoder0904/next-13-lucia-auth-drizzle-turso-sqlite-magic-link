'use client'

import ky from 'ky'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Login = () => {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')
    const response: { redirected: boolean; url: string } = await ky.post(
      '/api/login',
      {
        json: { email },
      }
    )

    if (response.redirected) {
      return router.push(response.url)
    }
  }

  return (
    <>
      <Link href="/" className="anchor-dark">
        go home
      </Link>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" id="email" />
        <button type="submit">login</button>
      </form>
    </>
  )
}

export default Login
