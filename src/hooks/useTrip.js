import { useState, useEffect } from 'react';
import { getItem, setItem } from '../utils/storage.js';
import { fetchTrip, updateTripAPI } from '../utils/api.js';

export function useTrip(tripId, onTripChange) {
  const [trip, setTrip] = useState(() => getItem(`trip:${tripId}`));

  // Load fresh from API on mount
  useEffect(() => {
    fetchTrip(tripId)
      .then(data => {
        setItem(`trip:${tripId}`, data);
        setTrip(data);
        if (onTripChange) onTripChange(data);
      })
      .catch(() => { /* keep localStorage fallback */ });
  }, [tripId]);

  function save(updatedTrip) {
    // Optimistic local update
    setItem(`trip:${tripId}`, updatedTrip);
    setTrip(updatedTrip);
    if (onTripChange) onTripChange(updatedTrip);
    // Persist to API (fire-and-forget)
    updateTripAPI(updatedTrip).catch(() => { /* local copy already saved */ });
  }

  const updateTrip = (fields) => save({ ...trip, ...fields });

  const addExpense = (expense) =>
    save({ ...trip, expenses: [expense, ...(trip.expenses || [])] });

  const deleteExpense = (expenseId) =>
    save({ ...trip, expenses: (trip.expenses || []).filter(e => e.id !== expenseId) });

  const addChecklistItem = (catId, text) =>
    save({
      ...trip,
      checklist: trip.checklist.map(cat =>
        cat.id === catId
          ? { ...cat, items: [...cat.items, { id: crypto.randomUUID(), text, done: false }] }
          : cat
      ),
    });

  const toggleChecklistItem = (catId, itemId) =>
    save({
      ...trip,
      checklist: trip.checklist.map(cat =>
        cat.id === catId
          ? { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, done: !item.done } : item) }
          : cat
      ),
    });

  const deleteChecklistItem = (catId, itemId) =>
    save({
      ...trip,
      checklist: trip.checklist.map(cat =>
        cat.id === catId
          ? { ...cat, items: cat.items.filter(item => item.id !== itemId) }
          : cat
      ),
    });

  return { trip, updateTrip, addExpense, deleteExpense, addChecklistItem, toggleChecklistItem, deleteChecklistItem };
}
