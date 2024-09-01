import { fail } from "@sveltejs/kit";
import { insertTeam, fetchTeamListing } from "$lib/server/teams";
import {
  fetchPlayerListing,
  removePlayerFromTeam,
  addPlayerToTeam,
} from "$lib/server/players";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({}) => {
  const { error, teamListing } = await fetchTeamListing();
  if (error) {
    return { error: error };
  } else {
    return { teams: teamListing };
  }
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
    const name = data.get("name") as string;
    if (!name) {
      return fail(400, {
        error: "Missing required data.",
      });
    }

    const { error, message } = await removePlayerFromTeam({
      name,
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
    const name = data.get("name") as string;
    const team = data.get("team") as string;
    if (!name || !team) {
      return fail(400, {
        error: "Missing required data.",
      });
    }

    const { error, message } = await addPlayerToTeam({ name, team });
    if (error) {
      return fail(401, {
        error,
      });
    }
    return { message };
  },
} satisfies Actions;
