/*
 * REGULSKI — SVG Icon Components
 * ─────────────────────────────────────────────────────
 * HANDOFF: Each icon is a React component.
 * Import individually in Next.js:
 *   import { IconReactivity } from '@/components/icons'
 *
 * All icons: 24×24 viewBox, stroke="currentColor",
 * strokeWidth="1.5", fill="none", rounded caps.
 * Colour inherits from parent — set via CSS `color`.
 * ─────────────────────────────────────────────────────
 */

const IC = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={props.size || 28}
    height={props.size || 28}
    style={props.style}
    aria-hidden="true"
  >
    {props.children}
  </svg>
);

/* ── DOG PROBLEMS ─────────────────────────────── */

/* Reaktywność na smyczy — tension arrows */
const IconReactivity = (p) => (
  <IC {...p}>
    <path d="M3 12h5M16 12h5" />
    <path d="M3 9l-2 3 2 3" />
    <path d="M21 9l2 3-2 3" />
    <path d="M8 12l2-2.5 2 2.5 2-2.5 2 2.5" />
  </IC>
);

/* Separacja / lęk przed samotnością — house + isolated dot */
const IconSeparation = (p) => (
  <IC {...p}>
    <path d="M3 11.5L12 4l9 7.5" />
    <path d="M5 10v9h4v-5h6v5h4V10" />
    <circle cx="20.5" cy="20" r="1.5" />
    <path d="M15 19.5l4 0" strokeDasharray="1.5 1.5" />
  </IC>
);

/* Pobudzenie / nadaktywność — lightning bolt */
const IconHyperactivity = (p) => (
  <IC {...p}>
    <path d="M13 2L4 13.5h7L9 22l11-11.5h-7L13 2z" />
  </IC>
);

/* Szczekanie — speech bubble with sound waves */
const IconBarking = (p) => (
  <IC {...p}>
    <path d="M6 12a6 6 0 1 0 12 0 6 6 0 0 0-12 0z" />
    <path d="M2 8c1-2 2.5-3 4-3" />
    <path d="M2 16c1 2 2.5 3 4 3" />
    <path d="M9 12h.01M12 12h.01M15 12h.01" strokeWidth="2" />
  </IC>
);

/* Gryzienie / niszczenie — jaw teeth */
const IconBiting = (p) => (
  <IC {...p}>
    <path d="M4 10h16M4 14h16" />
    <path d="M7 10V7M10 10V8M13 10V7M16 10V8" />
    <path d="M7 14v3M10 14v2M13 14v3M16 14v2" />
    <path d="M4 10v4M20 10v4" />
  </IC>
);

/* Strach / lęki — shield with exclamation */
const IconFear = (p) => (
  <IC {...p}>
    <path d="M12 2l8 3v7c0 4.5-3.5 8-8 10-4.5-2-8-5.5-8-10V5l8-3z" />
    <path d="M12 8v4" />
    <circle cx="12" cy="15.5" r=".75" fill="currentColor" stroke="none" />
  </IC>
);

/* Młody pies / socjalizacja — three connected nodes */
const IconSocialization = (p) => (
  <IC {...p}>
    <circle cx="12" cy="4" r="2.5" />
    <circle cx="4.5" cy="18" r="2.5" />
    <circle cx="19.5" cy="18" r="2.5" />
    <path d="M12 6.5L7 15.7M12 6.5L17 15.7" />
    <path d="M7 18h10" />
  </IC>
);

/* Inne (pies) — horizontal lines */
const IconOtherDog = (p) => (
  <IC {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 10c0-1.7 1.3-3 3-3s3 1.3 3 3c0 1.8-2 2.5-2 4.5" />
    <circle cx="12" cy="17" r=".75" fill="currentColor" stroke="none" />
  </IC>
);

/* ── CAT PROBLEMS ─────────────────────────────── */

/* Kuweta — litter box tray */
const IconLitter = (p) => (
  <IC {...p}>
    <rect x="2" y="11" width="20" height="10" rx="1" />
    <path d="M7 11V8M17 11V8" />
    <path d="M2 8h20" />
    <circle cx="8.5" cy="16.5" r=".75" fill="currentColor" stroke="none" />
    <circle cx="12" cy="15" r=".75" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="17" r=".75" fill="currentColor" stroke="none" />
  </IC>
);

/* Agresja między kotami — two arrowheads facing */
const IconCatAggression = (p) => (
  <IC {...p}>
    <path d="M2 18l5-12 2 4 2-4" />
    <path d="M22 18l-5-12-2 4-2-4" />
    <path d="M9 18h6" />
    <path d="M2 18h6M16 18h6" strokeOpacity="0.4" />
  </IC>
);

/* Agresja wobec ludzi — open hand + warning */
const IconHumanAggression = (p) => (
  <IC {...p}>
    <path d="M8 13V6a1.5 1.5 0 0 1 3 0v5" />
    <path d="M11 8V5a1.5 1.5 0 0 1 3 0v4" />
    <path d="M14 9V7a1.5 1.5 0 0 1 3 0v8c0 3-2 5-5 5h-1a5 5 0 0 1-5-5v-3h2" />
    <path d="M3 10l3 0" />
    <path d="M2.5 8l1.5 1M2.5 13l1.5-1" />
  </IC>
);

/* Wycofanie / lęk — arrow retreating to corner */
const IconWithdrawal = (p) => (
  <IC {...p}>
    <path d="M18 6L6 18" />
    <path d="M6 6v12h12" />
    <path d="M18 13l-3-3 3-3" />
    <circle cx="6" cy="18" r="1.5" fill="currentColor" stroke="none" />
  </IC>
);

/* Drapanie mebli — three parallel scratch marks */
const IconScratching = (p) => (
  <IC {...p}>
    <path d="M7 3c.5 4-1 9-1 18M12 3c.5 4-1 9-1 18M17 3c.5 4-1 9-1 18" />
    <path d="M5 9l14-2M4 16l14-2" />
  </IC>
);

/* Nadmierne wokalizowanie — sound wave bars */
const IconVocalization = (p) => (
  <IC {...p}>
    <path d="M3 12h2" />
    <path d="M19 12h2" />
    <path d="M6 9v6" />
    <path d="M18 9v6" />
    <path d="M9 6v12" />
    <path d="M15 6v12" />
    <path d="M12 3v18" />
  </IC>
);

/* Stres po zmianach — house with change arrow */
const IconStress = (p) => (
  <IC {...p}>
    <path d="M3 12.5L9 6l6 6.5" />
    <path d="M5 11v8h8v-8" />
    <path d="M16 5h6M19 2l3 3-3 3" />
    <path d="M21 12v8h-5" />
  </IC>
);

/* Inne (kot) — three dots */
const IconOtherCat = (p) => (
  <IC {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="8.5" cy="12" r=".75" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r=".75" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="12" r=".75" fill="currentColor" stroke="none" />
  </IC>
);

/* ── MISC ICONS ────────────────────────────────── */

const IconMoon = (p) => (
  <IC {...p} size={18}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
  </IC>
);

const IconSun = (p) => (
  <IC {...p} size={18}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </IC>
);

const IconArrow = (p) => (
  <IC {...p} size={16}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </IC>
);

const IconCheck = (p) => (
  <IC {...p} size={16}>
    <path d="M5 12l5 5L19 7" />
  </IC>
);

const IconClose = (p) => (
  <IC {...p} size={18}>
    <path d="M18 6L6 18M6 6l12 12" />
  </IC>
);

const IconMenu = (p) => (
  <IC {...p} size={20}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </IC>
);

const IconChevron = (p) => (
  <IC {...p} size={16}>
    <path d={p.up ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
  </IC>
);

const IconCalendar = (p) => (
  <IC {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </IC>
);

const IconMail = (p) => (
  <IC {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 8 10-8" />
  </IC>
);

const IconPhone = (p) => (
  <IC {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </IC>
);

const IconDownload = (p) => (
  <IC {...p}>
    <path d="M12 3v12M8 11l4 4 4-4" />
    <path d="M3 18h18" />
  </IC>
);

/* ── Export all icons to window ── */
Object.assign(window, {
  IC,
  IconReactivity, IconSeparation, IconHyperactivity, IconBarking,
  IconBiting, IconFear, IconSocialization, IconOtherDog,
  IconLitter, IconCatAggression, IconHumanAggression, IconWithdrawal,
  IconScratching, IconVocalization, IconStress, IconOtherCat,
  IconMoon, IconSun, IconArrow, IconCheck, IconClose, IconMenu,
  IconChevron, IconCalendar, IconMail, IconPhone, IconDownload,
});
