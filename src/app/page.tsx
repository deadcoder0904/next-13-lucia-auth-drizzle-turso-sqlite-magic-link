import Link from 'next/link'

export default function Home() {
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
