import { fail } from '@sveltejs/kit';
import { insertDivision } from '$lib/server/divisions';

export function load() {

}

export const actions = {
  createDivision: async (event) => {
    const data = Object.fromEntries(await event.request.formData());

    // Validate input
    if (!data.name || !data.groups) {
      return fail(400, {
        error: 'Missing required data.'
      });
    }
    const { error, message } = await insertDivision(data);

    if (error) {
      return fail(401, {
        error
      });
    }

    return { message };
  }
};