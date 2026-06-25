export const EXPENSE_CATEGORIES = [
  { id: 'stay',   label: 'לינה',               emoji: '🏨' },
  { id: 'flight', label: 'טיסות ותחבורה',       emoji: '✈️' },
  { id: 'food',   label: 'אוכל',               emoji: '🍽️' },
  { id: 'fun',    label: 'אטרקציות',            emoji: '🎟️' },
  { id: 'shop',   label: 'קניות',              emoji: '🛍️' },
  { id: 'car',    label: 'השכרת רכב',           emoji: '🚗' },
  { id: 'comm',   label: 'תקשורת',             emoji: '📱' },
  { id: 'health', label: 'בריאות וביטוח',       emoji: '🏥' },
  { id: 'other',  label: 'אחר',               emoji: '💼' },
];

export const getCategoryById = (id) =>
  EXPENSE_CATEGORIES.find(c => c.id === id) ?? EXPENSE_CATEGORIES[8];
