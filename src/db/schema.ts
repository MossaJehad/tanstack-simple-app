import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const tanstack = pgTable('tanstack', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	isDone: boolean('is_done').default(false).notNull(),
	createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true })
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
});
