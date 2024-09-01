import argon2 from 'argon2';
import { meta_db } from '$lib/server/database/db';
import { users } from '$lib/server/database/metaSchema';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';

export async function loginUser(username: string, password: string) {
  if (!username || !password) return { error: 'Missing username or password.' };

  const fetchedUser = await meta_db.select().from(users).where(eq(users.username, username)).limit(1);

  if (fetchedUser.length < 1) {
    return {
      error: 'User does not exist.'
    };
  }
  const user = fetchedUser[0];

  const authenticated = await argon2.verify(user.password, password);
  if (!authenticated) {
    return {
      error: 'Incorrect password.'
    };

  }

  const jwtUser = {
    id: user.id,
    username: user.username
  };

  const token = jwt.sign(jwtUser, process.env.JWT_SECRET_KEY!!, {
    expiresIn: '1d'
  });

  return { token };
}