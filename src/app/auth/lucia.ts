import { lucia } from 'lucia'
import { nextjs } from 'lucia/middleware'
import { libsql } from '@lucia-auth/adapter-sqlite'

import { client } from '@/app/db/index'
import { tableNames } from '@/app/db/schema'
import { IS_DEV } from '@/lib/constants'

export const auth = lucia({
  adapter: libsql(client, tableNames),
  env: IS_DEV,
  middleware: nextjs(),
  getUserAttributes: (user: any) => {
    return {
      email: user.email,
    }
  },
  csrfProtection: true,
  requestOrigins: ['http://localhost:3000'],
  sessionCookie: {
    name: 'user_session',
    attributes: {
      sameSite: 'strict',
    },
  },
  sessionExpiresIn: {
    activePeriod: 1000 * 60 * 60 * 24 * 30, // 1 month
    idlePeriod: 0, // disable session renewal
  },
  experimental: {
    debugMode: IS_DEV ? true : false,
  },
})

export type Auth = typeof auth
