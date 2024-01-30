'use client'

import React from 'react'
import { useFormState } from 'react-dom'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import Link from 'next/link'

import { verifyEmail } from '@/app/actions/verify-email'
import { verifyEmailSchema } from '@/app/lib/zod.schema'
import { Toast } from '@/app/components/toast'

export function VerifyEmailForm() {
  const [lastResult, action] = useFormState(verifyEmail, undefined)

  const [form, fields] = useForm({
    id: 'verify-email-form',
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: verifyEmailSchema,
      })
    },
    shouldValidate: 'onBlur',
  })

  return (
    <>
      <form action={action} {...getFormProps(form)}>
        <input
          className={`text-gray-500 ${
            !fields.code.valid ? 'text-red-500' : ''
          }`}
          {...getInputProps(fields.code, { type: 'text' })}
          key={fields.code.key}
        />
        <div className="text-red-500">{fields.code.errors}</div>
        <button type="submit">verify email</button>
      </form>
      <p>
        {' '}
        didn&apos;t get an otp?{' '}
        <Link href="/resend-otp" className="resend-otp">
          resend otp
        </Link>
      </p>
      <Toast message="Enter 6-digit OTP logged to console." />
    </>
  )
}
