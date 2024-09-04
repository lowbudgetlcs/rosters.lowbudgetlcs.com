import "dotenv/config";
import { teams, divisions, players } from "$lib/server/database/schema";
import { fetchPuuid } from "$lib/server/riot";
import { sql, eq, and } from "drizzle-orm";
import { app_db } from "$lib/server/database/db";
import type { ErroredResponse, Team } from "$lib/server/types";
import { insertPlayer } from "./players";

function getGroupNumber(group: string) {
  return group.toUpperCase().charCodeAt(0) - "A".charCodeAt(0) + 1;
}

export async function insertTeam(team: Team): Promise<ErroredResponse<string>> {
  const { name, division, group, captain = "", logo = "" } = team;
  // Check team name exists
  const [teamCheck] = await app_db
    .select()
    .from(teams)
    .where(sql`lower(${teams.name}) = lower(${name})`);
  if (teamCheck) {
    return { error: "Team already exists with that name." };
  }

  // Fetch division id
  const [leagueId] = await app_db
    .select({ division_id: divisions.id, groups: divisions.groups })
    .from(divisions)
    .where(sql`lower(${divisions.name}) = lower(${division})`);
  if (leagueId) {
    return { error: `Division '${division}' not found.` };
  }
  const { division_id, groups } = leagueId;
  // Check group exists
  if (getGroupNumber(group) > groups || getGroupNumber(group) < 1) {
    return { error: `Invalid group for ${division}` };
  }

  // If given captain fetch captain id
  const { error, message: captain_id } = await (async (
    captain: string | null
  ): Promise<ErroredResponse<number>> => {
    if (!captain) return { message: -1 };
    // Fetch riot PUUID
    const { error: puuidError, message: puuid } = await fetchPuuid(captain);
    if (puuidError || !puuid) {
      const errMessage = puuidError || `Did not recieve puuid for '${captain}'`;
      console.error(error);
      return { error: errMessage };
    }

    // Fetch player id
    const [captainId] = await app_db
      .select({ captain_id: players.id })
      .from(players)
      .where(eq(players.primaryRiotPuuid, puuid));

    if (captainId) return { message: captainId.captain_id };
    else return { error: `Please create captain before adding to team.` };
  })(captain);
  if (error) return { error: error };

  try {
    await app_db.transaction(async (tx) => {
      await tx.insert(teams).values({
        name: name,
        divisionId: division_id,
        groupId: group,
        captainId: captain_id != -1 ? captain_id || null : null,
        logo: logo,
      });
    });
  } catch (error) {
    console.error(error);
    return { error: "Error inserting team record into database." };
  }

  return { message: "Team inserted successfully." };
}

export async function fetchTeamListing(): Promise<ErroredResponse<Team[]>> {
  try {
    const teamsFetch = await app_db
      .select({
        name: teams.name,
        division: divisions.name,
        group: teams.groupId,
        captain: players.summonerName,
        logo: teams.logo,
      })
      .from(teams)
      .leftJoin(players, eq(players.id, teams.captainId))
      .leftJoin(divisions, eq(teams.divisionId, divisions.id))
      .orderBy(divisions.id);
    return { message: teamsFetch };
  } catch (error) {
    console.error(error);
    return { error: "Error while fetching team listing" };
  }
}
