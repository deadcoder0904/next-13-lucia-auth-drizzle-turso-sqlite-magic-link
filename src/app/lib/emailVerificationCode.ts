import { generateId } from 'lucia'
import { eq } from 'drizzle-orm'
import { TimeSpan, createDate } from 'oslo'
import { generateRandomString, alphabet } from 'oslo/crypto'

import { db } from '@/app/db/index'
import { emailVerificationCodeTable } from '@/app/db/drizzle.schema'

export async function generateEmailVerificationCode(
  userId: string
): Promise<string> {
  await db
    .delete(emailVerificationCodeTable)
    .where(eq(emailVerificationCodeTable.userId, userId))

  const code = generateRandomString(6, alphabet('0-9', 'A-Z'))

  await db.insert(emailVerificationCodeTable).values({
    code,
    expiresAt: createDate(new TimeSpan(1, 'm')).getTime(), // 5 minutes
    userId,
  })

  return code
}
