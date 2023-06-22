import React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/app/auth/lucia'
import { Logout } from '@/components/Logout'

const Dashboard = async () => {
  const authRequest = auth.handleRequest({ cookies })
  const session = await authRequest.validate()

  if (!session) redirect('/login')

  return (
    <main className="flex">
      <p>welcome to dashboard, user {session.user.email.split('@')[0]}!!!</p>
      <Logout />
    </main>
  )
}

export default Dashboard
