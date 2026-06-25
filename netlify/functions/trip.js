import { db } from '../../db/index.js';
import { trips } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { loadTrip, saveTrip, json } from './_shared/tripHelpers.js';

export default async (req, context) => {
  const { id } = context.params;

  if (req.method === 'GET') {
    const trip = await loadTrip(id);
    if (!trip) return json({ error: 'Not found' }, 404);
    return json(trip);
  }

  if (req.method === 'PUT') {
    const body = await req.json();
    await saveTrip({ ...body, id });
    const updated = await loadTrip(id);
    return json(updated);
  }

  if (req.method === 'DELETE') {
    await db.delete(trips).where(eq(trips.id, id));
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
};

export const config = { path: '/api/trips/:id' };
