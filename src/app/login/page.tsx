'use client'

import React from 'react'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { useCookies } from 'next-client-cookies'

import { signup } from '@/app/lib/actions'
import { createSignupSchema } from '@/app/lib/zod-schema'

export default function Login() {
  const cookies = useCookies()

  const [lastResult, action] = useFormState(signup, undefined)

  React.useEffect(() => {
    const key = 'registration_alert'
    const toast = cookies.get(key)
    if (toast) {
      alert('Signup Successful!')
      cookies.remove(key)
    }
  }, [cookies])

  const [form, fields] = useForm({
    id: 'signup-form',
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: (control) => createSignupSchema(control),
      })
    },
    shouldValidate: 'onBlur',
  })

  return (
    <>
      <Link href="/" className="anchor-dark">
        go home
      </Link>
      <form action={action} {...getFormProps(form)}>
        <input
          className={!fields.email.valid ? 'text-red-500' : ''}
          {...getInputProps(fields.email, { type: 'email' })}
          key={fields.email.key}
        />
        <div className="text-red-500">{fields.email.errors}</div>
        <button type="submit">login</button>
      </form>
    </>
  )
}
