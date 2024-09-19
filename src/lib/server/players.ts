import "dotenv/config";
import { count, eq, sql, desc } from "drizzle-orm";
import { app_db } from "$lib/server/database/db";
import { players, teams } from "$lib/server/database/schema";
import { insertAccount } from "$lib/server/accounts";
import { fetchPuuid } from "$lib/server/riot";
import type { Account, ErroredResponse, Player } from "./types";

/**
 *
 * @param player Player object to create player resource from
 * @returns Success or failure message
 */
export async function insertPlayer(
  player: Player
): Promise<ErroredResponse<string>> {
  const { riotId, team } = player;
  // Fetch puuid
  const { error, message: puuid } = await fetchPuuid(riotId);
  if (error) return { error: error };
  if (!puuid) return { error: "Did not recieve puuid, contact ruuffian." };
  // Check player doesn't exist
  const [playerCheck] = await app_db
    .select({ records: count() })
    .from(players)
    .where(eq(players.primaryRiotPuuid, puuid));
  if (playerCheck.records > 0)
    return {
      error: "Player with that primary account already exists.",
    };
  // Query team id
  const [teamFetch] = await app_db
    .select({ team_id: teams.id })
    .from(teams)
    .where(sql`lower(${teams.name}) = lower(${team})`);
  const team_id = teamFetch ? teamFetch.team_id : -1;
  if (team_id === -1) return { error: `Could not find team '${team}.` };
  // Insert player
  try {
    const { error, message } = await app_db.transaction(async (tx) => {
      const [player] = await tx
        .insert(players)
        .values({
          primaryRiotPuuid: puuid,
          teamId: team_id === 0 ? null : team_id,
          summonerName: riotId,
        })
        .returning();
      const account: Account = {
        puuid: puuid,
        player_id: player.id,
        is_primary: true,
      };
      const { error, message } = await insertAccount(account);
      if (error) return { error: error };
      return { message: "" };
    });
  } catch (e: any) {
    if (e instanceof Error) console.error(e.message);
    return { error: "Error while inserting player record." };
  }
  return { message: "Successfully inserted player record." };
}

/**
 *
 * @returns Message contains Player[]
 */
export async function fetchPlayerListing(): Promise<ErroredResponse<Player[]>> {
  try {
    const playerRes = await app_db
      .select({ riotId: players.summonerName, team: teams.name })
      .from(players)
      .leftJoin(teams, eq(players.teamId, teams.id))
      .orderBy(desc(teams.name));
    const listing = playerRes.filter(
      (player) => player.riotId !== null
    ) as Player[];
    return { message: listing };
  } catch (err) {
    console.error(err);
    return { error: "Error fetching players, contact ruuffian" };
  }
}

/**
 *
 * @param player Player object to add to team
 * @returns Success or failure message
 */
export async function addPlayerToTeam(
  player: Player
): Promise<ErroredResponse<string>> {
  const { riotId, team } = player;
  if (!riotId || !team) {
    return { error: "Missing required data." };
  }
  const { error, message: puuid } = await fetchPuuid(riotId);
  if (error) {
    return { error: error };
  } else if (!puuid) {
    return { error: `Didn't recive puuid for '${riotId}'` };
  }
  const [playerFetch] = await app_db
    .select()
    .from(players)
    .where(eq(players.primaryRiotPuuid, puuid))
    .limit(1);
  if (!playerFetch) {
    return { error: `No player '${riotId}' found in database.` };
  }

  const [teamFetch] = await app_db
    .select()
    .from(teams)
    .where(sql`lower(${teams.name}) = lower(${team})`)
    .limit(1);
  if (!teamFetch) {
    return { error: `No team '${team}' found in database.` };
  }

  try {
    await app_db.transaction(async (tx) => {
      await tx
        .update(players)
        .set({ teamId: teamFetch.id })
        .where(eq(players.id, playerFetch.id));
    });
  } catch (e: any) {
    if (e instanceof Error) console.error(e.message);
    return { error: `Unexpected error while updating '${riotId}' team id.` };
  }
  return {
    message: `Successfully added '${playerFetch.summonerName}' to '${teamFetch.name}'.`,
  };
}

/**
 *
 * @param player Player object to kick
 * @returns Success or failure message
 */
export async function removePlayerFromTeam(
  player: Player
): Promise<ErroredResponse<string>> {
  const { riotId } = player;
  if (!riotId) {
    return { error: "Missing required data." };
  }
  const { error, message: puuid } = await fetchPuuid(riotId);
  if (error) {
    return { error: error };
  } else if (!puuid) {
    return { error: "Did not recieve puuid." };
  }

  const [playerFetch] = await app_db
    .select()
    .from(players)
    .where(eq(players.primaryRiotPuuid, puuid));
  if (!playerFetch) {
    return { error: `No player '${riotId}' found in database.` };
  }

  try {
    await app_db.transaction(async (tx) => {
      await tx
        .update(players)
        .set({ teamId: null })
        .where(eq(players.id, playerFetch.id));
    });
  } catch (e: any) {
    if (e instanceof Error) console.error(e.message);
    return {
      error: `Unkown error occured while updating '${riotId}' team id.`,
    };
  }

  return { message: `Successfully kicked '${playerFetch.summonerName}'.` };
}

/**
 *
 * @param batch Players to batch create
 * @returns  Success or failure message
 */
export async function batchInsertPlayers(
  batch: Player[]
): Promise<ErroredResponse<string>> {
  let insertCount = 0;
  let errorCount = 0;
  const erroredPlayers: string[] = [];
  if (batch.length === 0) {
    return { error: "Please enter data." };
  }
  for (const row of batch) {
    const player = row.riotId.trim();
    const team = row.team?.trim();
    if (!player) {
      continue;
    }
    const { error } = await insertPlayer({ riotId: player, team: team });
    if (error) {
      console.error(error);
      errorCount++;
      erroredPlayers.push(player);
    } else {
      insertCount++;
    }
  }
  console.warn(
    `Encountered errors with the following players: ${erroredPlayers}`
  );
  const msg = `Inserted ${insertCount} player(s) with ${errorCount} errors. Contact ruuffian for details on errors.`;
  return { message: msg };
}
