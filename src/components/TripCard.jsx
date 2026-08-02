import { getTripStatus, getTripLength, getTotalSpent } from '../utils/tripHelpers.js';
import { formatAmount, formatDateRange } from '../utils/formatters.js';
import StatusBadge from './StatusBadge.jsx';
import ProgressBar from './shared/ProgressBar.jsx';
import Icon from './shared/Icon.jsx';

export default function TripCard({ trip, onClick }) {
  const status = getTripStatus(trip);
  const length = getTripLength(trip.startDate, trip.endDate);
  const spent = getTotalSpent(trip);
  const budget = Number(trip.budget) || 0;
  const spentPct = budget > 0 ? (spent / budget) * 100 : 0;
  const isOver = budget > 0 && spent > budget;

  return (
    <div className="trip-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="trip-card__header">
        <div className="trip-card__name">
          {trip.name || <span style={{ color: 'var(--color-muted)', fontWeight: 500 }}>חופשה ללא שם</span>}
        </div>
        <StatusBadge status={status} startDate={trip.startDate} />
      </div>

      {trip.destination && (
        <div className="trip-card__destination">
          <Icon name="MapPin" size={13} style={{ verticalAlign: 'middle', marginLeft: 3, opacity: 0.6 }} />
          {trip.destination}
        </div>
      )}

      {trip.startDate ? (
        <div className="trip-card__dates">
          {formatDateRange(trip.startDate, trip.endDate)}
          {length && <span style={{ marginRight: 6, color: 'var(--color-muted)' }}>· {length} ימים</span>}
        </div>
      ) : (
        <div className="trip-card__dates" style={{ color: 'var(--color-muted)' }}>תאריכים לא נקבעו</div>
      )}

      {budget > 0 && (
        <div className="trip-card__budget">
          <div className="trip-card__budget-labels">
            <span>{formatAmount(spent, trip.currency)}</span>
            <span style={{ color: isOver ? 'var(--color-rose)' : undefined }}>
              {isOver ? 'חריגה מהתקציב!' : `מתוך ${formatAmount(budget, trip.currency)}`}
            </span>
          </div>
          <ProgressBar pct={spentPct} variant={isOver ? 'rose' : 'primary'} small />
        </div>
      )}
    </div>
  );
}
