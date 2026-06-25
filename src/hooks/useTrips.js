import { useState, useEffect } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage.js';
import { sortTrips } from '../utils/tripHelpers.js';
import { DEFAULT_CHECKLIST } from '../data/defaultChecklist.js';

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

function loadAllTrips() {
  const order = getItem('trips:order', []);
  return order.map(id => getItem(`trip:${id}`)).filter(Boolean);
}

export function useTrips() {
  const [trips, setTrips] = useState(() => sortTrips(loadAllTrips()));

  const createTrip = () => {
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
    const order = getItem('trips:order', []);
    setItem(`trip:${id}`, trip);
    setItem('trips:order', [...order, id]);
    setTrips(prev => sortTrips([...prev, trip]));
    return id;
  };

  const deleteTrip = (id) => {
    removeItem(`trip:${id}`);
    const order = getItem('trips:order', []).filter(tid => tid !== id);
    setItem('trips:order', order);
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  const refreshTrip = (updatedTrip) => {
    setTrips(prev => sortTrips(prev.map(t => t.id === updatedTrip.id ? updatedTrip : t)));
  };

  return { trips, createTrip, deleteTrip, refreshTrip };
}
