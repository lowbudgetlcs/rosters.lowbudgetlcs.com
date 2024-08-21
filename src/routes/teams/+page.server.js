import { fail } from '@sveltejs/kit';
import { insertTeam, fetchTeamListing } from '$lib/server/teams';
import { fetchPlayerListing } from '$lib/server/players';

export function load() {
  const data = {
    errors: []
  };

  const { errorP, players } = fetchPlayerListing();
  if (errorP) {
    data.errors.push(errorP);
  } else {
    data.playerListing = players;
  }

  const { errorT, teams } = fetchTeamListing();
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

    // Validate input
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
  }
};