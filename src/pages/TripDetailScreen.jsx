import { useState } from 'react';
import { useTrip } from '../hooks/useTrip.js';
import HomeTab from './HomeTab.jsx';
import BudgetTab from './BudgetTab.jsx';
import ChecklistTab from './ChecklistTab.jsx';
import SettingsTab from './SettingsTab.jsx';
import Icon from '../components/Icon.jsx';

const TABS = [
  { id: 'home',      label: 'בית',       icon: 'Home' },
  { id: 'budget',    label: 'תקציב',     icon: 'CreditCard' },
  { id: 'checklist', label: "צ'ק-ליסט",  icon: 'ListChecks' },
  { id: 'settings',  label: 'הגדרות',    icon: 'Settings2' },
];

export default function TripDetailScreen({ tripId, initialTab = 'home', onBack, onTripChange, onDeleteTrip }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { trip, updateTrip, addExpense, deleteExpense, addChecklistItem, toggleChecklistItem, deleteChecklistItem } = useTrip(tripId, onTripChange);

  const handleDelete = async () => {
    if (onDeleteTrip) await onDeleteTrip(tripId);
    onBack();
  };

  if (!trip) {
    return (
      <div className="app-shell">
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-muted)' }}>
          החופשה לא נמצאה
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="detail-screen">
        <div className="detail-header">
          <button className="detail-header__back" onClick={onBack}>
            <Icon name="ArrowLeft" size={16} /> החופשות
          </button>
          <div className="detail-header__name">
            {trip.name || 'חופשה ללא שם'}
          </div>
        </div>

        <div className="tab-content">
          {activeTab === 'home'      && <HomeTab trip={trip} />}
          {activeTab === 'budget'    && <BudgetTab trip={trip} addExpense={addExpense} deleteExpense={deleteExpense} />}
          {activeTab === 'checklist' && <ChecklistTab trip={trip} addChecklistItem={addChecklistItem} toggleChecklistItem={toggleChecklistItem} deleteChecklistItem={deleteChecklistItem} />}
          {activeTab === 'settings'  && <SettingsTab trip={trip} updateTrip={updateTrip} onDeleted={handleDelete} />}
        </div>

        <nav className="tab-bar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-bar__item${activeTab === tab.id ? ' tab-bar__item--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-bar__icon"><Icon name={tab.icon} size={22} /></span>
              <span className="tab-bar__label">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
