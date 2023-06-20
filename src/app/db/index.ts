import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env['TURSO_URL'],
  authToken: process.env['TURSO_AUTH_TOKEN'],
})

export const db = drizzle(client)

// const result = db.select().from(users).all()
