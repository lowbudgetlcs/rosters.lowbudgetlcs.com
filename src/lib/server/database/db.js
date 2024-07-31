import 'dotenv/config';
import { drizzle as drizzleLite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import Database from 'better-sqlite3';

const sqlite = Database(process.env.META_DB_PATH);
export const meta_db = drizzleLite(sqlite);

const connectionString = process.env.POSTGRES_CONNECTION_URI;
const pg = postgres(connectionString);
export const app_db = drizzlePg(pg);