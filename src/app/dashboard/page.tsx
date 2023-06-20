'use client'

import ky from 'ky'
import React from 'react'
import Link from 'next/link'

const Dashboard = () => {
  const handleSubmit = async () => {
    const { success }: { success: string } = await ky.post('/api/logout').json()

    if (success) {
      alert('logout successful!')
    }
  }

  return (
    <>
      <Link href="/" className="anchor-dark">
        go home
      </Link>
      <form onSubmit={handleSubmit}>
        <button type="submit">logout</button>
      </form>
    </>
  )
}

export default Dashboard
