import 'dotenv/config';
import { count, eq, sql } from 'drizzle-orm';
import { app_db } from '$lib/server/database/db';
import { players, teams } from '$lib/server/database/appSchema';
import { insertAccount } from '$lib/server/accounts';
import { fetchPuuid } from '$lib/server/riot';
import { sleep } from '$lib/utils';

const SMALL_RATE = Number(process.env.SMALL_RATE);

export async function insertPlayer(player) {
  const { name, team } = player;

  if (!name) return { error: 'Missing required data.' };

  // Fetch puuid
  const { error, puuid } = await fetchPuuid(name);
  sleep(SMALL_RATE);
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

// player = { name = gameName#tagLine }
export async function removePlayerFromTeam(player) {
  const { name } = player;
  if (!name) {
    return { error: "Missing required data." };
  }
  const { error, puuid } = await fetchPuuid(name);
  if (error) {
    return { error: error };
  }

  const playerFetch = await app_db.select().from(players).where(eq(players.primaryRiotPuuid, puuid));
  if (playerFetch.length === 0) {
    return { error: `No player '${name} found in database.` };
  }

  try {
    await app_db.update(players).set({ teamId: null }).where(eq(players.id, playerFetch[0].id));
  } catch (error) {
    console.error(error);
    return { error: "Error updating team id, please contact ruuffian." };
  }

  return { message: `Successfully kicked '${name}'.` };
}

// batch = { batch: "player,team\nplayer,team\n..."}
export async function batchInsertPlayers(data) {
  const { batch } = data;
  let insertCount = 0;
  let errorCount = 0;
  const rows = batch.split("\n");
  if (batch.length === 0) {
    return { error: "Please enter data" };
  }
  for (const row of rows) {
    const [player, team] = row.split(",").map(s => s.trim());
    if (!player) {
      continue;
    }
    const { _, error } = await insertPlayer({ name: player, team: team });
    sleep(SMALL_RATE);
    if (error) {
      console.error(`Error inserting ${row}: ${error}`);
      errorCount++;
    } else {
      insertCount++;
    }
  }
  const msg = `Inserted ${insertCount} player(s) with ${errorCount} errors. Contact ruuffian for details on errors.`;
  return { message: msg };
}