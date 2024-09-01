import 'dotenv/config';

export async function fetchPuuid(name: string) {
  // name = gameName#tag
  const [gameName, tag] = name.split("#");
  const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tag}`;
  try {
    const res = await fetch(url, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_TOKEN ?? ""
      }
    });
    const body = await res.json();
    if (!res.ok) {
      console.error(`Recieved ${res.status} ${JSON.stringify(body)}`);
      if (res.status === 404) {
        return { error: `Riot lookup for '${name}' failed, check for typos in player name. Ensure you include the '#NA1'` };
      }
      return { error: `Error fetching '${name}' puuid, contact ruuffian.` };
    }
    return { puuid: body.puuid };
  } catch (error) {
    console.error(error);
    return { error: `Error fetching '${name}' puuid, contact ruuffian.` };
  }
}

export async function fetchNameByPuuid(puuid: string) {
  const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`;
  try {
    const res = await fetch(url, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_TOKEN ?? ""
      }
    });
    const body = await res.json();
    if (!res.ok) {
      console.error(`Recieved ${res.status} ${JSON.stringify(body)}`);
      if (res.status === 404) {
        return { error: 'Failed to find player with that puuid.' };
      }
      return { error: `Error fetching '${puuid}' puuid, contact ruuffian.` };
    }
    return { name: { gameName: body.gameName, tagLine: body.tagLine } };
  } catch (error) {
    console.error(error);
    return { error: `Error fetching '${puuid}' puuid, contact ruuffian.` };
  }
}