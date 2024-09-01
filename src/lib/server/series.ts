import { app_db } from '$lib/server/database/db';
import { divisions, series, teams } from '$lib/server/database/schema';
import { eq, and } from 'drizzle-orm';
import type { League } from '$lib/server/types'

const group = ['A', 'B', 'C', 'D'];


export async function generateSeries() {
  // Fetch divisions
  const divisionFetch = await app_db.select().from(divisions);
  const leagues: League[] = [];

  divisionFetch.forEach(div => {
    for (let i = 1; i < div.groups + 1; i++) {
      leagues.push({ div: div.id, group: group[i - 1] });
    }
  });

  // Fetch teams by div+group
  leagues.forEach(async league => {
    const group = await app_db.select().from(teams).where(and(
      eq(teams.divisionId, league.div),
      eq(teams.groupId, league.group)
    ));
    // Select team -> remove team from stack -> create series with teams in stack -> repeat
    const stack: number[] = [];
    group.forEach(group => stack.push(group.id));

    while (stack.length > 0) {
      const team = stack.pop()!
      stack.forEach(async opp => {
        const { max, min } = team > opp ? { max: team, min: opp } : { max: opp, min: team };
        try {
          await app_db.transaction(async (tx) => {
            await tx.insert(series).values({
              team1Id: max,
              team2Id: min,
              playoffs: false,
              winCondition: 3
            });
          });
        } catch (err) {
          console.error(err);
        }
      });
    }
  });
}