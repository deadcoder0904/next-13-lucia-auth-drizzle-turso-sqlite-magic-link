'use client'

import ky from 'ky'
import React from 'react'
import Link from 'next/link'

const Login = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')
    const { success }: { success: string } = await ky
      .post('/api/login', {
        json: { email },
      })
      .json()

    if (success) {
      alert('login successful!')
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
