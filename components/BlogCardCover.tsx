'use client'

// Generuje ładną ilustrację-cover dla karty blogowej
// bez zależności od plików graficznych

type CoverConfig = {
  bg: string
  accent: string
  icon: string
  label: string
}

const SLUG_MAP: Record<string, CoverConfig> = {
  'dlaczego-moj-pies-szczeka-na-inne-psy':       { bg: '#e8f0fb', accent: '#3b6bc9', icon: '🐕', label: 'Reaktywność' },
  'pies-wyje-kiedy-zostaje-sam':                 { bg: '#fef3e8', accent: '#c97a1a', icon: '🏠', label: 'Rozłąka' },
  'kot-zalatwia-sie-poza-kuweta':                { bg: '#f0f8f3', accent: '#2a8a56', icon: '🐱', label: 'Kuweta' },
  'jak-wyglada-konsultacja-behawioralna-online': { bg: '#f3f0fb', accent: '#6b42c9', icon: '💻', label: 'Konsultacja' },
  'pies-ciagnie-na-smyczy':                      { bg: '#e8f5fb', accent: '#1a7fc9', icon: '🦮', label: 'Smycz' },
  'pies-ciagnie-na-smyczy-od-czego-zaczac':      { bg: '#e8f5fb', accent: '#1a7fc9', icon: '🦮', label: 'Smycz' },
  'kot-drapie-meble':                            { bg: '#fef3f0', accent: '#c94a1a', icon: '🐾', label: 'Drapanie' },
  'nowy-pies-pierwsze-72-godziny':               { bg: '#fef8e8', accent: '#b8941a', icon: '🐶', label: 'Nowy pies' },
  'kiedy-behawiorysta-kiedy-trener-psa':         { bg: '#f3f0fb', accent: '#6b42c9', icon: '🎓', label: 'Porada' },
  'behawiorysta-zoopsycholog-trener-do-kogo-sie-zglosic': { bg: '#f0f8f3', accent: '#2a8a56', icon: '🔍', label: 'Specjalista' },
  'ile-kosztuje-konsultacja-behawioralna':       { bg: '#fef8e8', accent: '#b8941a', icon: '💰', label: 'Cennik' },
  'czym-jest-coape-behawiorysta-po-tej-szkole':  { bg: '#f3f0fb', accent: '#6b42c9', icon: '🏫', label: 'COAPE' },
  'jak-przygotowac-sie-do-konsultacji-behawioralnej-online': { bg: '#f0f4fb', accent: '#2a5ea8', icon: '📋', label: 'Przygotowanie' },
  'reaktywnosc-na-smyczy-cwiczenie-luznej-smyczy': { bg: '#e8f0fb', accent: '#3b6bc9', icon: '🦮', label: 'Ćwiczenie' },
  'jak-nagrac-psa-zostawionego-samemu':          { bg: '#fef3e8', accent: '#c97a1a', icon: '📹', label: 'Nagranie' },
  'rutyna-wyjscia-oswajanie-psa-z-samotnoscia':  { bg: '#fef3e8', accent: '#c97a1a', icon: '🚪', label: 'Rutyna' },
  'jak-wybrac-kuwete-i-zwirek-dla-kota':         { bg: '#f0f8f3', accent: '#2a8a56', icon: '🐱', label: 'Kuweta' },
  'stres-kota-a-zachowania-toaletowe':           { bg: '#fef0f0', accent: '#c93a2a', icon: '😿', label: 'Stres' },
  'jak-wprowadzic-nowego-kota-do-domu':          { bg: '#f0f8f3', accent: '#2a8a56', icon: '🐈', label: 'Nowy kot' },
  'agresja-przekierowana-u-kota':                { bg: '#fef0f0', accent: '#c93a2a', icon: '⚡', label: 'Agresja' },
  'jak-nauczyc-psa-zostawania-samemu':           { bg: '#fef3e8', accent: '#c97a1a', icon: '🏠', label: 'Samotność' },
  'jak-ustawic-kuwete-dla-kota':                 { bg: '#f0f8f3', accent: '#2a8a56', icon: '🗂️', label: 'Kuweta' },
  'jak-zapoznac-dwa-koty':                       { bg: '#f0f8f3', accent: '#2a8a56', icon: '🐈‍⬛', label: 'Dwa koty' },
}

const CATEGORY_DEFAULTS: Record<string, CoverConfig> = {
  '/psy':    { bg: '#e8f0fb', accent: '#3b6bc9', icon: '🐕', label: 'Pies' },
  '/koty':   { bg: '#f0f8f3', accent: '#2a8a56', icon: '🐱', label: 'Kot' },
  default:   { bg: '#f3f0fb', accent: '#6b42c9', icon: '📖', label: 'Blog' },
}

function getConfig(slug: string, categoryHref: string): CoverConfig {
  if (SLUG_MAP[slug]) return SLUG_MAP[slug]
  return CATEGORY_DEFAULTS[categoryHref] ?? CATEGORY_DEFAULTS.default
}

interface BlogCardCoverProps {
  slug: string
  categoryHref: string
  title: string
}

export function BlogCardCover({ slug, categoryHref, title }: BlogCardCoverProps) {
  const cfg = getConfig(slug, categoryHref)

  // Skróć tytuł do ok 40 znaków do wyświetlenia na ilustracji
  const shortTitle = title.length > 42 ? title.slice(0, 40).trimEnd() + '…' : title

  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        background: cfg.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dekoracyjne kółko w tle */}
      <div style={{
        position: 'absolute',
        top: '-30px',
        right: '-30px',
        width: '130px',
        height: '130px',
        borderRadius: '50%',
        background: cfg.accent,
        opacity: 0.1,
      }} />

      {/* Emoji ikona */}
      <div style={{
        fontSize: '38px',
        lineHeight: 1,
        marginBottom: '12px',
        position: 'relative',
      }}>
        {cfg.icon}
      </div>

      {/* Etykieta kategorii */}
      <div style={{
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: cfg.accent,
        marginBottom: '6px',
        background: 'rgba(255,255,255,0.7)',
        padding: '2px 8px',
        borderRadius: '99px',
        display: 'inline-block',
      }}>
        {cfg.label}
      </div>

      {/* Tytuł */}
      <div style={{
        fontSize: '13px',
        fontWeight: 600,
        color: '#1a1a1a',
        lineHeight: 1.35,
        maxWidth: '90%',
      }}>
        {shortTitle}
      </div>
    </div>
  )
}
