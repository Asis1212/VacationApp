import { useState } from 'react';
import ProgressBar from '../components/ProgressBar.jsx';
import Icon from '../components/Icon.jsx';

// Fallback for rows saved during icon-migration period where emoji was undefined
const TITLE_EMOJI = {
  'מסמכים וכרטיסים': '📄',
  'צרכים דתיים':      '✡️',
  'אריזה וציוד':      '🧳',
  'כספים':            '💳',
  'לפני היציאה מהבית': '🏠',
};

function resolveEmoji(cat) {
  if (cat.emoji && cat.emoji !== 'undefined') return cat.emoji;
  return TITLE_EMOJI[cat.title] ?? '📋';
}

export default function ChecklistTab({ trip, addChecklistItem, toggleChecklistItem, deleteChecklistItem }) {
  const checklist = trip.checklist || [];
  const [newItemText, setNewItemText] = useState({});

  const totalItems = checklist.reduce((s, cat) => s + cat.items.length, 0);
  const doneItems  = checklist.reduce((s, cat) => s + cat.items.filter(i => i.done).length, 0);
  const totalPct   = totalItems > 0 ? (doneItems / totalItems) * 100 : 0;

  const handleAdd = (catId) => {
    const text = (newItemText[catId] || '').trim();
    if (!text) return;
    addChecklistItem(catId, text);
    setNewItemText(prev => ({ ...prev, [catId]: '' }));
  };

  return (
    <div className="checklist-tab">
      {/* Overall progress */}
      <div className="checklist-header-card">
        <div className="checklist-header-card__title">סה"כ התקדמות</div>
        <div className="checklist-header-card__progress-text">
          {doneItems} / {totalItems} סעיפים הושלמו
        </div>
        <ProgressBar pct={totalPct} variant="mint" />
      </div>

      {/* Categories */}
      {checklist.map(cat => {
        const catDone = cat.items.filter(i => i.done).length;
        const catPct  = cat.items.length > 0 ? (catDone / cat.items.length) * 100 : 0;
        return (
          <div className="checklist-cat-card" key={cat.id}>
            <div className="checklist-cat-card__header">
              <span className="checklist-cat-card__emoji">{resolveEmoji(cat)}</span>
              <span className="checklist-cat-card__title">{cat.title}</span>
              <span className="checklist-cat-card__count">{catDone}/{cat.items.length}</span>
            </div>
            <div className="checklist-cat-card__bar">
              <ProgressBar pct={catPct} variant="mint" small />
            </div>

            {cat.items.map(item => (
              <div className="checklist-item" key={item.id}>
                <button
                  type="button"
                  className={`checklist-item__checkbox${item.done ? ' checklist-item__checkbox--done' : ''}`}
                  onClick={() => toggleChecklistItem(cat.id, item.id)}
                  aria-label={item.done ? 'סמן כלא הושלם' : 'סמן כהושלם'}
                >
                  {item.done && <Icon name="Check" size={14} />}
                </button>
                <span className={`checklist-item__text${item.done ? ' checklist-item__text--done' : ''}`}>
                  {item.text}
                </span>
                <button
                  className="btn-icon"
                  onClick={() => deleteChecklistItem(cat.id, item.id)}
                  title="מחיקה"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            ))}

            <div className="checklist-add-row">
              <input
                type="text"
                placeholder="הוסף פריט..."
                value={newItemText[cat.id] || ''}
                onChange={e => setNewItemText(prev => ({ ...prev, [cat.id]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleAdd(cat.id)}
              />
              <button type="button" className="btn-add" onClick={() => handleAdd(cat.id)}>הוספה</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
