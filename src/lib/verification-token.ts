import { generateRandomString, isWithinExpiration } from 'lucia/utils'
import { eq } from 'drizzle-orm'

import { db } from '@/app/db'
import { emailVerificationTokens } from '@/app/db/schema'

const EMAIL_VERIFICATION_TOKEN_EXPIRES_IN = 1000 * 60 * 60 * 2 // 2 hours

export const generateVerificationToken = async (userId: string) => {
  try {
    const storedUserTokens = await db
      .select()
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.userId, userId))
      .run()

    if (storedUserTokens.rows.length > 0) {
      const reusableStoredToken = storedUserTokens.rows.find((token) => {
        return isWithinExpiration(
          Number(token.expires) - EMAIL_VERIFICATION_TOKEN_EXPIRES_IN / 2
        )
      })
      if (reusableStoredToken) return reusableStoredToken.id?.toString()
    }

    const token = generateRandomString(64)

    await db
      .insert(emailVerificationTokens)
      .values({
        id: token,
        userId,
        expires: new Date().getTime() + EMAIL_VERIFICATION_TOKEN_EXPIRES_IN,
      })
      .run()

    return token
  } catch (e) {
    console.error({ e })
  }
}

export const validateEmailVerificationToken = async (token: string) => {
  const storedToken = await db
    .select()
    .from(emailVerificationTokens)
    .where(eq(emailVerificationTokens.id, token))
    .run()

  if (!storedToken.rows.length) return null

  const tokenExpires = Number(storedToken.rows[0].expires)
  if (!isWithinExpiration(tokenExpires)) return null

  const userId = String(storedToken.rows[0]['user_id'])

  // we can invalidate all tokens since a user only verifies their email once
  await db
    .delete(emailVerificationTokens)
    .where(eq(emailVerificationTokens.userId, userId))
    .run()

  return userId
}
