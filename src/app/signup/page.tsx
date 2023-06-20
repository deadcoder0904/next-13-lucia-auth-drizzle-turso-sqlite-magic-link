'use client'

import ky from 'ky'
import React from 'react'
import Link from 'next/link'

export const Signup = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')

    console.log({ email })
    const { success }: { success: string } = await ky
      .post('/api/signup', {
        json: { email },
      })
      .json()

    if (success) {
      alert('signup successful!')
    }
  }

  return (
    <>
      <Link href="/" className="anchor-dark">
        go home
      </Link>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" id="email" />
        <button type="submit">signup</button>
      </form>
    </>
  )
}

export default Signup
