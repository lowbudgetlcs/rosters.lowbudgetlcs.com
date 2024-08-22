import { fail } from '@sveltejs/kit';
import { insertTeam, fetchTeamListing } from '$lib/server/teams';
import { fetchPlayerListing, removePlayerFromTeam } from '$lib/server/players';

export async function load() {
  const data = {
    errors: []
  };

  const { errorP, players } = await fetchPlayerListing();
  if (errorP) {
    data.errors.push(errorP);
  } else {
    data.playerListing = players;
  }

  const { errorT, teams } = await fetchTeamListing();
  if (errorT) {
    data.errors.push(errorT);
  } else {
    data.teamListing = teams;
  }
  return data;
}

export const actions = {
  createTeam: async (event) => {
    const data = Object.fromEntries(await event.request.formData());
    if (!data.name || !data.division || !data.group) {
      return fail(400, {
        error: 'Missing required data.'
      });
    }

    const { error, message } = await insertTeam(data);
    if (error) {
      return fail(401, {
        error
      });
    }

    return { message };
  },
  removePlayer: async (event) => {
    const data = Object.fromEntries(await event.request.formData());
    if (!data.name) {
      return fail(400, {
        error: "Missing required data."
      });
    }

    const { name } = data;
    const { error, message } = await removePlayerFromTeam({ name: name });
    if (error) {
      return fail(401, {
        error
      });
    }
    return { message };
  }
};