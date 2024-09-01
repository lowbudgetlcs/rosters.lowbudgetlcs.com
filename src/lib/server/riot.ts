import "dotenv/config";
import { RiotAPI, RiotAPITypes, PlatformId } from "@fightmegg/riot-api";
import type { ErroredResponse } from "./types";

const config: RiotAPITypes.Config = {
  debug: process.env.NODE_ENV != "PROD",
};

const riot = new RiotAPI(process.env.RIOT_API_TOKEN!!, config);

/**
 *
 * @param riotId riotId - gameName#tagLine
 * @returns {Promise<ErroredResponse>} Message contains the encrypted puuid
 */
export async function fetchPuuid(riotId: string): Promise<ErroredResponse> {
  // name = gameName#tag
  const [gameName, tagLine] = riotId.split("#");
  try {
    const account = await riot.account.getByRiotId({
      region: PlatformId.AMERICAS,
      gameName,
      tagLine,
    });
    return { message: account.puuid };
  } catch (e: any) {
    const msg = `Riot lookup for ${riotId} failed.`;
    if (e instanceof Error) console.error(e.message);
    return { error: msg };
  }
}

/**
 *
 * @param puuid Encrypted puuid
 * @returns {Promise<ErroredResponse>} Message contains 'gameName#tagLine'
 */
export async function fetchNameByPuuid(
  puuid: string
): Promise<ErroredResponse> {
  try {
    const account = await riot.account.getByPUUID({
      region: PlatformId.AMERICAS,
      puuid,
    });
    if (account.gameName && account.tagLine)
      return { message: `${account.gameName}#${account.tagLine}` };
    else
      return {
        error: `Coult not find name for ${puuid}. Are you using the correct API key?`,
      };
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
    return { error: `Could not find name for ${puuid}.` };
  }
}
