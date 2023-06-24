import Link from 'next/link'

import { Form } from '@/components/Form'
// import { validateSession } from '@/lib/validate-session'

const Login = async () => {
  // await validateSession('/dashboard', true)

  return (
    <>
      <Link href="/" className="anchor-dark">
        go home
      </Link>
      <Form
        requestUrl="/api/login"
        successUrl="/check-email"
        toastMsg="logging in..."
        buttonName="login"
      />
    </>
  )
}

export default Login
