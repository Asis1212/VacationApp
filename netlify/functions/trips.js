import { db } from '../../db/index.js';
import { trips } from '../../db/schema.js';
import { desc, eq } from 'drizzle-orm';
import { loadTrip, saveTrip, json } from './_shared/tripHelpers.js';
import { authFromRequest, unauthorized } from './_shared/auth.js';

export default async (req) => {
  const payload = await authFromRequest(req);
  if (!payload) return unauthorized();

  if (req.method === 'GET') {
    const rows = await db.select().from(trips)
      .where(eq(trips.userId, payload.userId))
      .orderBy(desc(trips.createdAt));
    const all = await Promise.all(rows.map(r => loadTrip(r.id)));
    return json(all);
  }

  if (req.method === 'POST') {
    const trip = await req.json();
    await saveTrip({ ...trip, userId: payload.userId });
    const created = await loadTrip(trip.id);
    return json(created, 201);
  }

  return json({ error: 'Method not allowed' }, 405);
};

export const config = { path: '/api/trips' };
