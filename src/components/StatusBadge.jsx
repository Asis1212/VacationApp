import { getDaysRemaining } from '../utils/tripHelpers.js';
import Icon from './shared/Icon.jsx';

const STATUS_CONFIG = {
  draft:    { label: 'טיוטה',        cls: 'badge--draft',    icon: null },
  upcoming: { label: null,            cls: 'badge--upcoming', icon: null },
  today:    { label: 'יוצאים היום!', cls: 'badge--today',    icon: 'Plane' },
  active:   { label: 'בחופשה עכשיו', cls: 'badge--active',   icon: 'Sun' },
  past:     { label: 'הסתיימה',      cls: 'badge--past',     icon: null },
};

export default function StatusBadge({ status, startDate }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  let label = cfg.label;
  if (status === 'upcoming' && startDate) {
    const days = getDaysRemaining(startDate);
    label = `עוד ${days} ימים`;
  }
  return (
    <span className={`badge ${cfg.cls}`}>
      {cfg.icon && <Icon name={cfg.icon} size={11} style={{ verticalAlign: 'middle' }} />}
      {label}
    </span>
  );
}
