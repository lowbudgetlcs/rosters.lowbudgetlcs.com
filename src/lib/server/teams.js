import 'dotenv/config';
import { teams, divisions, groupKeys, players } from '$lib/server/database/appSchema';
import { fetchPuuid } from '$lib/server/riot';
import { sql, eq } from 'drizzle-orm';
import { app_db } from '$lib/server/database/db';

const SMALL_RATE = Number(process.env.SMALL_RATE);

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
    const { error, puuid } = await fetchPuuid(captain);
    sleep(SMALL_RATE);
    if (error) {
      console.error(error);
      return { error: error };
    }
    // Fetch player id
    const captainId = await app_db.select({ field1: players.id }).from(players).where(eq(players.primaryRiotPuuid, puuid));
    if (captainId.length != 1) {
      return { error: 'puuid fetch issue, if you are positive the player was created contact ruuffian immediately.' };
    }
    const { field1 } = captainId[0];
    captain_id = field1;
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

export async function fetchTeamListing() {
  try {
    const teamsFetch = await app_db.select({ teamName: teams.name, divisionName: divisions.name }).from(teams).leftJoin(divisions, eq(teams.divisionId, divisions.id));
    return { teamListing: teamsFetch };
  } catch (error) {
    console.error(error);
    return { error: "Error while fetching team listing" };
  }

}
