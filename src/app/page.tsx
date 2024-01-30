import Link from 'next/link'
import { redirect } from 'next/navigation'

import { validateRequest } from '@/app/auth/lucia'

export default async function Home() {
  const { user } = await validateRequest()
  console.log({ user })
  if (user && user.emailVerified) return redirect('/dashboard')

  return (
    <main className="space-x-2">
      <Link href="/signup" className="anchor">
        signup
      </Link>
      <Link href="/login" className="anchor">
        login
      </Link>
    </main>
  )
}
