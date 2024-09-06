import "dotenv/config";
import { RiotAPI, RiotAPITypes, PlatformId } from "@fightmegg/riot-api";
import type { ErroredResponse } from "./types";

const config: RiotAPITypes.Config = {
  debug: process.env.NODE_ENV === "development",
};
export const riot = new RiotAPI(process.env.RIOT_API_TOKEN!!, config);

/**
 *
 * @param riotId riotId - gameName#tagLine
 * @returns {Promise<ErroredResponse>} Message contains puuid - message = puuid
 */
export async function fetchPuuid(
  riotId: string,
): Promise<ErroredResponse<string>> {
  const [gameName, tagLine] = riotId.split("#");
  console.log(gameName);
  console.log(tagLine);
  if (!gameName || !tagLine)
    return { error: `'${riotId}' not properly formatted: gameName#tagLine` };
  try {
    const account = await riot.account.getByRiotId({
      region: PlatformId.AMERICAS,
      gameName,
      tagLine,
    });
    return { message: account.puuid };
  } catch (e: any) {
    if (e instanceof Error) console.error(e.message);
    return { error: `Riot lookup for '${riotId}' failed.` };
  }
}

/**
 *
 * @param puuid Encrypted puuid
 * @returns {Promise<ErroredResponse>} Message contains Riot Id - message = rioId
 */
export async function fetchNameByPuuid(
  puuid: string,
): Promise<ErroredResponse<string>> {
  try {
    const account = await riot.account.getByPUUID({
      region: PlatformId.AMERICAS,
      puuid,
    });
    if (account.gameName && account.tagLine)
      return { message: `${account.gameName}#${account.tagLine}` };
    else
      return {
        error: `'${account.gameName}' or '${account.tagLine}' empty`,
      };
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
    return {
      error: `Could not find name for '${puuid}'. Are you using the correct API Key?`,
    };
  }
}
/**
 *
 * @param {string} name Name of the tournament.
 * @param {number} providerId - Provided by ruuffian.
 * @returns Message contains Tournament ID - message = tournamentId
 */
export async function createTournament(
  name: string,
  providerId: number,
): Promise<ErroredResponse<number>> {
  const body: RiotAPITypes.TournamentV5.TournamentRegistrationParametersV5DTO =
    {
      name: name,
      providerId: providerId,
    };
  try {
    const tournament = await riot.tournamentV5.createTournament({ body });
    console.info(`Created tournament #${tournament}.`);
    return {
      message: tournament,
    };
  } catch (e: any) {
    if (e instanceof Error) console.error(e.message);
    return { error: `Error while registering tournament '${name}'.` };
  }
}
