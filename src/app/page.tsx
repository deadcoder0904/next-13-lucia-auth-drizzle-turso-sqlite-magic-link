import React from 'react'
import Link from 'next/link'

import { DeleteAll } from '@/components/DeleteAll'
import { validateSession } from '@/lib/validate-session'

const Home = async () => {
  await validateSession('/dashboard', true)

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
