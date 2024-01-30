import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

import { db } from '@/app/db/index'
import { sessionTable, userTable } from '@/app/db/drizzle.schema'

const cleanupDatabase = (db: BetterSQLite3Database<Record<string, never>>) => {
  try {
    const users = db.delete(userTable).run()
    const sessions = db.delete(sessionTable).run()
    console.log({ users, sessions })
  } catch (err) {
    console.error('Something went wrong...')
    console.error(err)
  }
}

const main = () => {
  console.log('🧨 Started deleting the database...\n')
  cleanupDatabase(db)
  console.log('\n🧨 Done deleting the database successfully...\n')
}

main()
