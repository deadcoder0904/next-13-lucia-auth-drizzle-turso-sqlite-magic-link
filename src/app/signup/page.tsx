'use client'

import ky from 'ky'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export const Signup = () => {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')

    if (email?.toString().trim().length === 0) return

    toast.promise(
      new Promise<string>(async (resolve, reject) => {
        try {
          await ky.post('/api/signup', {
            json: { email },
            hooks: {
              afterResponse: [
                async (_, __, res) => {
                  if (res.status === 200) {
                    resolve(res.statusText)
                    setTimeout(() => {
                      return router.push('/check-email')
                    }, 2000)
                  }
                  if (res.status === 400 && res.statusText) {
                    reject(res.statusText)
                  }
                },
              ],
            },
          })
        } catch (e) {
          reject()
        }
      }),
      {
        loading: 'signing up...',
        success: (msg) => msg,
        error: (err) => err || 'error signing up...',
      }
    )
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
