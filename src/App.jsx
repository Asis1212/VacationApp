import { useState } from 'react';
import TripsListScreen from './components/TripsListScreen.jsx';
import TripDetailScreen from './components/TripDetailScreen.jsx';

export default function App() {
  const [view, setView] = useState({ screen: 'list', tripId: null, initialTab: 'home' });

  const goToTrip = (tripId, initialTab = 'home') =>
    setView({ screen: 'detail', tripId, initialTab });

  const goToList = () =>
    setView({ screen: 'list', tripId: null, initialTab: 'home' });

  if (view.screen === 'detail') {
    return (
      <TripDetailScreen
        tripId={view.tripId}
        initialTab={view.initialTab}
        onBack={goToList}
        onTripChange={() => {}}
      />
    );
  }

  return <TripsListScreen onSelectTrip={goToTrip} />;
}
