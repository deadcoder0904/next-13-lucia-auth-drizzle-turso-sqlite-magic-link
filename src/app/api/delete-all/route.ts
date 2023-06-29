import { NextResponse } from 'next/server'

import { users, sessions, keys, emailVerificationTokens } from '@/app/db/schema'
import { db } from '@/app/db/index'

export const DELETE = async () => {
  console.log('🏁 DELETE /api/delete-all')
  try {
    await db.transaction(async (tx) => {
      await tx.delete(emailVerificationTokens).run()
      await tx.delete(keys).run()
      await tx.delete(sessions).run()
      await tx.delete(users).run()
    })
  } catch (error) {
    return NextResponse.json({ error, success: false })
  }
  return NextResponse.json({ success: true })
}
