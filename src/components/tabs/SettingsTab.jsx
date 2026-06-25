import { useState } from 'react';
import { removeItem, getItem, setItem } from '../../utils/storage.js';

export default function SettingsTab({ trip, updateTrip, onDeleted }) {
  const [form, setForm] = useState({
    name: trip.name || '',
    destination: trip.destination || '',
    startDate: trip.startDate || '',
    endDate: trip.endDate || '',
    budget: trip.budget || '',
    currency: trip.currency || 'ILS',
  });
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setError('תאריך הסיום חייב להיות אחרי תאריך ההתחלה');
      return;
    }
    setError('');
    updateTrip({
      name: form.name,
      destination: form.destination,
      startDate: form.startDate,
      endDate: form.endDate,
      budget: Number(form.budget) || 0,
      currency: form.currency,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    removeItem(`trip:${trip.id}`);
    const order = getItem('trips:order', []).filter(id => id !== trip.id);
    setItem('trips:order', order);
    onDeleted();
  };

  return (
    <div className="settings-tab">
      <div className="settings-form-card">
        <div className="settings-form-card__title">פרטי החופשה</div>

        <div className="form-group">
          <label>שם החופשה</label>
          <input type="text" placeholder="למשל: טיול לאירופה" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>

        <div className="form-group">
          <label>יעד</label>
          <input type="text" placeholder="למשל: פריז, צרפת" value={form.destination} onChange={e => set('destination', e.target.value)} />
        </div>

        <div className="grid-2col">
          <div className="form-group">
            <label>תאריך יציאה</label>
            <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
          </div>
          <div className="form-group">
            <label>תאריך חזרה</label>
            <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="grid-2col">
          <div className="form-group">
            <label>תקציב כולל</label>
            <input type="number" min="0" placeholder="0" value={form.budget} onChange={e => set('budget', e.target.value)} />
          </div>
          <div className="form-group">
            <label>מטבע</label>
            <select value={form.currency} onChange={e => set('currency', e.target.value)}>
              <option value="ILS">₪ שקל</option>
              <option value="USD">$ דולר</option>
              <option value="EUR">€ יורו</option>
              <option value="GBP">£ לירה</option>
              <option value="JPY">¥ ין</option>
            </select>
          </div>
        </div>

        <button className="btn-primary" onClick={handleSave}>
          {saved ? '✓ נשמר!' : 'שמירת שינויים'}
        </button>
      </div>

      <div className="settings-danger-card">
        <div className="settings-danger-card__title">אזור מסוכן</div>
        {!showConfirm ? (
          <button className="btn-danger" onClick={() => setShowConfirm(true)}>
            🗑️ מחיקת החופשה
          </button>
        ) : (
          <div className="confirm-box">
            <div className="confirm-box__text">
              האם אתה בטוח? פעולה זו אינה ניתנת לביטול. כל נתוני החופשה יימחקו לצמיתות.
            </div>
            <div className="confirm-box__actions">
              <button className="btn-ghost" onClick={() => setShowConfirm(false)}>ביטול</button>
              <button className="btn-danger-filled" onClick={handleDelete}>כן, מחק</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
