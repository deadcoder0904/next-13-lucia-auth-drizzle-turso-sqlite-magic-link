import { NextResponse } from 'next/server'

import { users, sessions, keys, emailVerificationTokens } from '@/app/db/schema'
import { db } from '@/app/db/index'

export const GET = async () => {
  console.log('🏁 /api/get-all')

  let data: any[] = []

  try {
    await db.transaction(async (tx) => {
      const allUsers = await tx.select().from(users).all()
      const allSessions = await tx.select().from(sessions).all()
      const allKeys = await tx.select().from(keys).all()
      const allEmailVerificationTokens = await tx
        .select()
        .from(emailVerificationTokens)
        .all()

      data.push({
        users: allUsers,
        sessions: allSessions,
        keys: allKeys,
        emailVerificationTokens: allEmailVerificationTokens,
      })
    })
  } catch (error) {
    return NextResponse.json({ error, success: false })
  }
  return NextResponse.json(data)
}
