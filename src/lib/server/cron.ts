import "dotenv/config";
import { eq } from "drizzle-orm";
import { players } from "$lib/server/database/schema";
import { fetchNameByPuuid } from "$lib/server/riot";
import { app_db } from "$lib/server/database/db";
import { Cron } from "croner";

export function initCron() {
  const nameRefreshJob = Cron("30 04 * * *", { timezone: "America/New_York" });
  nameRefreshJob.schedule(nameRefresh);
  process.env.NODE_ENV!! === "production" ? nameRefreshJob.trigger() : "";
}

// Summoner Name refresh
const nameRefresh = async () => {
  const start = new Date();
  console.info(`SUMMONER REFRESH STARTED @${start}}`);
  const playerList = await app_db
    .select({
      id: players.id,
      puuid: players.primaryRiotPuuid,
      riotId: players.summonerName,
    })
    .from(players);
  for (const player of playerList) {
    const { error, message: riotId } = await fetchNameByPuuid(player.puuid);
    if (error || !riotId) {
      if (error) console.error(error);
      else console.error("No riotId recieved.");
    } else {
      if (player.riotId != riotId) {
        try {
          console.info(
            `Updated ${player.riotId} to ${riotId} (id ${player.id})`
          );
          await app_db.transaction(async (tx) => {
            await tx
              .update(players)
              .set({ summonerName: riotId })
              .where(eq(players.id, player.id));
          });
        } catch (e: any) {
          // if (e instanceof Error) console.error(e.message);
          console.warn(`Could not update '${player.riotId}' to '${riotId}'.`);
        }
      }
    }
  }
  const end = new Date();
  console.info(
    `SUMMONER REFRESH FINISHED @${end}. Took ${new Date(end.valueOf() - start.valueOf()).toISOString().substring(11, 8)}`
  );
};
