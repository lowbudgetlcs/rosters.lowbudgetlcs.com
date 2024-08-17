import { redirect } from '@sveltejs/kit';

export const actions = {
  logout: async (event) => {
    event.cookies.delete('AuthorizationToken', {
      path: '/'
    });

    throw redirect(302, '/login');
  }
};