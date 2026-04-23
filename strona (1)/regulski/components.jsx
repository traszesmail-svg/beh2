/*
 * REGULSKI — Shared Components
 * ─────────────────────────────────────────────────────
 * HANDOFF: Extract each component into its own file
 * under app/components/ in your Next.js project.
 *
 * Components here:
 *   useTheme       — hook: system + manual dark/light
 *   Btn            — primary / ghost / outline button
 *   Label          — small eyebrow label
 *   SectionHeader  — numbered section title
 *   ServiceCard    — Kwadrans / konsultacja card
 *   TestiCard      — testimonial quote
 *   ProblemCard    — icon + problem name card
 *   Footer         — site footer
 *   NavBar         — sticky nav with dark/light toggle
 * ─────────────────────────────────────────────────────
 */

/* ── useTheme hook ─────────────────────────────────── */
/*
 * HANDOFF: In Next.js, wrap this in a ThemeProvider
 * context and place it in app/layout.tsx.
 * Use next-themes for a production-ready solution.
 */
const useTheme = () => {
  const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const [theme, setThemeState] = React.useState(() => {
    try {
      return localStorage.getItem('regulski-theme') || 'system';
    } catch { return 'system'; }
  });

  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    try { localStorage.setItem('regulski-theme', theme); } catch {}
  }, [theme, resolvedTheme]);

  /* Listen for OS changes */
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') {
        document.documentElement.setAttribute('data-theme', getSystemTheme());
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const toggleTheme = () =>
    setThemeState(t => t === 'dark' ? 'light' : t === 'light' ? 'system' : 'dark');

  return { theme, resolvedTheme, setTheme: setThemeState, toggleTheme };
};

/* ── Btn ───────────────────────────────────────────── */
const Btn = ({ children, variant = 'primary', onClick, href, style: extStyle, small }) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    fontSize: small ? 12 : 13, fontWeight: 500, letterSpacing: '0.01em',
    padding: small ? '9px 18px' : '13px 26px',
    borderRadius: 2, cursor: 'pointer', textDecoration: 'none',
    border: 'none', fontFamily: 'var(--sans)',
    transition: 'opacity 0.15s ease, transform 0.15s ease',
    userSelect: 'none', whiteSpace: 'nowrap',
  };
  const variants = {
    primary:  { background: 'var(--amber)', color: '#fff' },
    outline:  { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--line)' },
    ghost:    { background: 'transparent', color: 'var(--ink-mid)', padding: small ? '9px 4px' : '13px 4px' },
    amber:    { background: 'transparent', color: 'var(--amber)', border: '1px solid var(--amber)' },
  };
  const s = { ...base, ...variants[variant], ...extStyle };
  return <button style={s} onClick={onClick}>{children}</button>;
};

/* ── Label ─────────────────────────────────────────── */
const Label = ({ children, accent }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
  }}>
    <div style={{ width: 20, height: 1, background: accent ? 'var(--amber)' : 'var(--ink-light)', flexShrink: 0 }} />
    <span style={{
      fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
      color: accent ? 'var(--amber)' : 'var(--ink-light)', fontFamily: 'var(--sans)',
    }}>{children}</span>
  </div>
);

/* ── SectionHeader ─────────────────────────────────── */
const SectionHeader = ({ roman, children, sub, center }) => (
  <div style={{ marginBottom: 56, textAlign: center ? 'center' : undefined }}>
    {roman && (
      <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 16 }}>
        {roman}
      </div>
    )}
    <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px,3vw,48px)', fontWeight: 300, lineHeight: 1.2, color: 'var(--ink)', maxWidth: center ? undefined : 600 }}>
      {children}
    </h2>
    {sub && <p style={{ marginTop: 16, fontSize: 15, color: 'var(--ink-mid)', lineHeight: 1.75, maxWidth: center ? 560 : 480, marginLeft: center ? 'auto' : undefined, marginRight: center ? 'auto' : undefined }}>{sub}</p>}
  </div>
);

/* ── ServiceCard ───────────────────────────────────── */
const ServiceCard = ({ tag, price, time, title, desc, items, cta, dark, onBook }) => (
  <div style={{
    background: dark ? 'var(--ink)' : 'var(--amber)',
    padding: '48px 44px', position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>{tag}</div>
    <div style={{ fontFamily: 'var(--serif)', fontSize: 56, fontWeight: 300, color: '#faf8f4', lineHeight: 1, marginBottom: 4 }}>{price}</div>
    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 28, letterSpacing: '0.06em' }}>{time}</div>
    <h3 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 300, color: '#faf8f4', lineHeight: 1.3, marginBottom: 14 }}>{title}</h3>
    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: 28 }}>{desc}</p>
    <ul style={{ listStyle: 'none', marginBottom: 36 }}>
      {items.map(it => (
        <li key={it} style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 10, alignItems: 'center' }}>
          <window.IconCheck style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} /> {it}
        </li>
      ))}
    </ul>
    <Btn variant="outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#faf8f4' }} onClick={onBook}>
      {cta} <window.IconArrow />
    </Btn>
  </div>
);

/* ── TestiCard ─────────────────────────────────────── */
const TestiCard = ({ quote, who }) => (
  <div style={{ background: 'var(--bg-alt)', padding: '44px', borderTop: '2px solid var(--amber)' }}>
    <p style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 300, fontStyle: 'italic', lineHeight: 1.65, color: 'var(--ink)', marginBottom: 28 }}>
      &ldquo;{quote}&rdquo;
    </p>
    <div style={{ fontSize: 11, color: 'var(--ink-light)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>— {who}</div>
  </div>
);

/* ── ProblemCard ───────────────────────────────────── */
const ProblemCard = ({ Icon, title, desc, onClick }) => {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        padding: '32px 28px', background: hov ? 'var(--amber-dim)' : 'var(--bg-alt)',
        borderTop: `2px solid ${hov ? 'var(--amber)' : 'var(--line)'}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      <div style={{ color: hov ? 'var(--amber)' : 'var(--ink-mid)', marginBottom: 16, transition: 'color 0.2s' }}>
        <Icon size={28} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 8, lineHeight: 1.35 }}>{title}</div>
      {desc && <div style={{ fontSize: 13, color: 'var(--ink-light)', lineHeight: 1.65 }}>{desc}</div>}
    </div>
  );
};

/* ── Footer ────────────────────────────────────────── */
const Footer = ({ navigate }) => (
  <footer style={{ background: 'var(--ink)', color: 'var(--ink-light)', padding: '56px var(--page-x)' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
      <div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 300, color: 'var(--bg)', marginBottom: 14 }}>Regulski.</div>
        <p style={{ fontSize: 13, lineHeight: 1.85, maxWidth: 280, fontWeight: 300, color: 'var(--ink-light)' }}>
          Spokojna pomoc w zrozumieniu problemów zachowania psów i kotów. Terapia behawioralna online dla opiekunów z całej Polski.
        </p>
      </div>
      {[
        { h: 'Nawigacja', l: [['Pies', '/psy'], ['Kot', '/koty'], ['Niezbędnik', '/niezbednik'], ['Kontakt', '/kontakt']] },
        { h: 'Start', l: [['Zarezerwuj kwadrans', '/book'], ['Dwa kwadranse', '/book'], ['Pełna konsultacja', '/book'], ['O mnie', '/o-mnie']] },
        { h: 'Materiały', l: [['Reaktywny pies', '/niezbednik'], ['Checklista kuweta', '/niezbednik'], ['Przygotowanie', '/niezbednik'], ['FAQ', '/faq']] },
      ].map(col => (
        <div key={col.h}>
          <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 18, color: 'var(--amber)' }}>{col.h}</div>
          {col.l.map(([label, path]) => (
            <div key={label} onClick={() => navigate(path)} style={{ fontSize: 13, marginBottom: 9, color: 'var(--ink-light)', cursor: 'pointer' }}>{label}</div>
          ))}
        </div>
      ))}
    </div>
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>© 2026 Krzysztof Regulski</span>
      <span style={{ fontSize: 12, color: 'var(--ink-light)' }}>Terapia behawioralna online · Cała Polska</span>
    </div>
  </footer>
);

/* ── NavBar ────────────────────────────────────────── */
const NavBar = ({ navigate, currentPath, theme, toggleTheme, resolvedTheme }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const links = [
    ['Pies', '/psy'],
    ['Kot', '/koty'],
    ['Niezbędnik', '/niezbednik'],
    ['O mnie', '/o-mnie'],
    ['FAQ', '/faq'],
  ];
  const isActive = (path) => currentPath === path;

  return (
    <nav className="nav-fixed">
      <div style={{
        maxWidth: 1440, margin: '0 auto', height: '100%',
        padding: '0 var(--page-x)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 400, color: 'var(--ink)', cursor: 'pointer', letterSpacing: '-0.3px' }}
        >
          Regulski.
        </div>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {links.map(([label, path]) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 400, fontFamily: 'var(--sans)',
                color: isActive(path) ? 'var(--amber)' : 'var(--ink-mid)',
                letterSpacing: '0.01em', padding: '4px 0',
                borderBottom: isActive(path) ? '1px solid var(--amber)' : '1px solid transparent',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={`Motyw: ${theme === 'system' ? 'systemowy' : theme === 'dark' ? 'ciemny' : 'jasny'}`}
            style={{
              background: 'var(--bg-alt)', border: '1px solid var(--line)', borderRadius: 20,
              width: 68, height: 34, display: 'flex', alignItems: 'center',
              padding: '0 6px', cursor: 'pointer', position: 'relative', gap: 4,
            }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: '50%', background: 'var(--amber)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: resolvedTheme === 'dark' ? 'translateX(34px)' : 'translateX(0)',
              transition: 'transform 0.25s ease',
              position: 'absolute', left: 6,
            }}>
              {resolvedTheme === 'dark'
                ? <window.IconMoon style={{ color: '#fff' }} />
                : <window.IconSun style={{ color: '#fff' }} />
              }
            </div>
          </button>

          <button
            onClick={() => navigate('/kontakt')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: 'var(--ink-mid)', fontFamily: 'var(--sans)', padding: '4px 0',
            }}
          >
            Kontakt
          </button>

          <Btn onClick={() => navigate('/book')}>
            Kwadrans / 69 zł <window.IconArrow />
          </Btn>
        </div>
      </div>

      {/* Mobile menu (simplified) */}
    </nav>
  );
};

/* ── Export to window ── */
Object.assign(window, {
  useTheme,
  Btn, Label, SectionHeader,
  ServiceCard, TestiCard, ProblemCard,
  Footer, NavBar,
});
