import { drizzle } from 'drizzle-orm/better-sqlite3'
import sqlite from 'better-sqlite3'

const client = sqlite(process.env.DATABASE_PATH)

export const db = drizzle(client)
