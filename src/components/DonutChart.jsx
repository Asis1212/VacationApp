const COLORS = [
  '#6C5CE7', '#FF8A6B', '#13b894', '#FFB347', '#FF5C7A',
  '#4ECDC4', '#A29BFE', '#FD79A8', '#FDCB6E', '#74B9FF',
];

function polarToXY(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildArcPath(cx, cy, r, startDeg, endDeg) {
  const start = polarToXY(cx, cy, r, startDeg);
  const end = polarToXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;
}

export default function DonutChart({ slices, total, currency, formatAmount }) {
  const cx = 80;
  const cy = 80;
  const outerR = 68;
  const innerR = 42;

  let cursor = 0;
  const arcs = slices.map((s, i) => {
    const deg = (s.value / total) * 360;
    const path = buildArcPath(cx, cy, outerR, cursor, cursor + deg);
    const result = { ...s, path, color: COLORS[i % COLORS.length] };
    cursor += deg;
    return result;
  });

  const topSlice = slices[0];

  return (
    <div className="donut-chart">
      <svg viewBox="0 0 160 160" width="160" height="160" className="donut-chart__svg">
        {arcs.map((arc) => (
          <path key={arc.id} d={arc.path} fill={arc.color} />
        ))}
        <circle cx={cx} cy={cy} r={innerR} fill="white" />
        <text x={cx} y={cy - 8} textAnchor="middle" className="donut-chart__center-label">
          {topSlice?.emoji}
        </text>
        <text x={cx} y={cy + 9} textAnchor="middle" className="donut-chart__center-pct">
          {topSlice ? Math.round((topSlice.value / total) * 100) : 0}%
        </text>
        <text x={cx} y={cy + 22} textAnchor="middle" className="donut-chart__center-name">
          {topSlice?.label}
        </text>
      </svg>

      <div className="donut-chart__legend">
        {arcs.map((arc) => (
          <div key={arc.id} className="donut-chart__legend-item">
            <span className="donut-chart__legend-dot" style={{ background: arc.color }} />
            <span className="donut-chart__legend-emoji">{arc.emoji}</span>
            <span className="donut-chart__legend-name">{arc.label}</span>
            <span className="donut-chart__legend-amount">{formatAmount(arc.value, currency)}</span>
            <span className="donut-chart__legend-pct">
              {Math.round((arc.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
