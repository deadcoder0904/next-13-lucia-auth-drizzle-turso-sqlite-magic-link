import React from 'react'

import { Logout } from '@/components/Logout'
import { validateSession } from '@/lib/validate-session'

const Dashboard = async () => {
  const session = await validateSession('/login', false)

  return (
    <main className="flex">
      <p>welcome to dashboard, user {session.user.email.split('@')[0]}!!!</p>
      <Logout />
    </main>
  )
}

export default Dashboard
