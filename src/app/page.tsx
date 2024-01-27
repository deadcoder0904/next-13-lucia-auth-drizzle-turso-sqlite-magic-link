import Link from 'next/link'
import { redirect } from 'next/navigation'

import { validateRequest } from '@/app/auth/lucia'

export default async function Home() {
  const { session } = await validateRequest()
  if (session) return redirect('/dashboard')

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
