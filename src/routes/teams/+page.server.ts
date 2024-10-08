import { fail } from "@sveltejs/kit";
import { insertTeam, fetchTeamListing, swapTeams } from "$lib/server/teams";
import {
  fetchPlayerListing,
  removePlayerFromTeam,
  addPlayerToTeam,
} from "$lib/server/players";
import type { PageServerLoad, Actions } from "./$types";
import type { ErroredResponse, Team } from "$lib/server/types";

export const load: PageServerLoad = async ({}): Promise<
  ErroredResponse<Team[]>
> => {
  return await fetchTeamListing();
};

export const actions = {
  createTeam: async ({ request }) => {
    const data = await request.formData();
    const name = data.get("name") as string;
    const division = data.get("division") as string;
    const group = data.get("group") as string;
    const captain = data.get("captain") as string | null;
    const logo = data.get("logo") as string | null;
    if (!name || !division || !group) {
      return fail(400, {
        error: "Missing required data.",
      });
    }
    const { error, message } = await insertTeam({
      name,
      division,
      group,
      captain,
      logo,
    });
    if (error) {
      return fail(401, {
        error,
      });
    }

    return { message };
  },
  removePlayer: async ({ request }) => {
    const data = await request.formData();
    const riotId = data.get("name") as string;
    if (!riotId) {
      return fail(400, {
        error: "Missing required data.",
      });
    }

    const { error, message } = await removePlayerFromTeam({
      riotId,
      team: undefined,
    });
    if (error) {
      return fail(401, {
        error,
      });
    }
    return { message };
  },
  addPlayer: async ({ request }) => {
    const data = await request.formData();
    const riotId = data.get("name") as string;
    const team = data.get("team") as string;
    if (!riotId || !team) {
      return fail(400, {
        error: "Missing required data.",
      });
    }

    const { error, message } = await addPlayerToTeam({ riotId, team });
    if (error) {
      return fail(401, {
        error,
      });
    }
    return { message };
  },
  switchTeams: async ({ request }) => {
    const data = await request.formData();
    const oldTeam = data.get("oldTeam") as string;
    const newTeam = data.get("newTeam") as string;
    if (!oldTeam || !newTeam) {
      return fail(400, {
        error: "Missing required data.",
      });
    }

    const { error, message } = await swapTeams(oldTeam, newTeam);
    if (error) {
      return fail(401, {
        error,
      });
    }
    return { message };
  },
} satisfies Actions;
