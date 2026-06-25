import { useCountdown } from '../../hooks/useCountdown.js';
import { getTripLength, getTotalSpent } from '../../utils/tripHelpers.js';
import { formatAmount, formatDateRange } from '../../utils/formatters.js';
import FlightPathHero from '../shared/FlightPathHero.jsx';
import ProgressBar from '../shared/ProgressBar.jsx';

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function HomeTab({ trip }) {
  const { days, hours, minutes, seconds, status } = useCountdown(trip.startDate, trip.endDate);
  const length = getTripLength(trip.startDate, trip.endDate);
  const spent = getTotalSpent(trip);
  const budget = Number(trip.budget) || 0;
  const spentPct = budget > 0 ? (spent / budget) * 100 : 0;
  const isOverBudget = budget > 0 && spent > budget;

  const checklist = trip.checklist || [];
  const totalItems = checklist.reduce((s, c) => s + c.items.length, 0);
  const doneItems  = checklist.reduce((s, c) => s + c.items.filter(i => i.done).length, 0);
  const checklistPct = totalItems > 0 ? (doneItems / totalItems) * 100 : 0;

  const noDates = !trip.startDate;

  return (
    <div>
      {/* Hero */}
      <div className="flight-hero">
        <div className="flight-hero__blob" />
        <div className="flight-hero__blob" />
        <div className="flight-hero__blob" />

        <div className="flight-hero__inner">
          {noDates && (
            <>
              <div className="flight-hero__label">תכנן את החופשה שלך</div>
              <div className="flight-hero__message">✈️ לאן אנחנו טסים?</div>
              <div className="flight-hero__message-sub">הוסף תאריכים בלשונית ההגדרות</div>
            </>
          )}

          {status === 'upcoming' && (
            <>
              <div className="flight-hero__label">עוד</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
                <span className="flight-hero__num">{days}</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1rem', opacity: 0.8, marginRight: 6, alignSelf: 'center' }}>ימים</span>
              </div>
              <div className="flight-hero__hms">{pad(hours)}:{pad(minutes)}:{pad(seconds)}</div>
            </>
          )}

          {status === 'today' && (
            <>
              <div className="flight-hero__label">היום</div>
              <div className="flight-hero__message">יוצאים היום! ✈️</div>
              <div className="flight-hero__hms">{pad(hours)}:{pad(minutes)}:{pad(seconds)}</div>
            </>
          )}

          {status === 'active' && (
            <>
              <div className="flight-hero__label">בחופשה עכשיו</div>
              <div className="flight-hero__message">תהנו מכל רגע 🌴</div>
            </>
          )}

          {status === 'past' && (
            <>
              <div className="flight-hero__label">החופשה הסתיימה</div>
              <div className="flight-hero__message">תודה על הזיכרונות ✨</div>
            </>
          )}

          {trip.startDate && (
            <>
              <div className="flight-hero__daterange">{formatDateRange(trip.startDate, trip.endDate)}</div>
              {length && <div className="flight-hero__length">{length} ימים</div>}
            </>
          )}
        </div>

        <FlightPathHero
          daysRemaining={days}
          destination={trip.destination}
          status={status}
        />
      </div>

      {/* Summary cards */}
      <div className="home-tab__cards">
        {/* Budget summary */}
        {budget > 0 ? (
          <div className={`summary-card${isOverBudget ? ' summary-card--warning' : ''}`}>
            <div className="summary-card__title">תקציב</div>
            <div className="summary-card__row">
              <div className="summary-card__value">{formatAmount(spent, trip.currency)}</div>
              <div className="summary-card__sub">
                {isOverBudget
                  ? `חרגת ב-${formatAmount(spent - budget, trip.currency)}`
                  : `נותר ${formatAmount(budget - spent, trip.currency)}`}
              </div>
            </div>
            <ProgressBar pct={spentPct} variant={isOverBudget ? 'rose' : 'primary'} />
          </div>
        ) : (
          <div className="summary-card">
            <div className="summary-card__title">תקציב</div>
            <div className="summary-card__sub" style={{ paddingTop: 4 }}>
              לא הוגדר תקציב — הוסף בהגדרות
            </div>
          </div>
        )}

        {/* Checklist summary */}
        <div className="summary-card">
          <div className="summary-card__title">צ׳ק-ליסט</div>
          <div className="summary-card__row">
            <div className="summary-card__value">{doneItems} / {totalItems}</div>
            <div className="summary-card__sub">{Math.round(checklistPct)}% הושלם</div>
          </div>
          <ProgressBar pct={checklistPct} variant="mint" />
        </div>
      </div>
    </div>
  );
}
