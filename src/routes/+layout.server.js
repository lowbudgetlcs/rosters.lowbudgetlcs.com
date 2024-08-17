import { redirect } from '@sveltejs/kit';

export const load = (event) => {
  const user = event.locals.user;

  if (!user && event.route.id != '/login') {
    throw redirect(302, '/login');
  }

  return {
    user
  };
};