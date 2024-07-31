import { error, redirect } from '@sveltejs/kit';

export const load = (event) => {
  const user = event.locals.user;

  if (!user) {
    throw error(401, {
      message: 'You must be logged in to view this page'
    });
  }

  return {
    user
  };
};

export const actions = {
  logout: async (event) => {
    event.cookies.delete('AuthorizationToken', {
      path: '/'
    });
    console.log("logout");

    throw redirect(302, '/login');
  }
};