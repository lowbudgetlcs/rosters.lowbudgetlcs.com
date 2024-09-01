import { fail } from '@sveltejs/kit';
import { insertDivision } from '$lib/server/divisions';
import type { Actions } from "./$types"

export const actions = {
  createDivision: async ({ request }) => {
    const data = await request.formData();
    const name = data.get("name") as string
    const description = data.get("description") as string | undefined
    const groups = data.get("groups") as string
    const tid = data.get("tid") as string

    // Validate input
    if (!name || !groups || !tid) {
      return fail(400, {
        error: 'Missing required data.'
      });
    }
    const { error, message } = await insertDivision({ name, description, groups: parseInt(groups), tid: parseInt(tid) });

    if (error) {
      return fail(401, {
        error
      });
    }

    return { message };
  }
} satisfies Actions;