import "dotenv/config";
import { app_db } from "$lib/server/database/db";
import { sql, count } from "drizzle-orm";
import { divisions } from "$lib/server/database/schema";
import type { Division, ErroredResponse } from "$lib/server/types";
import { createTournament } from "$lib/server/riot";

export async function insertDivision(
  division: Division,
): Promise<ErroredResponse<string>> {
  const { name, groups, description = "" } = division;
  // Check name is not taken
  const [divisionCheck] = await app_db
    .select({ records: count() })
    .from(divisions)
    .where(sql`lower(${divisions.name}) = lower(${name})`);
  if (divisionCheck) {
    return {
      error: `Division '${name}' already exists.`,
    };
  }

  try {
    // Create tournament
    const providerId = parseInt(process.env.providerId!!); // Need to create sesason meta data table tbh
    const { error, message: tournamentId } = await createTournament(
      name,
      providerId,
    );
    if (error) return { error: error };
    const tid = tournamentId!!;
    await app_db.transaction(async (tx) => {
      await tx.insert(divisions).values({
        name: name,
        groups: groups,
        description: description,
        tournamentId: tid,
        providerId: providerId,
      });
    });
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
    return { error: `Error while creating tournament ${name}.` };
  }

  return { message: `Division '${name}' created successfully.` };
}
