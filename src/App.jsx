import { useState } from 'react';
import { useTrips } from './hooks/useTrips.js';
import { useAuth } from './hooks/useAuth.js';
import TripsListScreen from './pages/TripsListScreen.jsx';
import TripDetailScreen from './pages/TripDetailScreen.jsx';
import OnboardingScreen from './pages/OnboardingScreen.jsx';
import AuthScreen from './pages/AuthScreen.jsx';

export default function App() {
  const { token, user, loading: authLoading, login, register, logout } = useAuth();

  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('onboarding_done')
  );
  const [view, setView] = useState({ screen: 'list', tripId: null, initialTab: 'home' });
  const { trips, loading, createTrip, deleteTrip, refreshTrip } = useTrips(token);

  const goToTrip = (tripId, initialTab = 'home') =>
    setView({ screen: 'detail', tripId, initialTab });

  const goToList = () =>
    setView({ screen: 'list', tripId: null, initialTab: 'home' });

  const handleOnboardingDone = () => {
    localStorage.setItem('onboarding_done', '1');
    setShowOnboarding(false);
  };

  // Waiting for auth check to finish
  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}>
        <div style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-heading)' }}>טוען...</div>
      </div>
    );
  }

  if (!token) {
    return <AuthScreen onAuth={{ login, register }} />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onDone={handleOnboardingDone} />;
  }

  if (view.screen === 'detail') {
    return (
      <TripDetailScreen
        tripId={view.tripId}
        initialTab={view.initialTab}
        onBack={goToList}
        onTripChange={refreshTrip}
        onDeleteTrip={deleteTrip}
        allTrips={trips}
        onLogout={logout}
      />
    );
  }

  return (
    <TripsListScreen
      trips={trips}
      loading={loading}
      createTrip={createTrip}
      onSelectTrip={goToTrip}
      user={user}
      onLogout={logout}
    />
  );
}
