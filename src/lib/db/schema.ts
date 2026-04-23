import { pgTable, serial, text, integer, timestamp, varchar, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 20 }).default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  sku: varchar('sku', { length: 50 }).notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  quantity: integer('quantity').notNull().default(0),
  minStock: integer('min_stock').notNull().default(5),
  category: varchar('category', { length: 100 }),
  lastUpdated: timestamp('last_updated').defaultNow(),
}, (table) => ({
  skuIdx: index('sku_idx').on(table.sku),
  nameIdx: index('name_idx').on(table.name),
  categoryIdx: index('category_idx').on(table.category),
  quantityCheck: check('quantity_check', sql`${table.quantity} >= 0`),
}));

export const inventoryLog = pgTable('inventory_log', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }),
  changeAmount: integer('change_amount').notNull(),
  reason: text('reason'),
  timestamp: timestamp('timestamp').defaultNow(),
});
