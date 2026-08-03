import { getTripStatus, sortTrips } from '../utils/tripHelpers.js';
import TripCard from '../components/TripCard.jsx';
import Icon from '../components/Icon.jsx';

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
          <button className="btn-primary" onClick={handleNew}>
            <Icon name="plus" size={17} style={{ verticalAlign: 'middle', marginLeft: 6 }} />
            חופשה חדשה
          </button>
        </div>

        {!loading && trips.length === 0 && (
          <div className="empty-first-trip fade-in-up">
            <div className="empty-first-trip__plane">
              <Icon name="Plane" size={56} />
            </div>
            <h2 className="empty-first-trip__title">אין לך חופשות עדיין</h2>
            <p className="empty-first-trip__desc">לחץ על הכפתור למעלה כדי לתכנן את החופשה הבאה שלך</p>
            <div className="empty-first-trip__features">
              <div className="empty-first-trip__feature">
                <Icon name="CreditCard" size={15} /><span>מעקב תקציב</span>
              </div>
              <div className="empty-first-trip__feature">
                <Icon name="ListChecks" size={15} /><span>צ׳ק-ליסט</span>
              </div>
              <div className="empty-first-trip__feature">
                <Icon name="Plane" size={15} /><span>ספירה לאחור</span>
              </div>
            </div>
          </div>
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
