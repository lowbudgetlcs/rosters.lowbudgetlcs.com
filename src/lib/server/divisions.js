import 'dotenv/config';
import { app_db } from '$lib/server/database/db';
import { sql, eq } from 'drizzle-orm';
import { divisions } from '$lib/server/database/appSchema';

export async function insertDivision(division) {
  const { name, groups, description = "", tid } = division;

  if (!name || !groups || !tid) return { error: 'Missing required data.' };

  const divisionNameCheck = await app_db.select().from(divisions).where(sql`lower(${divisions.name}) = lower(${name})`);
  if (divisionNameCheck.length > 0) {
    return {
      error: 'Division with this name already exists.'
    };
  }
  const tournamentIdCheck = await app_db.select().from(divisions).where(eq(divisions.tournamentId, tid));
  if (tournamentIdCheck.length > 0) {
    return {
      error: 'Division with this tournament id already exists.'
    };
  }
  // Write to database
  try {
    await app_db.transaction(async (tx) => {
      await tx.insert(divisions).values({
        name: name,
        groups: groups,
        description: description,
        tournamentId: tid,
        providerId: process.env.RIOT_PROVIDER_ID,
      });
    });
  } catch (error) {
    console.error(error);
    return { error: 'Error inserting into database.' };
  }

  return { message: 'Division created successfully.' };
}