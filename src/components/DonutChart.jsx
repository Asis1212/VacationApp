import { useState } from 'react';

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
  const [activeId, setActiveId] = useState(null);

  const cx = 90;
  const cy = 90;
  const outerR = 76;
  const innerR = 48;

  let cursor = 0;
  const arcs = slices.map((s, i) => {
    const deg = (s.value / total) * 360;
    const path = buildArcPath(cx, cy, outerR, cursor, cursor + deg);
    const result = { ...s, path, color: COLORS[i % COLORS.length], startDeg: cursor, endDeg: cursor + deg };
    cursor += deg;
    return result;
  });

  const activeArc = arcs.find(a => a.id === activeId) ?? arcs[0];

  const handleSliceClick = (id) => {
    setActiveId(prev => (prev === id ? null : id));
  };

  return (
    <div className="donut-chart">
      <svg viewBox="0 0 180 180" width="180" height="180" className="donut-chart__svg">
        {arcs.map((arc) => {
          const isActive = arc.id === (activeId ?? arcs[0]?.id);
          return (
            <path
              key={arc.id}
              d={arc.path}
              fill={arc.color}
              opacity={activeId && !isActive ? 0.35 : 1}
              style={{
                cursor: 'pointer',
                transform: isActive ? `scale(1.04)` : 'scale(1)',
                transformOrigin: `${cx}px ${cy}px`,
                transition: 'opacity 0.2s, transform 0.2s',
              }}
              onClick={() => handleSliceClick(arc.id)}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={innerR} fill="white" style={{ pointerEvents: 'none' }} />
        <text x={cx} y={cy - 14} textAnchor="middle" className="donut-chart__center-emoji">
          {activeArc?.emoji}
        </text>
        <text x={cx} y={cy + 6} textAnchor="middle" className="donut-chart__center-pct">
          {activeArc ? Math.round((activeArc.value / total) * 100) : 0}%
        </text>
        <text x={cx} y={cy + 20} textAnchor="middle" className="donut-chart__center-name">
          {activeArc?.label}
        </text>
      </svg>

      <div className="donut-chart__legend">
        {arcs.map((arc) => {
          const isActive = arc.id === (activeId ?? null);
          return (
            <div
              key={arc.id}
              className={`donut-chart__legend-item${isActive ? ' donut-chart__legend-item--active' : ''}`}
              onClick={() => handleSliceClick(arc.id)}
            >
              <span className="donut-chart__legend-dot" style={{ background: arc.color }} />
              <span className="donut-chart__legend-emoji">{arc.emoji}</span>
              <span className="donut-chart__legend-name">{arc.label}</span>
              <span className="donut-chart__legend-amount">{formatAmount(arc.value, currency)}</span>
              <span className="donut-chart__legend-pct">
                {Math.round((arc.value / total) * 100)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
