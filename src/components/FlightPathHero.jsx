// Quadratic bezier: P0=(20,90), P1=(150,10), P2=(280,90)
const P0 = { x: 20, y: 90 };
const P1 = { x: 150, y: 10 };
const P2 = { x: 280, y: 90 };

function bezierPoint(t) {
  const mt = 1 - t;
  return {
    x: mt * mt * P0.x + 2 * mt * t * P1.x + t * t * P2.x,
    y: mt * mt * P0.y + 2 * mt * t * P1.y + t * t * P2.y,
  };
}

function bezierTangent(t) {
  const mt = 1 - t;
  return {
    x: 2 * mt * (P1.x - P0.x) + 2 * t * (P2.x - P1.x),
    y: 2 * mt * (P1.y - P0.y) + 2 * t * (P2.y - P1.y),
  };
}

export default function FlightPathHero({ daysRemaining, destination, status }) {
  const progress = Math.max(0, Math.min(1, 1 - Math.min(daysRemaining ?? 180, 180) / 180));
  const t = status === 'active' || status === 'past' ? 1 : progress;

  const pt = bezierPoint(t);
  const tang = bezierTangent(t);
  const angle = Math.atan2(tang.y, tang.x) * (180 / Math.PI);

  return (
    <div className="flight-hero__svg-wrap">
      <svg viewBox="0 0 300 110" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
          </linearGradient>
        </defs>

        {/* Dashed flight path */}
        <path
          d={`M ${P0.x},${P0.y} Q ${P1.x},${P1.y} ${P2.x},${P2.y}`}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Origin dot */}
        <circle cx={P0.x} cy={P0.y} r="4" fill="rgba(255,255,255,0.6)" />
        <text x={P0.x} y={P0.y + 14} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.6)" fontFamily="Rubik">
          ישראל
        </text>

        {/* Destination dot */}
        <circle cx={P2.x} cy={P2.y} r="4" fill="rgba(255,255,255,0.6)" />
        <text x={P2.x} y={P2.y + 14} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.85)" fontFamily="Rubik">
          {destination || 'יעד'}
        </text>

        {/* Plane — inline SVG path, no emoji */}
        <g
          className="plane-group"
          transform={`translate(${pt.x}, ${pt.y}) rotate(${angle})`}
        >
          <path
            d="M0 -7 L-3.5 1 L-1.5 0.5 L-1.5 4 L0 3 L1.5 4 L1.5 0.5 L3.5 1 Z"
            fill="rgba(255,255,255,0.95)"
          />
        </g>
      </svg>
    </div>
  );
}
