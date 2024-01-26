import { NextResponse } from 'next/server'

import { userTable } from '@/app/db/schema'
import { db } from '@/app/db/index'

export const GET = async () => {
  const allUsers = db.select().from(userTable).all()
  return NextResponse.json(allUsers)
}
