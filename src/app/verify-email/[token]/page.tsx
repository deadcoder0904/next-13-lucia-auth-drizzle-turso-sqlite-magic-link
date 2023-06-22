'use client'

import React from 'react'
import ky from 'ky'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

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

  const resendMagicLink = () => {
    // todo
    toast.error('not implemented yet.')
  }

  return (
    <>
      <Link href="/" className="anchor-dark">
        go home
      </Link>
      <h1 className="text-sky-500">
        didn&apos;t get email? send verification link again.
      </h1>
      <button type="button" onClick={resendMagicLink}>
        resend magic link
      </button>
    </>
  )
}

export default VerifyEmail
