// Okładki kart bloga — zdjęcia z Unsplash dobrane tematycznie

type CoverConfig = {
  photo: string   // Unsplash photo ID
  label: string
  accent: string
}

// Unsplash photo IDs — każde dobrane do tematu wpisu
const CONFIGS: Record<string, CoverConfig> = {
  'dlaczego-moj-pies-szczeka-na-inne-psy':
    { photo: 'j4OCXGNJqFo', label: 'Reaktywność', accent: '#2d5fa0' },
  'pies-wyje-kiedy-zostaje-sam':
    { photo: 'tg_X_8HgJnQ', label: 'Rozłąka', accent: '#a06020' },
  'kot-zalatwia-sie-poza-kuweta':
    { photo: 'IuJc2qh2TcA', label: 'Kuweta', accent: '#1e7a45' },
  'jak-wyglada-konsultacja-behawioralna-online':
    { photo: 'oqStl2L5oxI', label: 'Konsultacja', accent: '#5a35b0' },
  'pies-ciagnie-na-smyczy':
    { photo: 'YCPkW_r_6uA', label: 'Smycz', accent: '#1a6fa0' },
  'pies-ciagnie-na-smyczy-od-czego-zaczac':
    { photo: 'YCPkW_r_6uA', label: 'Smycz', accent: '#1a6fa0' },
  'reaktywnosc-na-smyczy-cwiczenie-luznej-smyczy':
    { photo: 'n1B6ftPB5Eg', label: 'Ćwiczenie', accent: '#1a6fa0' },
  'kot-drapie-meble':
    { photo: '75715CVEJsI', label: 'Drapanie', accent: '#a03020' },
  'nowy-pies-pierwsze-72-godziny':
    { photo: 'MStLtFqpyv4', label: 'Nowy pies', accent: '#8a6010' },
  'jak-nauczyc-psa-zostawania-samemu':
    { photo: 'tg_X_8HgJnQ', label: 'Samotność', accent: '#a06020' },
  'rutyna-wyjscia-oswajanie-psa-z-samotnoscia':
    { photo: 'tg_X_8HgJnQ', label: 'Rutyna', accent: '#a06020' },
  'jak-nagrac-psa-zostawionego-samemu':
    { photo: 'tg_X_8HgJnQ', label: 'Nagranie', accent: '#a06020' },
  'kiedy-behawiorysta-kiedy-trener-psa':
    { photo: 'oqStl2L5oxI', label: 'Porada', accent: '#5a35b0' },
  'behawiorysta-zoopsycholog-trener-do-kogo-sie-zglosic':
    { photo: 'oqStl2L5oxI', label: 'Specjalista', accent: '#5a35b0' },
  'czym-jest-coape-behawiorysta-po-tej-szkole':
    { photo: 'oqStl2L5oxI', label: 'COAPE', accent: '#5a35b0' },
  'jak-przygotowac-sie-do-konsultacji-behawioralnej-online':
    { photo: 'oqStl2L5oxI', label: 'Przygotowanie', accent: '#2a5ea8' },
  'ile-kosztuje-konsultacja-behawioralna':
    { photo: 'oqStl2L5oxI', label: 'Cennik', accent: '#8a6010' },
  'jak-wybrac-kuwete-i-zwirek-dla-kota':
    { photo: 'IuJc2qh2TcA', label: 'Kuweta', accent: '#1e7a45' },
  'jak-ustawic-kuwete-dla-kota':
    { photo: 'IuJc2qh2TcA', label: 'Kuweta', accent: '#1e7a45' },
  'stres-kota-a-zachowania-toaletowe':
    { photo: 'IuJc2qh2TcA', label: 'Stres', accent: '#a03020' },
  'jak-wprowadzic-nowego-kota-do-domu':
    { photo: 'Nv4QHkTVEaI', label: 'Nowy kot', accent: '#1e7a45' },
  'agresja-przekierowana-u-kota':
    { photo: '75715CVEJsI', label: 'Agresja', accent: '#a03020' },
  'jak-zapoznac-dwa-koty':
    { photo: 'Nv4QHkTVEaI', label: 'Dwa koty', accent: '#1e7a45' },
}

const CATEGORY_DEFAULTS: Record<string, CoverConfig> = {
  '/psy':  { photo: 'j4OCXGNJqFo', label: 'Pies', accent: '#2d5fa0' },
  '/koty': { photo: 'IuJc2qh2TcA', label: 'Kot',  accent: '#1e7a45' },
  default: { photo: 'oqStl2L5oxI', label: 'Blog', accent: '#5a35b0' },
}

interface BlogCardCoverProps {
  slug: string
  categoryHref: string
  title: string
}

export function BlogCardCover({ slug, categoryHref, title }: BlogCardCoverProps) {
  const cfg = CONFIGS[slug] ?? CATEGORY_DEFAULTS[categoryHref] ?? CATEGORY_DEFAULTS.default
  const src = `https://images.unsplash.com/photo-${cfg.photo}?w=640&h=400&fit=crop&auto=format&q=80`
  const shortLabel = title.length > 46 ? title.slice(0, 44).trimEnd() + '…' : title

  return (
    <div aria-hidden="true" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Zdjęcie jako tło */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        loading="lazy"
      />

      {/* Gradient overlay od dołu */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)',
      }} />

      {/* Etykieta kategorii */}
      <div style={{
        position: 'absolute', top: '12px', left: '12px',
        fontSize: '10px', fontWeight: 800,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: '#fff',
        background: cfg.accent,
        padding: '3px 10px', borderRadius: '99px',
      }}>
        {cfg.label}
      </div>

      {/* Tytuł na dole */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 14px',
        fontSize: '13px', fontWeight: 600,
        color: '#fff', lineHeight: 1.35,
        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
      }}>
        {shortLabel}
      </div>
    </div>
  )
}
