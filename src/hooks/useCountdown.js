import { useState, useEffect } from 'react';

function calc(startDate, endDate) {
  const now = Date.now();
  const start = startDate ? new Date(startDate).getTime() : null;
  const end = endDate ? new Date(endDate + 'T23:59:59').getTime() : null;

  if (!start) return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'draft' };
  if (now >= start && (!end || now <= end)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'active' };
  }
  if (end && now > end) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'past' };
  }
  const diff = start - now;
  const totalSecs = Math.max(0, Math.floor(diff / 1000));
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;
  return { days, hours, minutes, seconds, status: days === 0 ? 'today' : 'upcoming' };
}

export function useCountdown(startDate, endDate) {
  const [state, setState] = useState(() => calc(startDate, endDate));

  useEffect(() => {
    setState(calc(startDate, endDate));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const id = setInterval(() => {
      setState(calc(startDate, endDate));
    }, 1000);
    return () => clearInterval(id);
  }, [startDate, endDate]);

  return state;
}
