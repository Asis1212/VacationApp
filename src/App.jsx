import { useState } from 'react';
import { useTrips } from './hooks/useTrips.js';
import TripsListScreen from './components/TripsListScreen.jsx';
import TripDetailScreen from './components/TripDetailScreen.jsx';
import OnboardingScreen from './components/OnboardingScreen.jsx';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('onboarding_done')
  );
  const [view, setView] = useState({ screen: 'list', tripId: null, initialTab: 'home' });
  const { trips, loading, createTrip, deleteTrip, refreshTrip } = useTrips();

  const goToTrip = (tripId, initialTab = 'home') =>
    setView({ screen: 'detail', tripId, initialTab });

  const goToList = () =>
    setView({ screen: 'list', tripId: null, initialTab: 'home' });

  const handleOnboardingDone = () => {
    localStorage.setItem('onboarding_done', '1');
    setShowOnboarding(false);
  };

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
      />
    );
  }

  return (
    <TripsListScreen
      trips={trips}
      loading={loading}
      createTrip={createTrip}
      onSelectTrip={goToTrip}
    />
  );
}
