import Link from 'next/link'

import Form from '@/components/Form'
import { validateSession } from '@/lib/validate-session'

export const Signup = async () => {
  // await validateSession('/dashboard', true)

  return (
    <>
      <Link href="/" className="anchor-dark">
        go home
      </Link>
      <Form
        requestUrl="/api/signup"
        successUrl="/check-email"
        toastMsg="signing up..."
        buttonName="sign in"
      />
    </>
  )
}

export default Signup
