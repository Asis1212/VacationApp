import { getTripStatus, sortTrips } from '../utils/tripHelpers.js';
import TripCard from './TripCard.jsx';
import EmptyState from './shared/EmptyState.jsx';

const SOON_STATUSES = new Set(['draft', 'upcoming', 'today', 'active']);

export default function TripsListScreen({ trips, loading, createTrip, onSelectTrip }) {
  const handleNew = async () => {
    const id = await createTrip();
    onSelectTrip(id, 'settings');
  };

  const sorted = sortTrips(trips);
  const soon = sorted.filter(t => SOON_STATUSES.has(getTripStatus(t)));
  const past = sorted.filter(t => getTripStatus(t) === 'past');
  const count = trips.length;

  return (
    <div className="app-shell">
      <div className="trips-screen">
        <div className="trips-screen__header">
          <h1 className="trips-screen__title">החופשות שלי</h1>
          <p className="trips-screen__subtitle">
            {loading ? 'טוען...' : count === 0 ? 'אין עדיין חופשות' : count === 1 ? 'חופשה אחת' : `${count} חופשות`}
          </p>
        </div>

        <div className="trips-screen__cta">
          <button className="btn-primary" onClick={handleNew}>＋ חופשה חדשה</button>
        </div>

        {!loading && trips.length === 0 && (
          <EmptyState
            emoji="🧳"
            title="אין לך חופשות עדיין"
            desc="לחץ על הכפתור למעלה כדי לתכנן את החופשה הבאה שלך"
          />
        )}

        {soon.length > 0 && (
          <div className="trips-section">
            <div className="trips-section__title">בקרוב</div>
            <div className="trips-section__list">
              {soon.map(trip => (
                <TripCard key={trip.id} trip={trip} onClick={() => onSelectTrip(trip.id)} />
              ))}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div className="trips-section" style={{ marginTop: 16 }}>
            <div className="trips-section__title">חופשות שהיו</div>
            <div className="trips-section__list">
              {past.map(trip => (
                <TripCard key={trip.id} trip={trip} onClick={() => onSelectTrip(trip.id)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
