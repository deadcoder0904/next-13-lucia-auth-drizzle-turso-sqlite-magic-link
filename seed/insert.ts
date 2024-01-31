import { generateId } from 'lucia'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

import { db } from '@/app/db/index'
import { userTable } from '@/app/db/drizzle.schema'

const seedUsers = (db: BetterSQLite3Database<Record<string, never>>) => {
  const userData: (typeof userTable.$inferInsert)[] = [
    {
      email: 'a@a.com',
      emailVerified: 1,
    },
    {
      email: 'b@b.com',
      emailVerified: 1,
    },
    {
      email: 'c@c.com',
      emailVerified: 1,
    },
  ]

  try {
    db.insert(userTable).values(userData).run()

    const users = db.select().from(userTable).all()

    console.log({ users })
  } catch (err) {
    console.error('Something went wrong...')
    console.error(err)
  }
}

const main = () => {
  console.log('🧨 Started seeding the database...\n')
  seedUsers(db)
  console.log('\n🧨 Done seeding the database successfully...\n')
}

main()
