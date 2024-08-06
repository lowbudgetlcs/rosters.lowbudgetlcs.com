import { app_db } from '$lib/server/database/db';
import { divisions, series, teams} from '$lib/server/database/appSchema';
import { eq, and } from 'drizzle-orm';

const group = ['A', 'B', 'C', 'D'];

export async function generateSeries(){
  // Fetch divisions
  const divisionFetch = await app_db.select().from(divisions);
  const divGroups = []

  divisionFetch.forEach(div => {
    for(let i = 1; i < div.groups + 1; i++){
      divGroups.push({div: div.id, group: group[i - 1]});
    }
  })

  // Fetch teams by div+group
  divGroups.forEach(async divGroup => {
    console.log(divGroup)
    const group = await app_db.select().from(teams).where(and(
      eq(teams.divisionId, divGroup.div),
      eq(teams.groupId, divGroup.group)
    ));
    // Select team -> remove team from stack -> create series with teams in stack -> repeat
    const stack = [];
    group.forEach(group => stack.push(group.id));
    console.log(stack)
    while(stack.length > 0){
      const team = stack.pop();
      stack.forEach(async opp => {
        const {max, min} = team > opp ? {max: team, min: opp} : {max: opp, min: team};
        try {
        await app_db.insert(series).values({
          team1Id: max,
          team2Id: min,
          playoffs: false,
          winCondition: 3
        });
      } catch(err){
        console.error(err);
      }
      })
    }
  })
}