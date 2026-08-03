// Proxies Frankfurter (https://www.frankfurter.app) — free, no API key, ECB data
// Returns: { base, date, rates: { USD: 0.27, EUR: 0.25, ... } }
export default async (req) => {
  const url = new URL(req.url);
  const base = url.searchParams.get('base') || 'ILS';

  try {
    const res = await fetch(`https://api.frankfurter.app/latest?base=${base}`);
    if (!res.ok) throw new Error(`Frankfurter ${res.status}`);
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache at CDN edge for 4 hours — rates don't change more often than daily
        'Cache-Control': 'public, s-maxage=14400, stale-while-revalidate=3600',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = { path: '/api/rates' };
