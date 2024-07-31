import { app_db } from '$lib/server/database/db';
import { count, eq } from 'drizzle-orm';
import { accounts } from '$lib/server/database/appSchema';

export async function insertAccount(account) {
  const { puuid, player_id, is_primary } = account;

  if (!puuid || !player_id || !is_primary) return { error: 'Missing required data.' };

  // Check if account exists
  const accountCheck = await app_db.select({ value: count() }).from(accounts).where(eq(accounts.riotPuuid, puuid));
  const { value: records } = accountCheck[0];
  if (records != 0) {
    return { error: 'Account is already registered to a different player.' };
  }
  // Insert
  try {
    await app_db.insert(accounts).values({
      riotPuuid: puuid,
      playerId: player_id,
      isPrimary: is_primary
    });
  } catch (error) {
    console.error(error);
    return { error: 'Failed to insert account record.' };
  }
}