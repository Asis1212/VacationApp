import { useState, useEffect } from 'react';

// In-memory cache keyed by base currency — persists for the lifetime of the tab
const cache = {};

export function useCurrencyRates(baseCurrency) {
  const [rates, setRates] = useState(cache[baseCurrency]?.rates ?? null);
  const [date, setDate] = useState(cache[baseCurrency]?.date ?? null);
  const [loading, setLoading] = useState(!cache[baseCurrency]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!baseCurrency) return;
    if (cache[baseCurrency]) {
      setRates(cache[baseCurrency].rates);
      setDate(cache[baseCurrency].date);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/rates?base=${baseCurrency}`)
      .then(r => {
        if (r.status === 404) throw new Error('unavailable');
        return r.json();
      })
      .then(data => {
        if (data.error) throw new Error(data.error);
        // Frankfurter doesn't include the base currency itself — add it
        const rates = { ...data.rates, [baseCurrency]: 1 };
        cache[baseCurrency] = { rates, date: data.date };
        setRates(rates);
        setDate(data.date);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [baseCurrency]);

  // Convert an amount from base currency to target currency
  const convert = (amount, toCurrency) => {
    if (!rates || toCurrency === baseCurrency) return amount;
    const rate = rates[toCurrency];
    if (!rate) return null;
    return amount * rate;
  };

  return { rates, date, loading, error, convert };
}
