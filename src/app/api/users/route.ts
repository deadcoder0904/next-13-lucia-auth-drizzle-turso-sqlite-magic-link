import { NextResponse } from 'next/server'

import { users } from '@/app/db/schema'
import { db } from '@/app/db/index'

export const GET = async () => {
  const allUsers = await db.select().from(users).all()
  return NextResponse.json(allUsers)
}
