// handoff/components/icons-config.tsx
// Centralna mapa ikon Lucide używanych w projekcie
// Użycie: <Icon name="zap" /> zamiast bezpośredniego importu

import {
  Award,
  Stethoscope,
  HandHeart,
  PhoneOff,
  CreditCard,
  Zap,
  CalendarCheck,
  BookOpen,
  ArrowRight,
  Mail,
  LayoutList,
  MessageSquareText,
  Headphones,
  VideoOff,
  Check,
  Timer,
  Search,
  ClipboardList,
  HelpCircle,
  Clock,
  Lightbulb,
  Star,
  PawPrint,
  Dog,
  Cat,
  ShieldCheck,
  Footprints,
  Utensils,
  HeartHandshake,
  Home,
  CalendarDays,
  Droplets,
  Leaf,
  Users,
  MessageCircle,
  Download,
  type LucideIcon,
} from 'lucide-react';

export const iconMap = {
  // Credentials / kwalifikacje
  award: Award,
  stethoscope: Stethoscope,
  'hand-heart': HandHeart,
  'phone-off': PhoneOff,
  'credit-card': CreditCard,
  utensils: Utensils,
  'heart-handshake': HeartHandshake,

  // CTA / nawigacja
  zap: Zap,
  'calendar-check': CalendarCheck,
  'book-open': BookOpen,
  'arrow-right': ArrowRight,
  mail: Mail,
  download: Download,
  'message-circle': MessageCircle,

  // Jak to działa
  'layout-list': LayoutList,
  'message-square-text': MessageSquareText,
  headphones: Headphones,
  'video-off': VideoOff,
  check: Check,

  // Oferta
  timer: Timer,
  search: Search,
  'clipboard-list': ClipboardList,

  // FAQ
  'help-circle': HelpCircle,
  clock: Clock,
  lightbulb: Lightbulb,

  // Opinie
  star: Star,

  // Pies
  'paw-print': PawPrint,
  dog: Dog,
  cat: Cat,
  'shield-check': ShieldCheck,
  footprints: Footprints,
  home: Home,
  'calendar-days': CalendarDays,

  // Kot
  droplets: Droplets,
  leaf: Leaf,
  users: Users,
} as const;

export type IconName = keyof typeof iconMap;

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, className = '', strokeWidth = 2.5 }: IconProps) {
  const LucideIcon = iconMap[name] as LucideIcon;
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} strokeWidth={strokeWidth} />;
}
