import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
  // During build time on some CI/CD, DATABASE_URL might be missing.
  // We can provide a dummy or just export a null-safe proxy if needed, 
  // but usually Next.js build needs this to be present if used in server components.
  console.warn("DATABASE_URL is missing. Database operations will fail.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
