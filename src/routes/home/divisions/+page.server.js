import { fail } from '@sveltejs/kit';
import { insertDivision } from '$lib/server/divisions';

export function load() {

}

export const actions = {
  createDivision: async (event) => {
    const data = Object.fromEntries(await event.request.formData());
    // Validate input
    if (!('name' in data) || !('groups' in data)) {
      return fail(400, {
        error: 'Missing required data.'
      });
    }
    const { error, message } = await insertDivision(data.name, data.groups, data.description || null);

    if (error) {
      return fail(401, {
        error
      });
    }

    return { message };
  }
};