import { NextResponse } from 'next/server'

import { users, sessions, keys, emailVerificationTokens } from '@/app/db/schema'
import { db } from '@/app/db/index'

export const DELETE = async () => {
  console.log('🏁 /api/delete')
  try {
    await db.transaction(async (tx) => {
      const deletedEmailVerificationTokens = tx.delete(emailVerificationTokens)
      const deletedKeys = tx.delete(keys)
      const deletedSessions = tx.delete(sessions)
      const deletedUsers = tx.delete(users)

      console.log({
        deletedUsers,
        deletedSessions,
        deletedKeys,
        deletedEmailVerificationTokens,
      })
    })
  } catch (error) {
    return NextResponse.json({ error, success: false })
  }
  return NextResponse.json({ success: true })
}
