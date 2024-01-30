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
  emailVerified: integer('email_verified').notNull(),
})

export const userTableRelations = relations(userTable, ({ many }) => ({
  session: many(sessionTable),
  emailVerificationCode: many(emailVerificationCodeTable),
}))

export const sessionTable = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }),
  expiresAt: integer('expires_at').notNull(),
})

export const sessionTableRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}))

export const emailVerificationCodeTable = sqliteTable(
  'email_verification_code',
  {
    id: text('id').primaryKey(),
    code: text('code'),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    expiresAt: integer('expires_at'),
  }
)

export const emailVerificationCodeRelations = relations(
  emailVerificationCodeTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [emailVerificationCodeTable.userId],
      references: [userTable.id],
    }),
  })
)
