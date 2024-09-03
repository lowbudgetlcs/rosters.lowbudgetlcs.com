import { fail } from "@sveltejs/kit";
import {
  insertPlayer,
  fetchPlayerListing,
  batchInsertPlayers,
} from "$lib/server/players";
import type { PageServerLoad, Actions } from "./$types";
import type { ErroredResponse, Player } from "$lib/server/types";

export const load: PageServerLoad = async ({}): Promise<
  ErroredResponse<Player[]>
> => {
  return await fetchPlayerListing();
};

export const actions = {
  batchCreatePlayers: async ({ request }) => {
    const data = await request.formData();
    const batch = data.get("batch") as string;

    if (!batch) {
      return fail(400, {
        error: "Missing batch data.",
      });
    }

    const players = batch.split("\n").map((player) => {
      const tmp = player.split(",");
      return { riotId: tmp[0], team: tmp[1] };
    });

    const { error, message } = await batchInsertPlayers(players);

    if (error) {
      return fail(401, {
        error,
      });
    }
    return { message };
  },
  createPlayer: async ({ request }) => {
    const data = await request.formData();
    const riotId = data.get("name") as string;
    const team = data.get("team") as string | undefined;

    // Validate input
    if (!riotId) {
      return fail(400, {
        error: "Missing required data.",
      });
    }
    if (riotId.indexOf("#") === -1) {
      return fail(400, {
        error: "Missing tag, include the #NA1.",
      });
    }
    const { error, message } = await insertPlayer({ riotId, team });

    if (error) {
      return fail(401, {
        error,
      });
    }

    return { message };
  },
} satisfies Actions;
