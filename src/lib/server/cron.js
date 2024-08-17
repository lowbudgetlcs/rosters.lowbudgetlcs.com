import { eq } from 'drizzle-orm';
import { players } from '$lib/server/database/appSchema';
import { fetchNameByPuuid } from '$lib/server/riot';
import { app_db } from '$lib/server/database/db';
import { Cron } from 'croner';

export function initCron() {
  // Summoner Name refresh
  Cron('35 23 * * *', { maxRetries: 1, timezone: 'America/New_York' }, async () => {
    console.info(`SUMMONER REFRESH STARTED @${new Date()}`);
    const playerList = await app_db.select({ id: players.id, puuid: players.primaryRiotPuuid, name: players.summonerName }).from(players);
    for (const player of playerList) {
      const { error, name } = await fetchNameByPuuid(player.puuid);
      if (error) {
        console.error(error);
      } else {
        const buildName = `${name.gameName}#${name.tagLine}`;
        if (player.name != buildName) {
          console.info(`Updated ${player.name} to ${buildName} (id ${player.id})`);
          await app_db.update(players)
            .set({ summonerName: buildName })
            .where(eq(players.id, player.id));
        }
      }
    }
    console.info(`SUMMONER REFRESH FINISHED @${new Date()}`);
  });
}