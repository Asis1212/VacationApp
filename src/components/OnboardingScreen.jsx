import { useState } from 'react';
import Icon from './shared/Icon.jsx';

const SLIDES = [
  {
    icon: 'Plane',
    bg: 'linear-gradient(135deg, #6C5CE7 0%, #8E7BF0 60%, #FF8A6B 100%)',
    title: 'ברוכים הבאים!',
    desc: 'תכנן את החופשה הבאה שלך — מהטיסה ועד הרגע האחרון',
  },
  {
    icon: 'BarChart3',
    bg: 'linear-gradient(135deg, #13b894 0%, #20dbb5 60%, #6C5CE7 100%)',
    title: 'עקוב אחרי התקציב',
    desc: 'הוסף הוצאות, ראה לאן הולך הכסף וסיים את החופשה בתוך הגבולות',
  },
  {
    icon: 'ListChecks',
    bg: 'linear-gradient(135deg, #FF8A6B 0%, #FF5C7A 60%, #6C5CE7 100%)',
    title: 'אל תשכח כלום',
    desc: 'צ׳ק-ליסט חכם שמוכן מראש — רק סמן ותצא לדרך',
  },
];

export default function OnboardingScreen({ onDone }) {
  const [slide, setSlide] = useState(0);
  const [exiting, setExiting] = useState(false);

  const isLast = slide === SLIDES.length - 1;

  const next = () => {
    if (isLast) {
      finish();
    } else {
      setSlide(s => s + 1);
    }
  };

  const finish = () => {
    setExiting(true);
    setTimeout(onDone, 320);
  };

  const { icon, bg, title, desc } = SLIDES[slide];

  return (
    <div className={`onboarding${exiting ? ' onboarding--exit' : ''}`}>
      <div className="onboarding__slide" style={{ background: bg }} key={slide}>
        <div className="onboarding__blob onboarding__blob--1" />
        <div className="onboarding__blob onboarding__blob--2" />

        <button className="onboarding__skip btn-ghost" onClick={finish}>
          דלג
        </button>

        <div className="onboarding__content">
          <div className="onboarding__emoji">
            <Icon name={icon} size={72} style={{ color: 'rgba(255,255,255,0.95)' }} />
          </div>
          <h1 className="onboarding__title">{title}</h1>
          <p className="onboarding__desc">{desc}</p>
        </div>

        <div className="onboarding__footer">
          <div className="onboarding__dots">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={`onboarding__dot${i === slide ? ' onboarding__dot--active' : ''}`}
              />
            ))}
          </div>

          <button className="onboarding__next btn-primary" onClick={next}>
            {isLast ? <>בואו נתחיל <Icon name="Plane" size={18} style={{ verticalAlign: 'middle', marginRight: 4 }} /></> : 'הבא'}
          </button>
        </div>
      </div>
    </div>
  );
}
