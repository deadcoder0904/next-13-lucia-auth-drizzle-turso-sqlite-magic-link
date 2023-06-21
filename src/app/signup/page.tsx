'use client'

import ky from 'ky'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

export const Signup = () => {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')

    console.log({ email })
    const response: { redirected: boolean; url: string } = await ky.post(
      '/api/signup',
      {
        json: { email },
      }
    )

    if (response.redirected) {
      toast.success('signup successful!')
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
        <button type="submit">signup</button>
      </form>
      <Toaster />
    </>
  )
}

export default Signup
