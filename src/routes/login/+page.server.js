import { loginUser } from '$lib/server/users';
import { redirect, fail } from '@sveltejs/kit';

export const load = (event) => {
  const user = event.locals.user;

  if (user) {
    throw redirect(302, '/');
  }
};

export const actions = {
  login: async (event) => {
    const data = Object.fromEntries(await event.request.formData());
    if (!('username' in data) || !("password" in data)) {
      return fail(400, {
        error: 'Missing username or password.'
      });
    }

    const { username, password } = data;

    const { error, token } = await loginUser(username, password);

    if (error) {
      return fail(401, {
        error
      });
    }

    event.cookies.set('AuthorizationToken', `Bearer ${token}`, {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 1 day
    });

    throw redirect(302, '/');
  },
};