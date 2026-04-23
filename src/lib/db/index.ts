import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Esta configuración es vital para que Vercel no de error 404 al fallar el build
const connectionString = process.env.DATABASE_URL;

let dbInstance: any;

if (connectionString) {
  const pool = new Pool({
    connectionString,
    max: 1, // Limitar conexiones para Supabase Free
  });
  dbInstance = drizzle(pool, { schema });
} else {
  // Objeto vacío seguro para que el build no explote
  dbInstance = {
    select: () => ({ from: () => ({ where: () => ({ limit: () => [] }), orderBy: () => [] }) }),
    insert: () => ({ values: () => ({ returning: () => [] }) }),
    update: () => ({ set: () => ({ where: () => [] }) }),
    delete: () => ({ where: () => [] }),
  };
}

export const db = dbInstance;
