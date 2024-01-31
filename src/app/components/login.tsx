'use client'

import React from 'react'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { login } from '@/app/actions/login'
import { loginSchema } from '@/app/lib/zod.schema'
import { Toast } from '@/app/components/toast'

export function LoginForm() {
  const [lastResult, action] = useFormState(login, undefined)

  const [form, fields] = useForm({
    id: 'login-form',
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: loginSchema,
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
        <button type="submit" name="intent" value="login">
          login
        </button>
      </form>
      <Toast message="Email Verification Successful!" />
    </>
  )
}
