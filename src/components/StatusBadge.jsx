import { getDaysRemaining } from '../utils/tripHelpers.js';

const STATUS_CONFIG = {
  draft:    { label: 'טיוטה',           cls: 'badge--draft' },
  upcoming: { label: null,              cls: 'badge--upcoming' },
  today:    { label: 'יוצאים היום! ✈️', cls: 'badge--today' },
  active:   { label: 'בחופשה עכשיו ☀️', cls: 'badge--active' },
  past:     { label: 'הסתיימה',         cls: 'badge--past' },
};

export default function StatusBadge({ status, startDate }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  let label = cfg.label;
  if (status === 'upcoming' && startDate) {
    const days = getDaysRemaining(startDate);
    label = `עוד ${days} ימים`;
  }
  return <span className={`badge ${cfg.cls}`}>{label}</span>;
}
