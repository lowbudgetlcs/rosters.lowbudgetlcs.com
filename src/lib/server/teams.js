import 'dotenv/config';
import { teams, divisions, groupKeys, players } from '$lib/server/database/appSchema';
import { sql, eq } from 'drizzle-orm';
import { app_db } from '$lib/server/database/db';

export async function insertTeam(team) {
  const { name, division, group, captain = "", logo = "" } = team;

  // Null checks for req params
  if (!name || !division || !group) return { error: 'Missing required parameter.' };

  // Check team name exists
  const checkTeam = await app_db.select().from(teams).where(sql`lower(${teams.name}) = lower(${name})`);
  if (checkTeam.length > 0) {
    return { error: 'Team already exists with that name.' };
  }

  // Fetch division id
  const divisionId = await app_db.select({ field1: divisions.id }).from(divisions).where(sql`lower(${divisions.name}) = lower(${division})`);
  if (divisionId.length != 1) {
    return { error: 'No or multiple divisions with that name (how??).' };
  }
  const { field1: division_id } = divisionId[0];
  // Check group exists?
  const groupCheck = await app_db.select().from(groupKeys).where(sql`lower(${groupKeys.letter}) = lower(${group})`);
  if (groupCheck.length != 1) {
    return { error: 'Invalid group name.' };
  }

  // If given captain fetch captain id
  let captain_id;
  if (captain) {
    // Fetch riot PUUID
    const puuid = "abcd";
    // Fetch player id
    const captainId = await app_db.select(players.id).from(players).where(eq(players.riotPuuid, puuid));
    if (captainId.length != 1) {
      return { error: 'puuid issue, if you are positive the player was created contact ruuffian immediately.' };
    }
    captain_id = captainId[0].id;
  }

  try {
    await app_db.insert(teams).values({
      name: name,
      divisionId: division_id,
      groupId: group,
      captainId: captain_id || null,
      logo: logo
    });
  } catch (error) {
    console.error(error);
    return { error: 'Error inserting team record into database.' };
  }
  return { message: 'Team inserted successfully.' };
}
