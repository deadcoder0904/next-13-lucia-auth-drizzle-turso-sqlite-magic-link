import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'

import { relations } from 'drizzle-orm'

export const tableNames = {
  user: 'auth_user',
  session: 'auth_session',
  key: 'auth_key',
  emailVerificationToken: 'email_verification_token',
}

export const users = sqliteTable(tableNames.user, {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  session: many(sessions),
  key: many(keys),
  emailVerificationToken: many(emailVerificationTokens),
}))

export const sessions = sqliteTable(
  tableNames.session,
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    activeExpires: integer('active_expires').notNull(),
    idleExpires: integer('idle_expires').notNull(),
  },
  (session) => {
    return {
      userIdx: uniqueIndex('session_user_idx').on(session.userId),
    }
  }
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const keys = sqliteTable(
  tableNames.key,
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    hashedPassword: text('hashed_password'),
  },
  (key) => {
    return {
      userIdx: uniqueIndex('keys_user_idx').on(key.userId),
    }
  }
)

export const keysRelations = relations(keys, ({ one }) => ({
  user: one(users, {
    fields: [keys.userId],
    references: [users.id],
  }),
}))

export const emailVerificationTokens = sqliteTable(
  tableNames.emailVerificationToken,
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    expires: integer('expires'),
  }
)

export const emailVerificationTokensRelations = relations(
  emailVerificationTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [emailVerificationTokens.userId],
      references: [users.id],
    }),
  })
)
