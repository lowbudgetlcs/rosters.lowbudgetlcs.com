import { fail } from '@sveltejs/kit';
import { insertTeam, fetchTeamListing } from '$lib/server/teams';
import { fetchPlayerListing, removePlayerFromTeam, addPlayerToTeam } from '$lib/server/players';

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
    const { name } = data;
    if (!name) {
      return fail(400, {
        error: "Missing required data."
      });
    }

    const { error, message } = await removePlayerFromTeam(data);
    if (error) {
      return fail(401, {
        error
      });
    }
    return { message };
  },
  addPlayer: async (event) => {
    const data = Object.fromEntries(await event.request.formData());
    const { name, team } = data;
    if (!name || !team) {
      return fail(400, {
        error: "Missing required data."
      });
    }

    const { error, message } = await addPlayerToTeam(data);
    if (error) {
      return fail(401, {
        error
      });
    }
    return { message };
  }
};