import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { verifyPassword, signToken } from './_shared/auth.js';
import { json } from './_shared/tripHelpers.js';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const { email, password } = await req.json();
  if (!email || !password) return json({ error: 'אימייל וסיסמה חובה' }, 400);

  const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));
  if (!user || !user.passwordHash) {
    return json({ error: 'אימייל או סיסמה שגויים' }, 401);
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return json({ error: 'אימייל או סיסמה שגויים' }, 401);

  const token = await signToken({ userId: user.id, email: user.email });
  return json({
    token,
    user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
  });
};

export const config = { path: '/api/auth/login' };
