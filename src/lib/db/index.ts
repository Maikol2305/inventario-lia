import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const isProduction = process.env.NODE_ENV === 'production';
const hasDbUrl = !!process.env.DATABASE_URL;

let dbInstance: any = null;

if (hasDbUrl) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  dbInstance = drizzle(pool, { schema });
} else {
  // Dummy db object to avoid build errors
  dbInstance = {
    select: () => ({ from: () => ({ where: () => ({ limit: () => [] }) }) }),
    insert: () => ({ values: () => ({ returning: () => [] }) }),
    update: () => ({ set: () => ({ where: () => [] }) }),
    delete: () => ({ where: () => [] }),
  };
}

export const db = dbInstance;
