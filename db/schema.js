import { pgTable, text, numeric, boolean, integer, bigint, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id:           text('id').primaryKey(),
  firstName:    text('first_name').notNull(),
  lastName:     text('last_name').notNull(),
  email:        text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  provider:     text('provider').notNull().default('email'), // 'email' | 'google'
  createdAt:    timestamp('created_at').notNull().defaultNow(),
});

export const trips = pgTable('trips', {
  id:          text('id').primaryKey(),
  userId:      text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name:        text('name').notNull().default(''),
  destination: text('destination').notNull().default(''),
  startDate:   text('start_date').notNull().default(''),
  endDate:     text('end_date').notNull().default(''),
  budget:      numeric('budget').notNull().default('0'),
  currency:    text('currency').notNull().default('ILS'),
  createdAt:   bigint('created_at', { mode: 'number' }).notNull(),
});

export const expenses = pgTable('expenses', {
  id:     text('id').primaryKey(),
  tripId: text('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  amount: numeric('amount').notNull(),
  cat:    text('cat').notNull(),
  note:   text('note').notNull().default(''),
  date:   text('date').notNull(),
});

export const checklistCategories = pgTable('checklist_categories', {
  id:        text('id').primaryKey(),
  tripId:    text('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  title:     text('title').notNull(),
  emoji:     text('emoji').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const checklistItems = pgTable('checklist_items', {
  id:         text('id').primaryKey(),
  categoryId: text('category_id').notNull().references(() => checklistCategories.id, { onDelete: 'cascade' }),
  text:       text('text').notNull(),
  done:       boolean('done').notNull().default(false),
  sortOrder:  integer('sort_order').notNull().default(0),
});
