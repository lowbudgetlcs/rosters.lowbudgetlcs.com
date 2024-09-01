import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types'

export const actions = {
  logout: async (event) => {
    event.cookies.delete('AuthorizationToken', {
      path: '/'
    });

    throw redirect(302, '/login');
  }
} satisfies Actions;