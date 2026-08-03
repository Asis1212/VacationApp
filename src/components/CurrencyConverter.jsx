import { useState } from 'react';
import { useCurrencyRates } from '../hooks/useCurrencyRates.js';
import { CURRENCIES } from '../data/currencies.js';
import { formatAmount } from '../utils/formatters.js';
import Icon from './Icon.jsx';

export default function CurrencyConverter({ baseCurrency }) {
  const [amount, setAmount] = useState('100');
  const { rates, date, loading, error, convert } = useCurrencyRates(baseCurrency);

  const targets = CURRENCIES.filter(c => c.code !== baseCurrency);
  const n = parseFloat(amount) || 0;

  return (
    <div className="currency-converter">
      <div className="currency-converter__header">
        <div className="currency-converter__title">
          <Icon name="ArrowLeftRight" size={15} style={{ marginLeft: 6 }} />
          המרת מטבע
        </div>
        {date && !loading && (
          <span className="currency-converter__date">שערים מ-{date}</span>
        )}
      </div>

      <div className="currency-converter__input-row">
        <input
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="currency-converter__input"
        />
        <span className="currency-converter__base-label">
          {CURRENCIES.find(c => c.code === baseCurrency)?.symbol ?? baseCurrency}
        </span>
      </div>

      {loading && (
        <div className="currency-converter__loading">טוען שערים...</div>
      )}

      {error && (
        <div className="currency-converter__error">
          <Icon name="TriangleAlert" size={14} style={{ marginLeft: 4 }} />
          שערי חליפין זמינים רק בגרסה המלאה (netlify dev)
        </div>
      )}

      {rates && !loading && (
        <div className="currency-converter__rates">
          {targets.map(c => {
            const converted = convert(n, c.code);
            return (
              <div key={c.code} className="currency-converter__rate-row">
                <span className="currency-converter__rate-code">{c.code}</span>
                <span className="currency-converter__rate-label">{c.label}</span>
                <span className="currency-converter__rate-value">
                  {converted != null ? formatAmount(converted, c.code) : '—'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
