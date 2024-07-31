import { fail } from '@sveltejs/kit';
import { insertTeam } from '$lib/server/teams';

export function load() {

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