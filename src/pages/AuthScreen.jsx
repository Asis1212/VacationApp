import { useState } from 'react';
import Icon from '../components/Icon.jsx';

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await onAuth.login(form.email, form.password);
      } else {
        if (!form.firstName.trim() || !form.lastName.trim()) {
          throw new Error('שם פרטי ושם משפחה חובה');
        }
        await onAuth.register(form.firstName, form.lastName, form.email, form.password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    setError('');
    setForm({ firstName: '', lastName: '', email: '', password: '' });
  };

  return (
    <div className="auth-screen">
      <div className="auth-screen__bg" />

      <div className="auth-card">
        <div className="auth-card__logo">
          <Icon name="Plane" size={36} style={{ color: 'var(--color-primary)' }} />
        </div>
        <h1 className="auth-card__title">
          {mode === 'login' ? 'ברוך הבא' : 'הצטרף אלינו'}
        </h1>
        <p className="auth-card__subtitle">
          {mode === 'login'
            ? 'התחבר כדי לראות את החופשות שלך'
            : 'צור חשבון ותתחיל לתכנן'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="auth-form__row">
              <div className="form-group">
                <label>שם פרטי</label>
                <input
                  type="text"
                  placeholder="ישראל"
                  value={form.firstName}
                  onChange={e => set('firstName', e.target.value)}
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className="form-group">
                <label>שם משפחה</label>
                <input
                  type="text"
                  placeholder="ישראלי"
                  value={form.lastName}
                  onChange={e => set('lastName', e.target.value)}
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>אימייל</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              autoComplete="email"
              dir="ltr"
              required
            />
          </div>

          <div className="form-group">
            <label>סיסמה</label>
            <input
              type="password"
              placeholder={mode === 'register' ? 'לפחות 6 תווים' : '••••••'}
              value={form.password}
              onChange={e => set('password', e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              dir="ltr"
              required
            />
          </div>

          {error && <div className="auth-form__error">{error}</div>}

          <button className="btn-primary auth-form__submit" type="submit" disabled={loading}>
            {loading
              ? 'טוען...'
              : mode === 'login' ? 'התחברות' : 'יצירת חשבון'}
          </button>
        </form>

        <div className="auth-card__switch">
          {mode === 'login' ? 'אין לך חשבון?' : 'כבר יש לך חשבון?'}
          <button className="auth-card__switch-btn" onClick={switchMode} type="button">
            {mode === 'login' ? 'הרשמה' : 'התחברות'}
          </button>
        </div>
      </div>
    </div>
  );
}
