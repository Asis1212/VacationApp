import { formatAmount } from '../../utils/formatters.js';

export default function DailyBarChart({ expenses, startDate, endDate, currency }) {
  if (!startDate || !endDate || expenses.length === 0) return null;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(d.toISOString().slice(0, 10));
  }

  if (days.length === 0 || days.length > 60) return null;

  const totals = {};
  for (const day of days) totals[day] = 0;
  for (const e of expenses) {
    if (totals[e.date] !== undefined) totals[e.date] += Number(e.amount);
  }

  const values = days.map(d => totals[d]);
  const max = Math.max(...values, 1);

  const BAR_W = Math.max(12, Math.min(32, Math.floor(280 / days.length) - 4));
  const GAP = Math.max(2, Math.floor(280 / days.length) - BAR_W);
  const chartW = days.length * (BAR_W + GAP) - GAP;
  const chartH = 80;

  const formatShortDate = (iso) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  return (
    <div className="daily-chart">
      <div className="daily-chart__title">הוצאות יומיות</div>
      <div className="daily-chart__scroll">
        <svg
          width={chartW}
          height={chartH + 28}
          viewBox={`0 0 ${chartW} ${chartH + 28}`}
          className="daily-chart__svg"
        >
          {days.map((day, i) => {
            const v = totals[day];
            const barH = v > 0 ? Math.max(4, (v / max) * chartH) : 2;
            const x = i * (BAR_W + GAP);
            const y = chartH - barH;
            const isToday = day === new Date().toISOString().slice(0, 10);
            return (
              <g key={day}>
                <rect
                  x={x}
                  y={y}
                  width={BAR_W}
                  height={barH}
                  rx={4}
                  fill={isToday ? '#FF8A6B' : v > 0 ? '#6C5CE7' : '#e8e8f0'}
                  opacity={v > 0 ? 1 : 0.5}
                />
                {days.length <= 14 && (
                  <text
                    x={x + BAR_W / 2}
                    y={chartH + 14}
                    textAnchor="middle"
                    className="daily-chart__label"
                  >
                    {formatShortDate(day)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      {days.length > 14 && (
        <div className="daily-chart__range">
          {formatShortDate(days[0])} – {formatShortDate(days[days.length - 1])}
        </div>
      )}
      <div className="daily-chart__avg">
        {(() => {
          const activeDays = values.filter(v => v > 0).length;
          if (activeDays === 0) return null;
          const totalSpent = values.reduce((a, b) => a + b, 0);
          const avg = totalSpent / activeDays;
          return `ממוצע ליום פעיל: ${formatAmount(avg, currency)}`;
        })()}
      </div>
    </div>
  );
}
