// netlify/functions/_shared/tripHelpers.js
import { db } from '../../../db/index.js';
import { trips, expenses, checklistCategories, checklistItems } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

// Assembles the full nested Trip object the frontend expects
export async function loadTrip(id) {
  const [trip] = await db.select().from(trips).where(eq(trips.id, id));
  if (!trip) return null;

  const exps = await db.select().from(expenses).where(eq(expenses.tripId, id));
  const cats = await db.select().from(checklistCategories).where(eq(checklistCategories.tripId, id))
    .orderBy(checklistCategories.sortOrder);

  const checklist = await Promise.all(cats.map(async (cat) => {
    const items = await db.select().from(checklistItems).where(eq(checklistItems.categoryId, cat.id))
      .orderBy(checklistItems.sortOrder);
    return {
      id: cat.id,
      title: cat.title,
      emoji: cat.emoji,
      items: items.map(i => ({ id: i.id, text: i.text, done: i.done })),
    };
  }));

  return {
    id: trip.id,
    name: trip.name,
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    budget: Number(trip.budget),
    currency: trip.currency,
    createdAt: trip.createdAt,
    expenses: exps.map(e => ({
      id: e.id,
      amount: Number(e.amount),
      cat: e.cat,
      note: e.note,
      date: e.date,
    })),
    checklist,
  };
}

// Writes a full Trip into the DB (insert or replace)
export async function saveTrip(trip) {
  await db.insert(trips).values({
    id: trip.id,
    name: trip.name ?? '',
    destination: trip.destination ?? '',
    startDate: trip.startDate ?? '',
    endDate: trip.endDate ?? '',
    budget: String(trip.budget ?? 0),
    currency: trip.currency ?? 'ILS',
    createdAt: trip.createdAt ?? Date.now(),
  }).onConflictDoUpdate({
    target: trips.id,
    set: {
      name: trip.name ?? '',
      destination: trip.destination ?? '',
      startDate: trip.startDate ?? '',
      endDate: trip.endDate ?? '',
      budget: String(trip.budget ?? 0),
      currency: trip.currency ?? 'ILS',
    },
  });

  // Replace nested data
  await db.delete(expenses).where(eq(expenses.tripId, trip.id));
  if (trip.expenses?.length) {
    await db.insert(expenses).values(
      trip.expenses.map(e => ({
        id: e.id,
        tripId: trip.id,
        amount: String(e.amount),
        cat: e.cat,
        note: e.note ?? '',
        date: e.date,
      }))
    );
  }

  await db.delete(checklistCategories).where(eq(checklistCategories.tripId, trip.id));
  if (trip.checklist?.length) {
    for (let ci = 0; ci < trip.checklist.length; ci++) {
      const cat = trip.checklist[ci];
      await db.insert(checklistCategories).values({
        id: cat.id,
        tripId: trip.id,
        title: cat.title,
        emoji: cat.emoji,
        sortOrder: ci,
      });
      if (cat.items?.length) {
        await db.insert(checklistItems).values(
          cat.items.map((item, ii) => ({
            id: item.id,
            categoryId: cat.id,
            text: item.text,
            done: item.done ?? false,
            sortOrder: ii,
          }))
        );
      }
    }
  }
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
