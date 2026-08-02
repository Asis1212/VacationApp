import Icon from './Icon.jsx';

export default function CategoryChip({ cat, selected, onClick }) {
  return (
    <button
      type="button"
      className={`chip${selected ? ' chip--selected' : ''}`}
      onClick={onClick}
    >
      {cat.emoji} {cat.label}
    </button>
  );
}
