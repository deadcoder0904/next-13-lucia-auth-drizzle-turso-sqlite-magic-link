import type { Config } from 'drizzle-kit'
import 'dotenv/config'

export default {
  schema: './src/app/db/schema.ts',
  out: './src/app/db/migrations',
  driver: 'turso',
  dbCredentials: {
    url: process.env['TURSO_URL'],
    authToken: process.env['TURSO_AUTH_TOKEN'],
  },
  verbose: true,
} satisfies Config
