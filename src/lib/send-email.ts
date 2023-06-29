import { MagicLinkEmail } from '@/components/resend/MagicLink'
import { resend } from '@/lib/resend'
import { generateVerificationToken } from '@/lib/verification-token'
import { EMAIL_VERIFICATION_URL } from '@/lib/constants'

export const sendEmail = async (id: string, email: string) => {
  const magicLink = await generateVerificationToken(id)

  console.log({
    magicLink: `${EMAIL_VERIFICATION_URL}/${magicLink}`,
  })

  /* comment the following to not send test emails for development */
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Magic Link',
    react: MagicLinkEmail({ magicLink }),
  })
}
