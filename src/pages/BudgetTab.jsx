import { useState } from 'react';
import { EXPENSE_CATEGORIES, getCategoryById } from '../data/expenseCategories.js';
import { formatAmount, formatDate } from '../utils/formatters.js';
import { getTotalSpent } from '../utils/tripHelpers.js';
import CategoryChip from '../components/CategoryChip.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import DonutChart from '../components/DonutChart.jsx';
import DailyBarChart from '../components/DailyBarChart.jsx';
import CurrencyConverter from '../components/CurrencyConverter.jsx';
import SpendingInsights from '../components/SpendingInsights.jsx';
import Icon from '../components/Icon.jsx';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrencySymbol(code) {
  const map = { ILS: '₪', USD: '$', EUR: '€', GBP: '£', JPY: '¥', THB: '฿' };
  return map[code] || code;
}

export default function BudgetTab({ trip, addExpense, deleteExpense, allTrips = [] }) {
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState('other');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayISO());
  const [showConverter, setShowConverter] = useState(false);

  const budget = Number(trip.budget) || 0;
  const spent = getTotalSpent(trip);
  const remaining = budget - spent;
  const isOver = budget > 0 && spent > budget;
  const spentPct = budget > 0 ? (spent / budget) * 100 : 0;

  const expenses = trip.expenses || [];

  const byCategory = {};
  for (const e of expenses) {
    byCategory[e.cat] = (byCategory[e.cat] || 0) + Number(e.amount);
  }
  const catTotals = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a);

  const handleAdd = () => {
    const n = parseFloat(amount);
    if (!n || n <= 0) return;
    addExpense({
      id: crypto.randomUUID(),
      amount: n,
      cat,
      note: note.trim(),
      date,
    });
    setAmount('');
    setNote('');
    setDate(todayISO());
  };

  const symbol = getCurrencySymbol(trip.currency);

  return (
    <div className="budget-tab">
      {/* Add expense */}
      <div className="add-expense-card">
        <div className="add-expense-card__title">הוספת הוצאה</div>

        <div className="form-group">
          <label>סכום</label>
          <div className="amount-wrapper">
            <input
              type="number"
              min="0"
              step="any"
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <span className="amount-currency-symbol">{symbol}</span>
          </div>
        </div>

        <div className="chips-row">
          {EXPENSE_CATEGORIES.map(c => (
            <CategoryChip key={c.id} cat={c} selected={cat === c.id} onClick={() => setCat(c.id)} />
          ))}
        </div>

        <div className="form-group">
          <label>הערה (אופציונלי)</label>
          <input type="text" placeholder="למשל: ארוחת ערב במסעדה" value={note} onChange={e => setNote(e.target.value)} />
        </div>

        <div className="form-group">
          <label>תאריך</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <button className="btn-primary" onClick={handleAdd}>הוסף הוצאה</button>
      </div>

      {/* Budget status */}
      {budget > 0 && (
        <div className="budget-status-card">
          <div className="budget-status-card__amounts">
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: 2 }}>הוצאתי</div>
              <div className="budget-status-card__spent">{formatAmount(spent, trip.currency)}</div>
            </div>
            <div className={`budget-status-card__remaining${isOver ? ' budget-status-card__remaining--over' : ''}`}>
              {isOver
                ? `חרגתי ב-${formatAmount(spent - budget, trip.currency)}`
                : `נותר ${formatAmount(remaining, trip.currency)}`}
              <div style={{ fontSize: '0.72rem', marginTop: 2 }}>מתוך {formatAmount(budget, trip.currency)}</div>
            </div>
          </div>
          <ProgressBar pct={spentPct} variant={isOver ? 'rose' : 'primary'} />
          {isOver && (
            <div className="over-budget-warning">
              <Icon name="TriangleAlert" size={16} />
              חרגת מהתקציב שהגדרת
            </div>
          )}
        </div>
      )}

      {/* Analytics charts */}
      {catTotals.length > 0 && (
        <div className="analytics-section">
          <div className="analytics-section__title">ניתוח הוצאות</div>

          <SpendingInsights trip={trip} allTrips={allTrips} />

          <DonutChart
            slices={catTotals.map(([catId, value]) => {
              const c = getCategoryById(catId);
              return { id: catId, value, emoji: c.emoji, label: c.label };
            })}
            total={spent}
            currency={trip.currency}
            formatAmount={formatAmount}
          />

          <DailyBarChart
            expenses={expenses}
            startDate={trip.startDate}
            endDate={trip.endDate}
            currency={trip.currency}
          />
        </div>
      )}

      {/* Expenses list */}
      {expenses.length > 0 && (
        <div className="expenses-list">
          <div className="expenses-list__title">כל ההוצאות</div>
          {expenses.map(e => {
            const c = getCategoryById(e.cat);
            return (
              <div className="expense-item" key={e.id}>
                <div className="expense-item__emoji">{c.emoji}</div>
                <div className="expense-item__info">
                  <div className="expense-item__cat">{c.label}</div>
                  {e.note && <div className="expense-item__note">{e.note}</div>}
                </div>
                <div className="expense-item__right">
                  <div className="expense-item__amount">{formatAmount(e.amount, trip.currency)}</div>
                  <div className="expense-item__date">{formatDate(e.date)}</div>
                </div>
                <button className="btn-icon" onClick={() => deleteExpense(e.id)} title="מחיקה">
                  <Icon name="X" size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Currency converter button */}
      {trip.currency && (
        <button className="btn-converter" onClick={() => setShowConverter(true)}>
          <Icon name="ArrowLeftRight" size={16} style={{ marginLeft: 8 }} />
          המרת מטבע
        </button>
      )}

      {/* Currency converter modal */}
      {showConverter && (
        <div className="modal-overlay" onClick={() => setShowConverter(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet__header">
              <span className="modal-sheet__title">המרת מטבע</span>
              <button className="modal-sheet__close" onClick={() => setShowConverter(false)}>
                <Icon name="X" size={18} />
              </button>
            </div>
            <CurrencyConverter baseCurrency={trip.currency} />
          </div>
        </div>
      )}

      {expenses.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
          עדיין אין הוצאות רשומות
        </div>
      )}
    </div>
  );
}
