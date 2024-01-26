import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'

import { relations } from 'drizzle-orm'

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
})

export const userTableRelations = relations(userTable, ({ many }) => ({
  session: many(sessionTable),
  emailVerificationToken: many(emailVerificationTokenTable),
}))

export const sessionTable = sqliteTable(
  'session',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    expiresAt: integer('expires_at').notNull(),
  },
  (session) => {
    return {
      userIdx: uniqueIndex('session_userId_idx').on(session.userId),
    }
  }
)

export const sessionTableRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}))

export const emailVerificationTokenTable = sqliteTable(
  'email_verification_token',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
    expires: integer('expires'),
  }
)

export const emailVerificationTokenTableRelations = relations(
  emailVerificationTokenTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [emailVerificationTokenTable.userId],
      references: [userTable.id],
    }),
  })
)
