import type { Intent } from '@conform-to/react'
import { conformZodMessage } from '@conform-to/zod'
import { z } from 'zod'

export const verifyEmailSchema = z.object({
  code: z
    .string({ required_error: 'Code is required' })
    .length(6, { message: 'Must be exactly 6-digits long' }),
})

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
})

export function createSignupSchema(
  intent: Intent | null,
  options?: {
    // isEmailUnique is only defined on the server
    isEmailUnique: (email: string) => boolean
  }
) {
  return z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid Email address')
      // Pipe the schema so it runs only if the email is valid
      .pipe(
        z.string().superRefine((email, ctx) => {
          const isValidatingEmail =
            intent === null ||
            (intent.type === 'validate' && intent.payload.name === 'email')

          if (!isValidatingEmail) {
            ctx.addIssue({
              code: 'custom',
              message: conformZodMessage.VALIDATION_SKIPPED,
            })
            return
          }

          if (typeof options?.isEmailUnique !== 'function') {
            ctx.addIssue({
              code: 'custom',
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            })
            return
          }

          const isUnique = options.isEmailUnique(email)
          if (!isUnique) {
            ctx.addIssue({
              code: 'custom',
              message: 'Email is already used',
            })
            return
          }
        })
      ),
  })
}
