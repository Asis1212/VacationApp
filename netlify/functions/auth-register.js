import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { hashPassword, signToken } from './_shared/auth.js';
import { json } from './_shared/tripHelpers.js';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const { firstName, lastName, email, password } = await req.json();

  if (!firstName || !lastName || !email || !password) {
    return json({ error: 'כל השדות חובה' }, 400);
  }
  if (password.length < 6) {
    return json({ error: 'הסיסמה חייבת להכיל לפחות 6 תווים' }, 400);
  }

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email.toLowerCase()));
  if (existing.length > 0) {
    return json({ error: 'כתובת המייל כבר רשומה במערכת' }, 409);
  }

  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);

  await db.insert(users).values({
    id,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    provider: 'email',
  });

  const token = await signToken({ userId: id, email: email.toLowerCase() });
  return json({ token, user: { id, firstName, lastName, email: email.toLowerCase() } }, 201);
};

export const config = { path: '/api/auth/register' };
