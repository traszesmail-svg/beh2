'use client'

type CoverConfig = {
  bg: string
  accent: string
  svg: React.ReactNode
  label: string
}

// SVG ilustracje jako inline React
const DOG_BARKING = (color: string) => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    {/* Sylwetka psa */}
    <ellipse cx="55" cy="68" rx="28" ry="18" fill={color} opacity="0.15"/>
    <ellipse cx="55" cy="62" rx="22" ry="15" fill={color} opacity="0.25"/>
    {/* Tułów */}
    <rect x="32" y="55" width="40" height="22" rx="10" fill={color} opacity="0.9"/>
    {/* Głowa */}
    <circle cx="74" cy="50" r="14" fill={color} opacity="0.9"/>
    {/* Ucho */}
    <ellipse cx="68" cy="40" rx="5" ry="8" fill={color} opacity="0.7" transform="rotate(-15 68 40)"/>
    <ellipse cx="81" cy="39" rx="4" ry="7" fill={color} opacity="0.7" transform="rotate(10 81 39)"/>
    {/* Oko */}
    <circle cx="76" cy="48" r="2.5" fill="white"/>
    <circle cx="76" cy="48" r="1.2" fill="#1a1a1a"/>
    {/* Nos */}
    <ellipse cx="84" cy="52" rx="3" ry="2" fill="#1a1a1a" opacity="0.8"/>
    {/* Nogi */}
    <rect x="36" y="72" width="8" height="16" rx="4" fill={color} opacity="0.85"/>
    <rect x="48" y="72" width="8" height="16" rx="4" fill={color} opacity="0.85"/>
    <rect x="58" y="72" width="8" height="16" rx="4" fill={color} opacity="0.85"/>
    <rect x="66" y="72" width="8" height="16" rx="4" fill={color} opacity="0.85"/>
    {/* Ogon */}
    <path d="M32 60 Q18 45 22 35" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.8"/>
    {/* Fale dźwięku */}
    <path d="M88 44 Q95 48 88 52" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M91 40 Q101 48 91 56" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
  </svg>
)

const DOG_WINDOW = (color: string) => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    {/* Okno */}
    <rect x="15" y="20" width="55" height="60" rx="4" fill="white"  stroke={color} strokeWidth="2" opacity="0.3"/>
    <line x1="42" y1="20" x2="42" y2="80" stroke={color} strokeWidth="1.5" opacity="0.3"/>
    <line x1="15" y1="50" x2="70" y2="50" stroke={color} strokeWidth="1.5" opacity="0.3"/>
    {/* Pies przy oknie - głowa */}
    <circle cx="43" cy="72" r="14" fill={color} opacity="0.85"/>
    <ellipse cx="36" cy="62" rx="4" ry="7" fill={color} opacity="0.7"/>
    <ellipse cx="50" cy="62" rx="4" ry="7" fill={color} opacity="0.7"/>
    <circle cx="40" cy="71" r="2" fill="white"/>
    <circle cx="40" cy="71" r="1" fill="#333"/>
    <circle cx="47" cy="71" r="2" fill="white"/>
    <circle cx="47" cy="71" r="1" fill="#333"/>
    <ellipse cx="43" cy="77" rx="3.5" ry="2.5" fill="#1a1a1a" opacity="0.7"/>
    {/* Łapy na parapecie */}
    <rect x="28" y="80" width="12" height="8" rx="4" fill={color} opacity="0.8"/>
    <rect x="46" y="80" width="12" height="8" rx="4" fill={color} opacity="0.8"/>
    {/* Znaki zapytania / smutek */}
    <text x="78" y="45" fontSize="18" fill={color} opacity="0.4">?</text>
    <text x="85" y="65" fontSize="14" fill={color} opacity="0.3">?</text>
  </svg>
)

const CAT_LITTER = (color: string) => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    {/* Kuweta */}
    <rect x="20" y="65" width="70" height="25" rx="6" fill={color}  stroke={color} strokeWidth="2" opacity="0.4"/>
    <rect x="25" y="68" width="60" height="18" rx="4" fill={color} opacity="0.1"/>
    {/* Kot - sylwetka */}
    <ellipse cx="60" cy="55" rx="20" ry="15" fill={color} opacity="0.85"/>
    {/* Głowa */}
    <circle cx="60" cy="38" r="13" fill={color} opacity="0.9"/>
    {/* Uszy */}
    <polygon points="50,30 46,18 55,28" fill={color} opacity="0.9"/>
    <polygon points="70,30 74,18 65,28" fill={color} opacity="0.9"/>
    {/* Twarz */}
    <circle cx="56" cy="36" r="2" fill="white"/>
    <circle cx="56" cy="36" r="1" fill="#1a1a1a"/>
    <circle cx="64" cy="36" r="2" fill="white"/>
    <circle cx="64" cy="36" r="1" fill="#1a1a1a"/>
    <path d="M57 41 Q60 43 63 41" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    {/* Wąsy */}
    <line x1="47" y1="40" x2="57" y2="41" stroke={color} strokeWidth="1" opacity="0.5"/>
    <line x1="63" y1="41" x2="73" y2="40" stroke={color} strokeWidth="1" opacity="0.5"/>
    {/* Ogon */}
    <path d="M80 58 Q95 50 90 38" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.7"/>
    {/* Nogi */}
    <rect x="44" y="65" width="9" height="12" rx="4" fill={color} opacity="0.8"/>
    <rect x="67" y="65" width="9" height="12" rx="4" fill={color} opacity="0.8"/>
  </svg>
)

const LAPTOP_CONSULT = (color: string) => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    {/* Laptop - podstawa */}
    <rect x="10" y="75" width="100" height="8" rx="4" fill={color} opacity="0.3"/>
    {/* Laptop - ekran */}
    <rect x="20" y="30" width="80" height="48" rx="6" fill={color}  stroke={color} strokeWidth="2" opacity="0.5"/>
    <rect x="24" y="34" width="72" height="40" rx="4" fill="white" opacity="0.7"/>
    {/* Na ekranie: twarz kota/psa */}
    <circle cx="60" cy="52" r="14" fill={color} opacity="0.3"/>
    <circle cx="60" cy="52" r="10" fill={color} opacity="0.4"/>
    {/* Twarz */}
    <circle cx="56" cy="50" r="2" fill="white" opacity="0.9"/>
    <circle cx="64" cy="50" r="2" fill="white" opacity="0.9"/>
    <circle cx="56" cy="50" r="1" fill="#333"/>
    <circle cx="64" cy="50" r="1" fill="#333"/>
    <path d="M57 55 Q60 57 63 55" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Uszy */}
    <polygon points="52,43 49,36 56,42" fill={color} opacity="0.5"/>
    <polygon points="68,43 71,36 64,42" fill={color} opacity="0.5"/>
    {/* Sygnał wifi */}
    <path d="M85 38 Q90 35 95 38" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    <path d="M87 42 Q90 40 93 42" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    <circle cx="90" cy="45" r="1.5" fill={color} opacity="0.8"/>
  </svg>
)

const DOG_LEASH = (color: string) => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    {/* Smycz - linia */}
    <path d="M20 30 Q50 20 80 60" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
    {/* Ręka trzymająca smycz */}
    <ellipse cx="20" cy="30" rx="10" ry="7" fill={color} opacity="0.4"/>
    {/* Pies ciągnący */}
    <ellipse cx="85" cy="65" rx="22" ry="14" fill={color} opacity="0.85"/>
    <circle cx="100" cy="55" r="12" fill={color} opacity="0.9"/>
    <ellipse cx="94" cy="46" rx="4" ry="6" fill={color} opacity="0.8"/>
    <ellipse cx="106" cy="46" rx="4" ry="6" fill={color} opacity="0.8"/>
    <circle cx="97" cy="54" r="2" fill="white"/>
    <circle cx="97" cy="54" r="1" fill="#1a1a1a"/>
    <circle cx="103" cy="54" r="2" fill="white"/>
    <circle cx="103" cy="54" r="1" fill="#1a1a1a"/>
    <ellipse cx="104" cy="59" rx="3" ry="2" fill="#1a1a1a" opacity="0.7"/>
    <rect x="70" y="73" width="8" height="14" rx="4" fill={color} opacity="0.8"/>
    <rect x="82" y="73" width="8" height="14" rx="4" fill={color} opacity="0.8"/>
    <rect x="92" y="73" width="8" height="14" rx="4" fill={color} opacity="0.8"/>
    <path d="M63 68 Q52 58 55 48" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.7"/>
    {/* Strzałka kierunku */}
    <path d="M100 75 L110 85 L95 88" fill={color} opacity="0.3"/>
  </svg>
)

const CAT_SCRATCH = (color: string) => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    {/* Mebel - sofa/kanapa */}
    <rect x="10" y="55" width="80" height="35" rx="8" fill={color}  stroke={color} strokeWidth="2" opacity="0.3"/>
    <rect x="10" y="50" width="80" height="18" rx="6" fill={color} opacity="0.2"/>
    <rect x="8" y="48" width="18" height="42" rx="6" fill={color} opacity="0.25"/>
    <rect x="74" y="48" width="18" height="42" rx="6" fill={color} opacity="0.25"/>
    {/* Rysy na meblu */}
    <line x1="35" y1="52" x2="40" y2="68" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    <line x1="42" y1="50" x2="47" y2="66" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    <line x1="49" y1="51" x2="54" y2="67" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    {/* Kot drapiący - sylwetka */}
    <ellipse cx="90" cy="55" rx="16" ry="12" fill={color} opacity="0.85"/>
    <circle cx="90" cy="40" r="11" fill={color} opacity="0.9"/>
    <polygon points="83,33 80,23 87,32" fill={color} opacity="0.9"/>
    <polygon points="97,33 100,23 93,32" fill={color} opacity="0.9"/>
    <circle cx="87" cy="39" r="1.8" fill="white"/>
    <circle cx="93" cy="39" r="1.8" fill="white"/>
    <circle cx="87" cy="39" r="0.9" fill="#1a1a1a"/>
    <circle cx="93" cy="39" r="0.9" fill="#1a1a1a"/>
    {/* Łapa drapiąca */}
    <ellipse cx="76" cy="58" rx="6" ry="5" fill={color} opacity="0.8"/>
    <line x1="72" y1="61" x2="69" y2="65" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
    <line x1="76" y1="63" x2="74" y2="67" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
    <line x1="80" y1="62" x2="79" y2="66" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
  </svg>
)

const SPECIALIST = (color: string) => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    {/* Człowiek - specjalista */}
    <circle cx="60" cy="28" r="16" fill={color} opacity="0.3"/>
    <circle cx="60" cy="28" r="12" fill={color} opacity="0.5"/>
    {/* Twarz */}
    <circle cx="56" cy="26" r="2" fill="white" opacity="0.9"/>
    <circle cx="64" cy="26" r="2" fill="white" opacity="0.9"/>
    <path d="M56 32 Q60 35 64 32" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Tułów */}
    <path d="M35 85 Q35 60 60 58 Q85 60 85 85" fill={color} opacity="0.25"/>
    <path d="M40 85 Q40 63 60 61 Q80 63 80 85" fill={color} opacity="0.3"/>
    {/* Stetoskop / certyfikat */}
    <circle cx="90" cy="40" r="12" fill={color}  stroke={color} strokeWidth="1.5" opacity="0.5"/>
    <text x="84" y="45" fontSize="14" fill={color} opacity="0.7">✓</text>
    {/* Pies i kot obok */}
    <circle cx="22" cy="68" r="10" fill={color} opacity="0.35"/>
    <polygon points="17,61 15,53 21,60" fill={color} opacity="0.35"/>
    <polygon points="27,61 29,53 23,60" fill={color} opacity="0.35"/>
    <circle cx="98" cy="65" r="9" fill={color} opacity="0.35"/>
    <ellipse cx="92" cy="56" rx="4" ry="6" fill={color} opacity="0.3"/>
  </svg>
)

const MONEY = (color: string) => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    {/* Banknot */}
    <rect x="15" y="35" width="90" height="50" rx="8" fill={color}  stroke={color} strokeWidth="2" opacity="0.4"/>
    <rect x="20" y="40" width="80" height="40" rx="5" fill={color} opacity="0.1"/>
    {/* Znak PLN */}
    <text x="44" y="68" fontSize="28" fontWeight="bold" fill={color} opacity="0.5">zł</text>
    {/* Ozdobne kółka banknotu */}
    <circle cx="28" cy="60" r="10" fill={color}  stroke={color} strokeWidth="1.5" opacity="0.3"/>
    <circle cx="92" cy="60" r="10" fill={color}  stroke={color} strokeWidth="1.5" opacity="0.3"/>
    {/* Pies/kot mały */}
    <circle cx="60" cy="20" r="10" fill={color} opacity="0.4"/>
    <polygon points="54,13 52,6 58,12" fill={color} opacity="0.4"/>
    <polygon points="66,13 68,6 62,12" fill={color} opacity="0.4"/>
  </svg>
)

const NEW_DOG = (color: string) => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    {/* Dom */}
    <polygon points="60,15 15,45 105,45" fill={color} opacity="0.2"/>
    <rect x="20" y="45" width="80" height="45" rx="3" fill={color}  stroke={color} strokeWidth="1.5" opacity="0.3"/>
    {/* Drzwi */}
    <rect x="48" y="65" width="24" height="25" rx="3" fill={color} opacity="0.25"/>
    {/* Szczeniak */}
    <ellipse cx="60" cy="72" rx="16" ry="12" fill={color} opacity="0.8"/>
    <circle cx="60" cy="60" r="11" fill={color} opacity="0.85"/>
    <ellipse cx="54" cy="52" rx="4" ry="6" fill={color} opacity="0.75" transform="rotate(-10 54 52)"/>
    <ellipse cx="66" cy="52" rx="4" ry="6" fill={color} opacity="0.75" transform="rotate(10 66 52)"/>
    <circle cx="57" cy="59" r="1.8" fill="white"/>
    <circle cx="63" cy="59" r="1.8" fill="white"/>
    <circle cx="57" cy="59" r="0.9" fill="#1a1a1a"/>
    <circle cx="63" cy="59" r="0.9" fill="#1a1a1a"/>
    <ellipse cx="60" cy="64" rx="3" ry="2.5" fill="#1a1a1a" opacity="0.7"/>
    {/* Serce */}
    <path d="M85 25 C85 22 88 20 90 23 C92 20 95 22 95 25 C95 28 90 33 90 33 C90 33 85 28 85 25Z" fill={color} opacity="0.5"/>
  </svg>
)

const CLIPBOARD = (color: string) => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    {/* Notatnik/schowek */}
    <rect x="25" y="20" width="70" height="70" rx="8" fill={color}  stroke={color} strokeWidth="2" opacity="0.4"/>
    <rect x="45" y="14" width="30" height="14" rx="5" fill={color} opacity="0.3"/>
    {/* Linie tekstu */}
    <line x1="35" y1="42" x2="85" y2="42" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
    <line x1="35" y1="52" x2="75" y2="52" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
    <line x1="35" y1="62" x2="80" y2="62" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.3"/>
    <line x1="35" y1="72" x2="65" y2="72" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.25"/>
    {/* Checkmark */}
    <circle cx="84" cy="72" r="10" fill={color} opacity="0.25"/>
    <path d="M79 72 L83 76 L89 67" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
  </svg>
)

const TWO_CATS = (color: string) => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    {/* Kot 1 */}
    <ellipse cx="38" cy="65" rx="18" ry="13" fill={color} opacity="0.8"/>
    <circle cx="38" cy="50" r="12" fill={color} opacity="0.85"/>
    <polygon points="30,42 27,32 35,41" fill={color} opacity="0.8"/>
    <polygon points="46,42 49,32 41,41" fill={color} opacity="0.8"/>
    <circle cx="35" cy="49" r="1.8" fill="white"/>
    <circle cx="41" cy="49" r="1.8" fill="white"/>
    <circle cx="35" cy="49" r="0.9" fill="#1a1a1a"/>
    <circle cx="41" cy="49" r="0.9" fill="#1a1a1a"/>
    <path d="M56 65 Q65 55 56 50" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.6"/>
    {/* Kot 2 */}
    <ellipse cx="82" cy="65" rx="18" ry="13" fill={color} opacity="0.5"/>
    <circle cx="82" cy="50" r="12" fill={color} opacity="0.55"/>
    <polygon points="74,42 71,32 79,41" fill={color} opacity="0.5"/>
    <polygon points="90,42 93,32 85,41" fill={color} opacity="0.5"/>
    <circle cx="79" cy="49" r="1.8" fill="white" opacity="0.8"/>
    <circle cx="85" cy="49" r="1.8" fill="white" opacity="0.8"/>
    <circle cx="79" cy="49" r="0.9" fill="#1a1a1a"/>
    <circle cx="85" cy="49" r="0.9" fill="#1a1a1a"/>
    <path d="M64 65 Q55 55 64 50" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.4"/>
    {/* Strzałka między nimi */}
    <path d="M57 60 L63 60" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M61 57 L64 60 L61 63" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
  </svg>
)

const CONFIGS: Record<string, CoverConfig> = {
  'dlaczego-moj-pies-szczeka-na-inne-psy':        { bg: '#e8f0fb', accent: '#3b6bc9', svg: DOG_BARKING('#3b6bc9'), label: 'Reaktywność' },
  'pies-wyje-kiedy-zostaje-sam':                  { bg: '#fef3e8', accent: '#c97a1a', svg: DOG_WINDOW('#c97a1a'), label: 'Rozłąka' },
  'kot-zalatwia-sie-poza-kuweta':                 { bg: '#f0f8f3', accent: '#2a7a4f', svg: CAT_LITTER('#2a7a4f'), label: 'Kuweta' },
  'jak-wyglada-konsultacja-behawioralna-online':  { bg: '#f3f0fb', accent: '#6b42c9', svg: LAPTOP_CONSULT('#6b42c9'), label: 'Konsultacja' },
  'pies-ciagnie-na-smyczy':                       { bg: '#e8f5fb', accent: '#1a7fc9', svg: DOG_LEASH('#1a7fc9'), label: 'Smycz' },
  'pies-ciagnie-na-smyczy-od-czego-zaczac':       { bg: '#e8f5fb', accent: '#1a7fc9', svg: DOG_LEASH('#1a7fc9'), label: 'Smycz' },
  'reaktywnosc-na-smyczy-cwiczenie-luznej-smyczy':{ bg: '#e8f5fb', accent: '#1a7fc9', svg: DOG_LEASH('#1a7fc9'), label: 'Ćwiczenie' },
  'kot-drapie-meble':                             { bg: '#fef3f0', accent: '#c94a1a', svg: CAT_SCRATCH('#c94a1a'), label: 'Drapanie' },
  'nowy-pies-pierwsze-72-godziny':                { bg: '#fef8e8', accent: '#b8941a', svg: NEW_DOG('#b8941a'), label: 'Nowy pies' },
  'jak-nauczyc-psa-zostawania-samemu':            { bg: '#fef3e8', accent: '#c97a1a', svg: DOG_WINDOW('#c97a1a'), label: 'Samotność' },
  'rutyna-wyjscia-oswajanie-psa-z-samotnoscia':   { bg: '#fef3e8', accent: '#c97a1a', svg: DOG_WINDOW('#c97a1a'), label: 'Rutyna' },
  'jak-nagrac-psa-zostawionego-samemu':           { bg: '#fef3e8', accent: '#c97a1a', svg: DOG_WINDOW('#c97a1a'), label: 'Nagranie' },
  'kiedy-behawiorysta-kiedy-trener-psa':          { bg: '#f3f0fb', accent: '#6b42c9', svg: SPECIALIST('#6b42c9'), label: 'Porada' },
  'behawiorysta-zoopsycholog-trener-do-kogo-sie-zglosic': { bg: '#f3f0fb', accent: '#6b42c9', svg: SPECIALIST('#6b42c9'), label: 'Specjalista' },
  'czym-jest-coape-behawiorysta-po-tej-szkole':   { bg: '#f3f0fb', accent: '#6b42c9', svg: SPECIALIST('#6b42c9'), label: 'COAPE' },
  'jak-przygotowac-sie-do-konsultacji-behawioralnej-online': { bg: '#f0f4fb', accent: '#2a5ea8', svg: CLIPBOARD('#2a5ea8'), label: 'Przygotowanie' },
  'ile-kosztuje-konsultacja-behawioralna':        { bg: '#fef8e8', accent: '#b8941a', svg: MONEY('#b8941a'), label: 'Cennik' },
  'jak-wybrac-kuwete-i-zwirek-dla-kota':          { bg: '#f0f8f3', accent: '#2a7a4f', svg: CAT_LITTER('#2a7a4f'), label: 'Kuweta' },
  'jak-ustawic-kuwete-dla-kota':                  { bg: '#f0f8f3', accent: '#2a7a4f', svg: CAT_LITTER('#2a7a4f'), label: 'Kuweta' },
  'stres-kota-a-zachowania-toaletowe':            { bg: '#fef0f0', accent: '#c93a2a', svg: CAT_LITTER('#c93a2a'), label: 'Stres' },
  'jak-wprowadzic-nowego-kota-do-domu':           { bg: '#f0f8f3', accent: '#2a7a4f', svg: NEW_DOG('#2a7a4f'), label: 'Nowy kot' },
  'agresja-przekierowana-u-kota':                 { bg: '#fef0f0', accent: '#c93a2a', svg: CAT_SCRATCH('#c93a2a'), label: 'Agresja' },
  'jak-zapoznac-dwa-koty':                        { bg: '#f0f8f3', accent: '#2a7a4f', svg: TWO_CATS('#2a7a4f'), label: 'Dwa koty' },
}

const CATEGORY_DEFAULTS: Record<string, CoverConfig> = {
  '/psy':    { bg: '#e8f0fb', accent: '#3b6bc9', svg: DOG_BARKING('#3b6bc9'), label: 'Pies' },
  '/koty':   { bg: '#f0f8f3', accent: '#2a7a4f', svg: CAT_LITTER('#2a7a4f'), label: 'Kot' },
  default:   { bg: '#f3f0fb', accent: '#6b42c9', svg: CLIPBOARD('#6b42c9'), label: 'Blog' },
}

interface BlogCardCoverProps {
  slug: string
  categoryHref: string
  title: string
}

export function BlogCardCover({ slug, categoryHref, title }: BlogCardCoverProps) {
  const cfg = CONFIGS[slug] ?? CATEGORY_DEFAULTS[categoryHref] ?? CATEGORY_DEFAULTS.default
  const shortTitle = title.length > 44 ? title.slice(0, 42).trimEnd() + '…' : title

  return (
    <div aria-hidden="true" style={{
      width: '100%', height: '100%',
      background: cfg.bg,
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* SVG ilustracja – górne 65% */}
      <div style={{ flex: '0 0 65%', padding: '12px 12px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '140px', height: '90px' }}>
          {cfg.svg}
        </div>
      </div>

      {/* Dolny pasek z kategorią i tytułem */}
      <div style={{
        flex: 1,
        padding: '8px 14px 12px',
        borderTop: `1px solid ${cfg.accent}22`,
        background: `${cfg.bg}ee`,
      }}>
        <div style={{
          fontSize: '9px', fontWeight: 800,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: cfg.accent, marginBottom: '4px',
        }}>
          {cfg.label}
        </div>
        <div style={{
          fontSize: '12px', fontWeight: 600,
          color: '#1a1a1a', lineHeight: 1.3,
        }}>
          {shortTitle}
        </div>
      </div>
    </div>
  )
}
