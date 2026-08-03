export default function EmptyState({ emoji = '✈️', title, desc, children }) {
  return (
    <div className="empty-state">
      <div className="empty-state__emoji">{emoji}</div>
      {title && <div className="empty-state__title">{title}</div>}
      {desc && <div className="empty-state__desc">{desc}</div>}
      {children}
    </div>
  );
}
