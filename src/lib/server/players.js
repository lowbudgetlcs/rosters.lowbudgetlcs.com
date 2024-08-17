import { count, eq, sql } from 'drizzle-orm';
import { app_db } from '$lib/server/database/db';
import { players, teams } from '$lib/server/database/appSchema';
import { insertAccount } from '$lib/server/accounts';
import { fetchPuuid } from '$lib/server/riot';

export async function insertPlayer(player) {
  const { name, team } = player;

  if (!name) return { error: 'Missing required data.' };

  // Fetch puuid
  const { error, puuid } = await fetchPuuid(name);
  if (error) {
    console.error(error);
    return { error: error };
  }
  // Check player doesn't exist
  const playerCount = await app_db.select({ value: count() }).from(players).where(eq(players.primaryRiotPuuid, puuid));
  const { value: recordCount } = playerCount[0];
  if (recordCount != 0)
    return {
      error: 'Player with that primary account already exists.'
    };
  // Query team id
  let team_id;
  if (team) {
    const teamFetch = await app_db.select().from(teams).where(sql`lower(${teams.name}) = lower(${team})`);
    if (teamFetch.length != 1) {
      return {
        error: 'Team not found.'
      };
    }
    team_id = teamFetch[0].id;
  }
  // Insert player
  let player_id;
  try {
    const row = await app_db.insert(players).values({
      primaryRiotPuuid: puuid,
      teamId: team_id || null,
      summonerName: name,
    }).returning();
    player_id = row[0].id;
  } catch (error) {
    console.error(error);
    return { error: 'Error inserting player record.' };
  }

  try {
    const account = { puuid: puuid, player_id: player_id, is_primary: true };
    await insertAccount(account);
  } catch (error) {
    console.error(error);
    return { error: 'Error inserting player into accounts table but player creation succeeded. Contact ruuffian immediately.' };
  }
  return { message: 'Successfully inserted player record.' };
}

export async function fetchPlayerListing() {
  try {
    const playerRes = await app_db.select({ summonerName: players.summonerName, teamName: teams.name }).from(players).leftJoin(teams, eq(players.teamId, teams.id));
    return { players: playerRes };
  }
  catch (err) {
    console.error(err);
    return { error: "Error fetching players, contact ruuffian" };
  }

}