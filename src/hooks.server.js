import 'dotenv/config';
import { meta_db } from '$lib/server/database/db';
import { users } from '$lib/server/database/metaSchema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export const handle = async ({ event, resolve }) => {
  const authCookie = event.cookies.get('AuthorizationToken');

  if (authCookie) {
    // Remove Bearer prefix
    const token = authCookie.split(' ')[1];

    try {
      const jwtUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (typeof jwtUser === "string") {
        throw new Error("Something went wrong");
      }

      const user = await meta_db.select().from(users).where(eq(users.id, jwtUser.id));

      if (!user) {
        throw new Error("User not found");
      }

      const sessionUser = {
        id: user.id,
        username: user.username,
      };

      event.locals.user = sessionUser;
    } catch (error) {
      console.error(error);
    }
  }

  return await resolve(event);
};