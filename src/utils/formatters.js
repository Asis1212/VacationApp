export function formatAmount(amount, currencyCode = 'ILS') {
  try {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount}`;
  }
}

export function formatNumber(n) {
  return new Intl.NumberFormat('he-IL').format(n);
}

export function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateRange(start, end) {
  if (!start && !end) return '';
  if (!end) return formatDate(start);
  const s = new Date(start).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
  const e = new Date(end).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${e} – ${s}`;
}
