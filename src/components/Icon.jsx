// Thin wrapper — pass any Lucide icon name as `name`, e.g. <Icon name="Plane" />
import {
  Home, CreditCard, ListChecks, Settings2,
  Plus, X, Check, ArrowLeft, ArrowLeftRight,
  Plane, Sun, Sparkles, TriangleAlert, MapPin,
  Building2, UtensilsCrossed, Ticket, ShoppingBag,
  Car, Phone, HeartPulse, Briefcase,
  FileText, Star, Luggage, Banknote,
  BarChart3, List, Trash2,
} from 'lucide-react';

const ICONS = {
  // Navigation & tab bar
  'Home': Home,
  'CreditCard': CreditCard,
  'ListChecks': ListChecks,
  'Settings2': Settings2,

  // Actions
  'Plus': Plus,
  'X': X,
  'Check': Check,
  'ArrowLeft': ArrowLeft,
  'ArrowLeftRight': ArrowLeftRight,
  'Trash2': Trash2,

  // Semantic / status
  'Plane': Plane,
  'Sun': Sun,
  'Sparkles': Sparkles,
  'TriangleAlert': TriangleAlert,
  'MapPin': MapPin,

  // Expense categories
  'Building2': Building2,
  'UtensilsCrossed': UtensilsCrossed,
  'Ticket': Ticket,
  'ShoppingBag': ShoppingBag,
  'Car': Car,
  'Phone': Phone,
  'HeartPulse': HeartPulse,
  'Briefcase': Briefcase,

  // Checklist categories
  'FileText': FileText,
  'Star': Star,
  'Luggage': Luggage,
  'Banknote': Banknote,

  // Onboarding / charts
  'BarChart3': BarChart3,
  'List': List,
};

export default function Icon({ name, size = 22, className = '', style = {}, strokeWidth = 1.75 }) {
  const Component = ICONS[name];
  if (!Component) return null;
  return <Component size={size} className={className} style={style} strokeWidth={strokeWidth} />;
}
