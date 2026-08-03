import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { authFromRequest, unauthorized } from './_shared/auth.js';
import { json } from './_shared/tripHelpers.js';

export default async (req) => {
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405);

  const payload = await authFromRequest(req);
  if (!payload) return unauthorized();

  const [user] = await db.select({
    id: users.id,
    firstName: users.firstName,
    lastName: users.lastName,
    email: users.email,
  }).from(users).where(eq(users.id, payload.userId));

  if (!user) return unauthorized('User not found');
  return json({ user });
};

export const config = { path: '/api/auth/me' };
