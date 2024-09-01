import 'dotenv/config';
import { count, eq, sql } from 'drizzle-orm';
import { app_db } from '$lib/server/database/db';
import { players, teams } from '$lib/server/database/schema';
import { insertAccount } from '$lib/server/accounts';
import { fetchPuuid } from '$lib/server/riot';
import { sleep } from '$lib/utils';
import type { Account, Player } from './types';

const SMALL_RATE = Number(process.env.SMALL_RATE);


export async function insertPlayer(player: Player) {
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
  let team_id: number | undefined;
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
  try {
    await app_db.transaction(async (tx) => {
      const row = await tx.insert(players).values({
        primaryRiotPuuid: puuid,
        teamId: team_id || null,
        summonerName: name,
      }).returning();
      const player_id = row[0].id;
      try {
        const account: Account = { puuid: puuid, player_id: player_id, is_primary: true };
        await insertAccount(account);
      } catch (error) {
        console.error(error);
        return { error: 'Error inserting player into accounts table but player creation succeeded. Contact ruuffian immediately.' };
      }
    });
  } catch (error) {
    console.error(error);
    return { error: 'Error inserting player record.' };
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

// data = { name = gameName#tagLine, team = name }
export async function addPlayerToTeam(player: Player) {
  const { name, team } = player;
  if (!name || !team) {
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

  const teamFetch = await app_db.select().from(teams).where(sql`lower(${teams.name}) = lower(${team})`);
  if (teamFetch.length === 0) {
    return { error: `No team '${team}' found in database.` };
  }

  try {
    await app_db.transaction(async (tx) => {
      await tx.update(players).set({ teamId: teamFetch[0].id }).where(eq(players.id, playerFetch[0].id));
    });
  } catch (error) {
    console.error(error);
    return { error: "Error updating team id, please contact ruuffian." };
  }
  return { message: `Successfully added '${playerFetch[0].summonerName}' to '${teamFetch[0].name}'.` };

}

// player = { name = gameName#tagLine }
export async function removePlayerFromTeam(player: Player) {
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
    await app_db.transaction(async (tx) => {
      await tx.update(players).set({ teamId: null }).where(eq(players.id, playerFetch[0].id));
    });
  } catch (error) {
    console.error(error);
    return { error: "Error updating team id, please contact ruuffian." };
  }

  return { message: `Successfully kicked '${playerFetch[0].summonerName}'.` };
}

// batch = { batch: "player,team\nplayer,team\n..."}
export async function batchInsertPlayers(batch: Player[]) {
  let insertCount = 0;
  let errorCount = 0;
  if (batch.length === 0) {
    return { error: "Please enter data" };
  }
  for (const row of batch) {
    const player = row.name.trim()
    const team = row.team?.trim()
    if (!player) {
      continue;
    }
    const { error } = await insertPlayer({ name: player, team: team });
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