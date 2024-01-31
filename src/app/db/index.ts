import { drizzle } from 'drizzle-orm/better-sqlite3'
import sqlite from 'better-sqlite3'

const client = sqlite(process.env.DATABASE_PATH)
client.pragma('journal_mode = WAL') // see https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md

export const db = drizzle(client)
