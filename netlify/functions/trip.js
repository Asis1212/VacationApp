import { db } from '../../db/index.js';
import { trips } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { loadTrip, saveTrip, json } from './_shared/tripHelpers.js';
import { authFromRequest, unauthorized } from './_shared/auth.js';

export default async (req, context) => {
  const payload = await authFromRequest(req);
  if (!payload) return unauthorized();

  const { id } = context.params;

  if (req.method === 'GET') {
    const trip = await loadTrip(id);
    if (!trip || trip.userId !== payload.userId) return json({ error: 'Not found' }, 404);
    return json(trip);
  }

  if (req.method === 'PUT') {
    // Verify ownership before update
    const [row] = await db.select({ userId: trips.userId }).from(trips).where(eq(trips.id, id));
    if (!row || row.userId !== payload.userId) return json({ error: 'Not found' }, 404);

    const body = await req.json();
    await saveTrip({ ...body, id, userId: payload.userId });
    const updated = await loadTrip(id);
    return json(updated);
  }

  if (req.method === 'DELETE') {
    const [row] = await db.select({ userId: trips.userId }).from(trips).where(eq(trips.id, id));
    if (!row || row.userId !== payload.userId) return json({ error: 'Not found' }, 404);

    await db.delete(trips).where(and(eq(trips.id, id), eq(trips.userId, payload.userId)));
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
};

export const config = { path: '/api/trips/:id' };
