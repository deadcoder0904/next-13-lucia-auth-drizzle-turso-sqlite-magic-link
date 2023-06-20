import type { Config } from 'drizzle-kit'
import 'dotenv/config'

export default {
  schema: './src/app/db/schema.ts',
  out: './src/app/db/migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: process.env['SQLITE_URL'],
  },
  verbose: true,
} satisfies Config
