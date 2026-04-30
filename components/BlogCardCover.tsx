import Image from 'next/image'

type CoverConfig = {
  photo: string
  label: string
  accent: string
}

const CONFIGS: Record<string, CoverConfig> = {
  'dlaczego-moj-pies-szczeka-na-inne-psy':
    { photo: 'dog-reactive', label: 'Reaktywność', accent: '#2d5fa0' },
  'pies-wyje-kiedy-zostaje-sam':
    { photo: 'dog-alone', label: 'Rozłąka', accent: '#a06020' },
  'kot-zalatwia-sie-poza-kuweta':
    { photo: 'cat-home', label: 'Kuweta', accent: '#1e7a45' },
  'jak-wyglada-konsultacja-behawioralna-online':
    { photo: 'consultation', label: 'Konsultacja', accent: '#5a35b0' },
  'pies-ciagnie-na-smyczy':
    { photo: 'dog-leash', label: 'Smycz', accent: '#1a6fa0' },
  'pies-ciagnie-na-smyczy-od-czego-zaczac':
    { photo: 'dog-leash', label: 'Smycz', accent: '#1a6fa0' },
  'reaktywnosc-na-smyczy-cwiczenie-luznej-smyczy':
    { photo: 'dog-leash', label: 'Ćwiczenie', accent: '#1a6fa0' },
  'kot-drapie-meble':
    { photo: 'cat-scratch', label: 'Drapanie', accent: '#a03020' },
  'nowy-pies-pierwsze-72-godziny':
    { photo: 'new-dog', label: 'Nowy pies', accent: '#8a6010' },
  'jak-nauczyc-psa-zostawania-samemu':
    { photo: 'dog-alone', label: 'Samotność', accent: '#a06020' },
  'rutyna-wyjscia-oswajanie-psa-z-samotnoscia':
    { photo: 'dog-alone', label: 'Rutyna', accent: '#a06020' },
  'jak-nagrac-psa-zostawionego-samemu':
    { photo: 'dog-alone', label: 'Nagranie', accent: '#a06020' },
  'kiedy-behawiorysta-kiedy-trener-psa':
    { photo: 'specialist', label: 'Porada', accent: '#5a35b0' },
  'behawiorysta-zoopsycholog-trener-do-kogo-sie-zglosic':
    { photo: 'specialist', label: 'Specjalista', accent: '#5a35b0' },
  'czym-jest-coape-behawiorysta-po-tej-szkole':
    { photo: 'specialist', label: 'COAPE', accent: '#5a35b0' },
  'jak-przygotowac-sie-do-konsultacji-behawioralnej-online':
    { photo: 'consultation', label: 'Przygotowanie', accent: '#2a5ea8' },
  'ile-kosztuje-konsultacja-behawioralna':
    { photo: 'money', label: 'Cennik', accent: '#8a6010' },
  'jak-wybrac-kuwete-i-zwirek-dla-kota':
    { photo: 'cat-home', label: 'Kuweta', accent: '#1e7a45' },
  'jak-ustawic-kuwete-dla-kota':
    { photo: 'cat-home', label: 'Kuweta', accent: '#1e7a45' },
  'stres-kota-a-zachowania-toaletowe':
    { photo: 'cat-general', label: 'Stres', accent: '#a03020' },
  'jak-wprowadzic-nowego-kota-do-domu':
    { photo: 'two-cats', label: 'Nowy kot', accent: '#1e7a45' },
  'agresja-przekierowana-u-kota':
    { photo: 'cat-scratch', label: 'Agresja', accent: '#a03020' },
  'jak-zapoznac-dwa-koty':
    { photo: 'two-cats', label: 'Dwa koty', accent: '#1e7a45' },
}

const CATEGORY_DEFAULTS: Record<string, CoverConfig> = {
  '/psy':  { photo: 'dog-reactive', label: 'Pies', accent: '#2d5fa0' },
  '/koty': { photo: 'cat-general',  label: 'Kot',  accent: '#1e7a45' },
  default: { photo: 'consultation', label: 'Blog', accent: '#5a35b0' },
}

interface BlogCardCoverProps {
  slug: string
  categoryHref: string
  title: string
}

export function BlogCardCover({ slug, categoryHref, title }: BlogCardCoverProps) {
  const cfg = CONFIGS[slug] ?? CATEGORY_DEFAULTS[categoryHref] ?? CATEGORY_DEFAULTS.default
  const src = `/blog-covers/${cfg.photo}.jpg`

  return (
    <div aria-hidden="true" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 760px) 92vw, 30vw"
        style={{ objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', top: '12px', left: '12px',
        fontSize: '10px', fontWeight: 800,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: '#fff', background: cfg.accent,
        padding: '3px 10px', borderRadius: '99px',
      }}>
        {cfg.label}
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 14px',
        fontSize: '12px', fontWeight: 600,
        color: '#fff', lineHeight: 1.35,
        textShadow: '0 1px 3px rgba(0,0,0,0.6)',
      }}>
        {title.length > 46 ? title.slice(0, 44).trimEnd() + '…' : title}
      </div>
    </div>
  )
}
