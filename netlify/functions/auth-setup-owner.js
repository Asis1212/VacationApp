// One-time endpoint to set a real password + name on the pre-migration owner account.
// Protected by a setup secret so only you can call it.
// Call once after running the migration, then you can remove this file.
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { hashPassword, signToken } from './_shared/auth.js';
import { json } from './_shared/tripHelpers.js';

const OWNER_ID = '00000000-0000-0000-0000-000000000001';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const { setupSecret, firstName, lastName, email, password } = await req.json();

  if (!setupSecret || setupSecret !== process.env.SETUP_SECRET) {
    return json({ error: 'Forbidden' }, 403);
  }
  if (!password || password.length < 6) {
    return json({ error: 'Password too short' }, 400);
  }

  const passwordHash = await hashPassword(password);

  await db.update(users)
    .set({
      firstName: firstName || 'Elad',
      lastName:  lastName  || 'Asis',
      email:     (email || 'elad@vacationapp.local').toLowerCase(),
      passwordHash,
    })
    .where(eq(users.id, OWNER_ID));

  const token = await signToken({ userId: OWNER_ID, email: email || 'elad@vacationapp.local' });
  return json({ ok: true, token });
};

export const config = { path: '/api/auth/setup-owner' };
