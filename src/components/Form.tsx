'use client'

import React from 'react'
import ky from 'ky'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Props {
  requestUrl: string
  successUrl: string
  toastMsg: string
  buttonName: string
}

const Form = ({ requestUrl, successUrl, toastMsg, buttonName }: Props) => {
  console.log({ requestUrl, successUrl, toastMsg, buttonName })

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email')

    if (email?.toString().trim().length === 0) return

    toast.promise(
      new Promise<string>(async (resolve, reject) => {
        try {
          await ky.post(requestUrl, {
            json: { email },
            hooks: {
              afterResponse: [
                async (_, __, res) => {
                  if (res.status === 200) {
                    resolve(res.statusText)
                    setTimeout(() => {
                      return router.push(successUrl)
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
        loading: toastMsg,
        success: (msg) => msg,
        error: (err) => err || `error ${toastMsg}`,
      }
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" id="email" />
        <button type="submit">{buttonName}</button>
      </form>
    </>
  )
}

export default Form
