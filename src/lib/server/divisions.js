import 'dotenv/config';
import { app_db } from '$lib/server/database/db';
import { eq } from 'drizzle-orm';
import { divisions } from '$lib/server/database/appSchema';

export async function insertDivision(name, groups, description) {
  if (!name || !groups) return { error: 'Missing required data.' };

  const division = await app_db.select().from(divisions).where(eq(divisions.name, name));
  if (division.length > 0) {
    return {
      error: 'Division with this name already exists.'
    };
  }
  // Write to database
  try {
    await app_db.insert(divisions).values({
      name: name,
      groups: groups,
      description: description || null,
      tournamentId: 1,
      providerId: process.env.PROVIDER_ID,
    });
  } catch (error) {
    console.error(error);
    return { error: 'Error inserting into database.' };
  }

  return { message: 'Division created successfully.' };
}