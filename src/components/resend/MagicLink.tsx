import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import { EMAIL_VERIFICATION_URL } from '@/lib/constants'

interface MagicLinkEmailProps {
  magicLink?: string
}

export const MagicLinkEmail = ({ magicLink }: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>Log in with this magic link.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>🪄 Your magic link</Heading>
        <Section style={body}>
          <Text style={paragraph}>
            <Link style={link} href={`${EMAIL_VERIFICATION_URL}/${magicLink}`}>
              👉 Click here to sign in 👈
            </Link>
          </Text>
          <Text style={paragraph}>
            If you didn&apos;t request this, please ignore this email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 25px 48px',
  backgroundPosition: 'bottom',
  backgroundRepeat: 'no-repeat, no-repeat',
}

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '48px',
}

const body = {
  margin: '24px 0',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
}

const link = {
  color: '#FF6363',
}
