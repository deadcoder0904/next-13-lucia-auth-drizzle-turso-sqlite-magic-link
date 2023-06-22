import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import { auth } from '@/app/auth/lucia'
import { DeleteAll } from '@/components/DeleteAll'

const Home = async () => {
  const authRequest = auth.handleRequest({ cookies })
  const session = await authRequest.validate()

  if (session) redirect('/dashboard')

  return (
    <main className="space-x-2 flex w-full">
      <Link href="/signup" className="anchor">
        signup
      </Link>
      <Link href="/login" className="anchor">
        login
      </Link>
      <Link
        href="/api/get-all"
        className="text-amber-400 underline absolute right-28"
      >
        get all
      </Link>
      <DeleteAll />
    </main>
  )
}

export default Home
