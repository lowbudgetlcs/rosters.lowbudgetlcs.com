import 'dotenv/config';
import { defineConfig } from "drizzle-kit";

const connectionString = process.env.POSTGRES_INTROSPECT_URI;
export default defineConfig({
  schema: "./src/schema/*",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  }
});