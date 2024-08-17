import 'dotenv/config';
export async function fetchPuuid(name) {
  // name = gameName#tag

  const [gameName, tag] = name.split("#");
  const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tag}`;
  const res = await fetch(url, {
    headers: {
      "X-Riot-Token": process.env.RIOT_TOKEN ?? ""
    }
  });
  sleep(10);
  if (!res.ok) {
    const body = await res.json();
    console.error(`Recieved ${res.status} ${body}`);
    if (res.status === 404) {
      return { error: 'Riot lookup failed, check for typos in player name. Ensure you include the \'#NA1\'' };
    }
    return { error: 'Error fetching player\'s puuid, contact ruuffian.' };

  }
  const body = await res.json();
  return { puuid: body.puuid };
}

export async function fetchNameByPuuid(puuid) {
  const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`;
  const res = await fetch(url, {
    headers: {
      "X-Riot-Token": process.env.RIOT_TOKEN ?? ""
    }
  });
  sleep(10);
  if (!res.ok) {
    console.error(`Recieved ${res.status}`);
    if (res.status === 404) {
      return { error: 'Failed to find player with that puuid.' };
    }
    return { error: 'Unknown error, check logs.' };
  }
  const body = await res.json();
  return { name: { gameName: body.gameName, tagLine: body.tagLine } };
}

const sleep = ms => new Promise(r => setTimeout(r, ms));