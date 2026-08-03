import { getTotalSpent, getTripLength, getTripStatus } from '../utils/tripHelpers.js';
import { formatAmount } from '../utils/formatters.js';
import { getCategoryById } from '../data/expenseCategories.js';

function dailyRate(trip) {
  const spent = getTotalSpent(trip);
  const len = getTripLength(trip.startDate, trip.endDate);
  return len > 0 ? spent / len : null;
}

export default function SpendingInsights({ trip, allTrips = [] }) {
  const expenses = trip.expenses || [];
  if (expenses.length === 0) return null;

  const spent = getTotalSpent(trip);
  const budget = Number(trip.budget) || 0;
  const tripLen = getTripLength(trip.startDate, trip.endDate);
  const avgPerDay = tripLen > 0 ? spent / tripLen : null;

  // Top category
  const byCategory = {};
  for (const e of expenses) {
    byCategory[e.cat] = (byCategory[e.cat] || 0) + Number(e.amount);
  }
  const topCatId = Object.entries(byCategory).sort(([, a], [, b]) => b - a)[0]?.[0];
  const topCat = topCatId ? getCategoryById(topCatId) : null;

  // Busiest day
  const byDay = {};
  for (const e of expenses) {
    byDay[e.date] = (byDay[e.date] || 0) + Number(e.amount);
  }
  const busiestEntry = Object.entries(byDay).sort(([, a], [, b]) => b - a)[0];
  const busiestDay = busiestEntry
    ? new Date(busiestEntry[0] + 'T00:00:00').toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })
    : null;

  // Last completed trip comparison (different from current trip, has expenses, is past)
  const lastTrip = allTrips
    .filter(t =>
      t.id !== trip.id &&
      getTripStatus(t) === 'past' &&
      (t.expenses || []).length > 0
    )
    .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))[0];

  let comparison = null;
  if (lastTrip) {
    const currentRate = dailyRate(trip);
    const lastRate = dailyRate(lastTrip);
    if (currentRate != null && lastRate != null && lastRate > 0) {
      const diffPct = Math.round(((currentRate - lastRate) / lastRate) * 100);
      const absP = Math.abs(diffPct);
      if (absP >= 5) {
        comparison = {
          better: diffPct < 0,
          text: diffPct < 0
            ? `הוצאת ${absP}% פחות ליום מהחופשה הקודמת`
            : `הוצאת ${absP}% יותר ליום מהחופשה הקודמת`,
        };
      }
    }
  }

  return (
    <div className="spending-insights">
      <div className="spending-insights__chips">
        {avgPerDay != null && (
          <div className="insight-chip">
            <span className="insight-chip__label">ממוצע ליום</span>
            <span className="insight-chip__value">{formatAmount(avgPerDay, trip.currency)}</span>
          </div>
        )}

        {topCat && (
          <div className="insight-chip">
            <span className="insight-chip__label">קטגוריה מובילה</span>
            <span className="insight-chip__value">{topCat.emoji} {topCat.label}</span>
          </div>
        )}

        {busiestDay && (
          <div className="insight-chip">
            <span className="insight-chip__label">יום עמוס</span>
            <span className="insight-chip__value">{busiestDay}</span>
          </div>
        )}

        {budget > 0 && spent > 0 && (
          <div className="insight-chip">
            <span className="insight-chip__label">מנוצל מהתקציב</span>
            <span className="insight-chip__value">{Math.round((spent / budget) * 100)}%</span>
          </div>
        )}
      </div>

      {comparison && (
        <div className={`comparison-badge${comparison.better ? ' comparison-badge--better' : ' comparison-badge--worse'}`}>
          <span className="comparison-badge__icon">{comparison.better ? '📉' : '📈'}</span>
          {comparison.text}
        </div>
      )}
    </div>
  );
}
