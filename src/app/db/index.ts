import { drizzle } from 'drizzle-orm/better-sqlite3'
import sqlite from 'better-sqlite3'

const client = sqlite(process.env['SQLITE_URL'])

export const db = drizzle(client)

// const result = db.select().from(users).all()
