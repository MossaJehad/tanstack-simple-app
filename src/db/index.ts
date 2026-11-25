import { config } from 'dotenv';

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema.ts';

config();

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
	throw new Error(
		'Missing DATABASE_URL (or POSTGRES_URL) environment variable. Set a hosted PostgreSQL connection string in your environment (e.g. Vercel Project Settings -> Environment Variables).',
	);
}

if (
	process.env.VERCEL &&
	/(?:localhost|127\.0\.0\.1)/i.test(connectionString)
) {
	throw new Error(
		'DATABASE_URL points to localhost/127.0.0.1, which is unreachable from Vercel. Use a hosted PostgreSQL database (e.g. Neon, Supabase, or Vercel Storage Postgres).',
	);
}

const pool = new Pool({
	connectionString,
});
export const db = drizzle(pool, { schema });
