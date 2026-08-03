function getToken() {
  return localStorage.getItem('auth_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const fetchTrips    = ()     => request('/api/trips');
export const fetchTrip     = (id)   => request(`/api/trips/${id}`);
export const createTripAPI = (trip) => request('/api/trips',         { method: 'POST',   body: JSON.stringify(trip) });
export const updateTripAPI = (trip) => request(`/api/trips/${trip.id}`, { method: 'PUT', body: JSON.stringify(trip) });
export const deleteTripAPI = (id)   => request(`/api/trips/${id}`,   { method: 'DELETE' });
