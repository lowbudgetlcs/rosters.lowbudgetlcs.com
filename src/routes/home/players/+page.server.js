import { fail } from '@sveltejs/kit';
import { insertPlayer } from '$lib/server/players';

export function load() {

}

export const actions = {
  createPlayer: async (event) => {
    const data = Object.fromEntries(await event.request.formData());

    // Validate input
    if (!data.name) {
      return fail(400, {
        error: 'Missing required data.'
      });
    }
    if (data.name.indexOf('#') === -1) {
      return fail(400, {
        error: 'Missing tag, include the #NA1.'
      });
    }
    const { error, message } = await insertPlayer(data);

    if (error) {
      return fail(401, {
        error
      });
    }

    return { message };
  }
};