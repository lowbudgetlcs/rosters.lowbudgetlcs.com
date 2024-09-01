import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (event) => {
  const user = event.locals.user;

  if (!user && event.route.id != '/login') {
    throw redirect(302, '/login');
  }

  return {
    user
  };
};