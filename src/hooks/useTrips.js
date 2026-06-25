import { useState, useEffect } from 'react';
import { setItem, removeItem, getItem } from '../utils/storage.js';
import { sortTrips } from '../utils/tripHelpers.js';
import { DEFAULT_CHECKLIST } from '../data/defaultChecklist.js';
import { fetchTrips, createTripAPI, deleteTripAPI } from '../utils/api.js';

function seedChecklist() {
  return DEFAULT_CHECKLIST.map(cat => ({
    id: crypto.randomUUID(),
    title: cat.title,
    emoji: cat.emoji,
    items: cat.items.map(item => ({
      id: crypto.randomUUID(),
      text: item.text,
      done: false,
    })),
  }));
}

export function useTrips() {
  const [trips, setTrips] = useState(() => sortTrips(
    (getItem('trips:order', []))
      .map(id => getItem(`trip:${id}`))
      .filter(Boolean)
  ));
  const [loading, setLoading] = useState(true);

  // Load from API on mount — source of truth
  useEffect(() => {
    fetchTrips()
      .then(data => {
        data.forEach(t => setItem(`trip:${t.id}`, t));
        setItem('trips:order', data.map(t => t.id));
        setTrips(sortTrips(data));
      })
      .catch(() => { /* keep localStorage fallback already in state */ })
      .finally(() => setLoading(false));
  }, []);

  const createTrip = async () => {
    const id = crypto.randomUUID();
    const trip = {
      id,
      name: '',
      destination: '',
      startDate: '',
      endDate: '',
      budget: 0,
      currency: 'ILS',
      expenses: [],
      checklist: seedChecklist(),
      createdAt: Date.now(),
    };
    // Optimistic update
    setItem(`trip:${id}`, trip);
    const order = getItem('trips:order', []);
    setItem('trips:order', [...order, id]);
    setTrips(prev => sortTrips([...prev, trip]));
    // Persist to API
    try { await createTripAPI(trip); } catch { /* keep local copy */ }
    return id;
  };

  const deleteTrip = async (id) => {
    // Optimistic update
    removeItem(`trip:${id}`);
    const order = getItem('trips:order', []).filter(tid => tid !== id);
    setItem('trips:order', order);
    setTrips(prev => prev.filter(t => t.id !== id));
    try { await deleteTripAPI(id); } catch { /* already removed locally */ }
  };

  const refreshTrip = (updatedTrip) => {
    setItem(`trip:${updatedTrip.id}`, updatedTrip);
    setTrips(prev => sortTrips(prev.map(t => t.id === updatedTrip.id ? updatedTrip : t)));
  };

  return { trips, loading, createTrip, deleteTrip, refreshTrip };
}
