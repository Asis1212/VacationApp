function toMidnight(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function todayMidnight() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getTripStatus(trip) {
  if (!trip.startDate) return 'draft';
  const today = todayMidnight();
  const start = toMidnight(trip.startDate);
  const end = trip.endDate ? toMidnight(trip.endDate) : null;

  if (today < start) {
    const diff = Math.round((start - today) / 86400000);
    return diff === 0 ? 'today' : 'upcoming';
  }
  if (!end || today <= end) return 'active';
  return 'past';
}

export function getDaysRemaining(startDate) {
  if (!startDate) return null;
  const today = todayMidnight();
  const start = toMidnight(startDate);
  return Math.round((start - today) / 86400000);
}

export function getTripLength(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const start = toMidnight(startDate);
  const end = toMidnight(endDate);
  return Math.round((end - start) / 86400000) + 1;
}

export function getTotalSpent(trip) {
  return (trip.expenses || []).reduce((sum, e) => sum + Number(e.amount), 0);
}

const STATUS_ORDER = { active: 0, today: 0, upcoming: 1, draft: 2, past: 3 };

export function sortTrips(trips) {
  return [...trips].sort((a, b) => {
    const sa = getTripStatus(a);
    const sb = getTripStatus(b);
    const oa = STATUS_ORDER[sa] ?? 99;
    const ob = STATUS_ORDER[sb] ?? 99;
    if (oa !== ob) return oa - ob;

    // same group: upcoming → soonest first; past → most recent end first
    if (sa === 'upcoming' || sb === 'upcoming') {
      return new Date(a.startDate) - new Date(b.startDate);
    }
    if (sa === 'past') {
      const ae = a.endDate ? new Date(a.endDate) : new Date(a.createdAt);
      const be = b.endDate ? new Date(b.endDate) : new Date(b.createdAt);
      return be - ae;
    }
    return b.createdAt - a.createdAt;
  });
}
