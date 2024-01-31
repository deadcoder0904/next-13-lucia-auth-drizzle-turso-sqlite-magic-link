import React from 'react'
import { Lucia, TimeSpan, type User, type Session } from 'lucia'
import { cookies } from 'next/headers'

import { db } from '@/app/db/index'
import { userTable, sessionTable } from '@/app/db/drizzle.schema'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'

const IS_DEV = process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD'

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: 'user_session',
    expires: false,
    attributes: {
      secure: !IS_DEV,
    },
  },
  sessionExpiresIn: new TimeSpan(1, 'm'), // 1 month
  getUserAttributes: (attributes) => {
    return {
      emailVerified: attributes.emailVerified,
      email: attributes.email,
    }
  },
})

const uncachedValidateRequest = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null
  if (!sessionId) {
    return {
      user: null,
      session: null,
    }
  }

  const result = await lucia.validateSession(sessionId)
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie()
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }
  } catch {}
  return result
}

export const validateRequest = React.cache(uncachedValidateRequest)

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: {
      email: string
      emailVerified: number
    }
  }
}
