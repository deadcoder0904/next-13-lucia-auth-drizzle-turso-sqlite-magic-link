'use client'

import React from 'react'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { signup } from '@/app/actions/signup'
import { createSignupSchema } from '@/app/lib/zod.schema'

export function SignupForm() {
  const [lastResult, action] = useFormState(signup, undefined)

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
        <button type="submit">signup</button>
      </form>
    </>
  )
}
