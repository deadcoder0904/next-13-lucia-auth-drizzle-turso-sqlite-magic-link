import type { Config } from 'drizzle-kit'
import 'dotenv/config'

export default {
  schema: './src/app/db/drizzle.schema.ts',
  out: './src/app/db/migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: process.env.DATABASE_PATH,
  },
  verbose: true,
} satisfies Config
