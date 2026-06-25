import { useState } from 'react';
import { getItem, setItem } from '../utils/storage.js';

export function useTrip(tripId, onTripChange) {
  const [trip, setTrip] = useState(() => getItem(`trip:${tripId}`));

  function save(updatedTrip) {
    setItem(`trip:${tripId}`, updatedTrip);
    setTrip(updatedTrip);
    if (onTripChange) onTripChange(updatedTrip);
  }

  const updateTrip = (fields) => {
    save({ ...trip, ...fields });
  };

  const addExpense = (expense) => {
    save({ ...trip, expenses: [expense, ...(trip.expenses || [])] });
  };

  const deleteExpense = (expenseId) => {
    save({ ...trip, expenses: (trip.expenses || []).filter(e => e.id !== expenseId) });
  };

  const addChecklistItem = (catId, text) => {
    save({
      ...trip,
      checklist: trip.checklist.map(cat =>
        cat.id === catId
          ? { ...cat, items: [...cat.items, { id: crypto.randomUUID(), text, done: false }] }
          : cat
      ),
    });
  };

  const toggleChecklistItem = (catId, itemId) => {
    save({
      ...trip,
      checklist: trip.checklist.map(cat =>
        cat.id === catId
          ? { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, done: !item.done } : item) }
          : cat
      ),
    });
  };

  const deleteChecklistItem = (catId, itemId) => {
    save({
      ...trip,
      checklist: trip.checklist.map(cat =>
        cat.id === catId
          ? { ...cat, items: cat.items.filter(item => item.id !== itemId) }
          : cat
      ),
    });
  };

  return { trip, updateTrip, addExpense, deleteExpense, addChecklistItem, toggleChecklistItem, deleteChecklistItem };
}
