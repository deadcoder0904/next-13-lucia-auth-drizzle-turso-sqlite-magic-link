'use client'

import ky from 'ky'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const Login = () => {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')

    if (email?.toString().trim().length === 0) return

    toast.promise(
      new Promise<string>(async (resolve, reject) => {
        try {
          await ky.post('/api/login', {
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
        loading: 'logging in...',
        success: (msg) => msg,
        error: (err) => err || 'error logging in...',
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
        <button type="submit">login</button>
      </form>
    </>
  )
}

export default Login
