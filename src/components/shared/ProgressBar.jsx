export default function ProgressBar({ pct, variant = 'primary', small = false }) {
  const fill = Math.max(0, Math.min(100, pct));
  const trackClass = `progress-bar-track${small ? ' progress-bar-track--sm' : ''}`;
  const fillClass = `progress-bar-fill${
    variant === 'mint' ? ' progress-bar-fill--mint' :
    variant === 'rose' ? ' progress-bar-fill--rose' : ''
  }`;
  return (
    <div className={trackClass}>
      <div className={fillClass} style={{ width: `${fill}%` }} />
    </div>
  );
}
