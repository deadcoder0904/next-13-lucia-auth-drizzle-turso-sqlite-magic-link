'use client'

import React from 'react'
import ky from 'ky'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Form } from '@/components/Form'

interface Params {
  params: {
    token: string
  }
}

const VerifyEmail = ({ params }: Params) => {
  const { token } = params
  const router = useRouter()

  React.useEffect(() => {
    toast.promise(
      new Promise<string>(async (resolve, reject) => {
        try {
          await ky.post('/api/verify-email', {
            json: { token },
            hooks: {
              afterResponse: [
                async (_, __, res) => {
                  if (res.status === 200) {
                    resolve(res.statusText)
                    setTimeout(() => {
                      return router.push('/dashboard')
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
  }, [router, token])

  return (
    <>
      <Link href="/" className="anchor-dark">
        go home
      </Link>
      <h1 className="text-sky-500">
        didn&apos;t get email? send verification link again.
      </h1>
      <Form
        requestUrl="/api/login"
        successUrl="/check-email"
        toastMsg="logging in..."
        buttonName="resend magic link"
      />
    </>
  )
}

export default VerifyEmail
