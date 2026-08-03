import { useState } from 'react';
import { formatAmount } from '../utils/formatters.js';

export default function DailyBarChart({ expenses, startDate, endDate, currency }) {
  const [tooltip, setTooltip] = useState(null); // { day, value, x, y }

  if (!startDate || !endDate || expenses.length === 0) return null;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(d.toISOString().slice(0, 10));
  }

  if (days.length === 0 || days.length > 90) return null;

  const totals = {};
  for (const day of days) totals[day] = 0;
  for (const e of expenses) {
    if (totals[e.date] !== undefined) totals[e.date] += Number(e.amount);
  }

  const values = days.map(d => totals[d]);
  const max = Math.max(...values, 1);
  const todayISO = new Date().toISOString().slice(0, 10);

  // 7-day moving average
  const movingAvg = values.map((_, i) => {
    const window = values.slice(Math.max(0, i - 3), i + 4);
    const active = window.filter(v => v > 0);
    return active.length > 0 ? active.reduce((a, b) => a + b, 0) / active.length : 0;
  });

  const BAR_W = Math.max(10, Math.min(28, Math.floor(300 / days.length) - 3));
  const GAP = Math.max(2, Math.floor(300 / days.length) - BAR_W);
  const chartW = days.length * (BAR_W + GAP) - GAP;
  const chartH = 88;
  const labelH = 18;
  const totalH = chartH + labelH;

  const formatShortDate = (iso) => {
    const d = new Date(iso + 'T00:00:00');
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  const showLabels = days.length <= 21;

  // Build the moving average polyline points
  const avgPoints = movingAvg
    .map((avg, i) => {
      const x = i * (BAR_W + GAP) + BAR_W / 2;
      const y = chartH - (avg / max) * chartH;
      return `${x},${y}`;
    })
    .join(' ');

  const activeDays = values.filter(v => v > 0).length;
  const totalSpent = values.reduce((a, b) => a + b, 0);
  const avgPerDay = activeDays > 0 ? totalSpent / activeDays : 0;
  const busiestDay = days[values.indexOf(Math.max(...values))];

  return (
    <div className="daily-chart">
      <div className="daily-chart__title">הוצאות יומיות</div>

      <div className="daily-chart__scroll" onMouseLeave={() => setTooltip(null)}>
        <svg
          width={chartW}
          height={totalH}
          viewBox={`0 0 ${chartW} ${totalH}`}
          className="daily-chart__svg"
        >
          {/* Bars */}
          {days.map((day, i) => {
            const v = totals[day];
            const barH = v > 0 ? Math.max(4, (v / max) * chartH) : 2;
            const x = i * (BAR_W + GAP);
            const y = chartH - barH;
            const isToday = day === todayISO;
            const isBusiest = day === busiestDay && v > 0;
            return (
              <g
                key={day}
                style={{ cursor: v > 0 ? 'pointer' : 'default' }}
                onClick={() => v > 0 && setTooltip(t => t?.day === day ? null : { day, value: v })}
              >
                <rect
                  x={x}
                  y={y}
                  width={BAR_W}
                  height={barH}
                  rx={BAR_W > 14 ? 5 : 3}
                  fill={
                    tooltip?.day === day ? '#FF8A6B' :
                    isToday ? '#FF8A6B' :
                    isBusiest ? '#A29BFE' :
                    v > 0 ? '#6C5CE7' : '#e8e8f0'
                  }
                  opacity={v > 0 ? 1 : 0.45}
                />
                {/* Invisible wider hit area */}
                <rect x={x} y={0} width={BAR_W} height={chartH} fill="transparent" />
                {showLabels && (
                  <text
                    x={x + BAR_W / 2}
                    y={chartH + 13}
                    textAnchor="middle"
                    className="daily-chart__label"
                  >
                    {formatShortDate(day)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Moving average line */}
          {activeDays >= 3 && (
            <polyline
              points={avgPoints}
              fill="none"
              stroke="#FF8A6B"
              strokeWidth="1.5"
              strokeDasharray="3 2"
              opacity="0.7"
              style={{ pointerEvents: 'none' }}
            />
          )}
        </svg>
      </div>

      {/* Tap tooltip */}
      {tooltip && (
        <div className="daily-chart__tooltip">
          <span className="daily-chart__tooltip-date">{formatShortDate(tooltip.day)}</span>
          <span className="daily-chart__tooltip-amount">{formatAmount(tooltip.value, currency)}</span>
        </div>
      )}

      {!showLabels && (
        <div className="daily-chart__range">
          {formatShortDate(days[0])} – {formatShortDate(days[days.length - 1])}
        </div>
      )}

      <div className="daily-chart__stats">
        {avgPerDay > 0 && (
          <span className="daily-chart__stat">
            ממוצע ליום: <strong>{formatAmount(avgPerDay, currency)}</strong>
          </span>
        )}
        {busiestDay && totals[busiestDay] > 0 && (
          <span className="daily-chart__stat">
            יום עמוס: <strong>{formatShortDate(busiestDay)}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
