import 'dotenv/config';
import { teams, divisions, players } from '$lib/server/database/schema';
import { fetchPuuid } from '$lib/server/riot';
import { sql, eq } from 'drizzle-orm';
import { app_db } from '$lib/server/database/db';
import { sleep } from '$lib/utils'

const SMALL_RATE = Number(process.env.SMALL_RATE);

function getGroupNumber(group: string) {
  return group.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;
}

type Team = {
  name: string,
  division: string,
  group: string,
  captain: string | null,
  logo: string | null
}

export async function insertTeam(team: Team) {
  const { name, division, group, captain = "", logo = "" } = team;

  // Null checks for req params
  if (!name || !division || !group) return { error: 'Missing required parameter.' };

  // Check team name exists
  const checkTeam = await app_db.select().from(teams).where(sql`lower(${teams.name}) = lower(${name})`);
  if (checkTeam.length > 0) {
    return { error: 'Team already exists with that name.' };
  }

  // Fetch division id
  const divisionId = await app_db.select({ division_id: divisions.id, groups: divisions.groups }).from(divisions).where(sql`lower(${divisions.name}) = lower(${division})`);
  if (divisionId.length != 1) {
    return { error: 'No or multiple divisions with that name (how??).' };
  }
  const { division_id, groups } = divisionId[0];
  // Check group exists
  if (getGroupNumber(group) > groups || getGroupNumber(group) < 1) {
    return { error: `Invalid group for ${division}` }
  }


  // If given captain fetch captain id
  if (captain) {
    // Fetch riot PUUID
    const { error, puuid } = await fetchPuuid(captain);
    sleep(SMALL_RATE);
    if (error) {
      console.error(error);
      return { error: error };
    }
    // Fetch player id
    const captainId = await app_db.select({ captain_id: players.id }).from(players).where(eq(players.primaryRiotPuuid, puuid));
    if (captainId.length != 1) {
      return { error: 'puuid fetch issue, if you are positive the player was created contact ruuffian immediately.' };
    }
    const { captain_id } = captainId[0];
    try {
      await app_db.transaction(async (tx) => {
        await tx.insert(teams).values({
          name: name,
          divisionId: division_id,
          groupId: group,
          captainId: captain_id || null,
          logo: logo
        });
      });
    } catch (error) {
      console.error(error);
      return { error: 'Error inserting team record into database.' };
    }
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
