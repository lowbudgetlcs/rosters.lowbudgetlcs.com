import { app_db } from "$lib/server/database/db";
import { count, eq } from "drizzle-orm";
import { accounts } from "$lib/server/database/schema";
import type { Account, ErroredResponse } from "./types";

/**
 *
 * @param {Account} account Account to insert.
 * @returns {ErroredResponse<string>} Error or message.
 */
export async function insertAccount(
  account: Account,
): Promise<ErroredResponse<string>> {
  console.log(account);
  const { puuid, player_id, is_primary } = account;
  // Check if account exists
  const [accountRes] = await app_db
    .select({ records: count() })
    .from(accounts)
    .where(eq(accounts.riotPuuid, puuid));
  if (accountRes) {
    return { error: "Account is already registered to a different player." };
  }
  // Insert
  try {
    await app_db.transaction(async (tx) => {
      await tx.insert(accounts).values({
        riotPuuid: puuid,
        playerId: player_id,
        isPrimary: is_primary,
      });
    });
    return { message: `Successfully inserted account '${puuid}'.` };
  } catch (e) {
    if (e instanceof Error) console.error(e.message);
    return { error: `Failed to insert account with puuid '${puuid}'.` };
  }
}
