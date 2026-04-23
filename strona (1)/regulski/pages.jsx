/*
 * REGULSKI — Page Components
 * ─────────────────────────────────────────────────────
 * HANDOFF: Each Page* component becomes an
 * app/[route]/page.tsx file in Next.js.
 *
 *   PageHome      → app/page.tsx
 *   PagePies      → app/psy/page.tsx
 *   PageKoty      → app/koty/page.tsx
 *   PageOMnie     → app/o-mnie/page.tsx
 *   PageFAQ       → app/faq/page.tsx
 *   PageKontakt   → app/kontakt/page.tsx
 *   PageNiezbednik → app/niezbednik/page.tsx
 *   PageBook      → app/book/page.tsx
 * ─────────────────────────────────────────────────────
 */

/* ══ PAGE HOME ══════════════════════════════════════ */
const PageHome = ({ navigate }) => (
  <div>
    {/* HERO */}
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 680 }}>
      <div style={{ padding: '88px var(--page-x) 80px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <window.Label accent>Nr 01 / 2026 — Spokojny start</window.Label>
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(44px,4.5vw,72px)', fontWeight: 300,
            lineHeight: 1.1, letterSpacing: '-1px', color: 'var(--ink)', marginBottom: 32, maxWidth: 520,
          }}>
            Twój pies albo kot zachowuje się inaczej, niż powinien, i chcesz{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>wiedzieć, co z tym zrobić.</em>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink-mid)', maxWidth: 420, fontWeight: 300 }}>
            Pomagam opiekunom, którzy widzą problem i szukają <strong style={{ fontWeight: 500, color: 'var(--ink)' }}>konkretnej pomocy</strong>,
            nie kolejnych ogólnych porad z internetu.
          </p>
        </div>
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <window.Btn onClick={() => navigate('/book')}>Kwadrans z behawiorystą <window.IconArrow /></window.Btn>
            <window.Btn variant="outline" onClick={() => navigate('/kontakt')}>Napisz wiadomość</window.Btn>
          </div>
          <p style={{ fontSize: 12, color: 'var(--ink-light)' }}>
            Szerszy temat?{' '}
            <span onClick={() => navigate('/book')} style={{ color: 'var(--amber)', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'var(--amber-light)' }}>
              Dwa kwadranse.
            </span>
          </p>
        </div>
      </div>
      {/* Hero photos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <ImgPH label="side-left-crop.jpg" h="100%" bg="var(--bg-card)" />
        <ImgPH label="side-right-crop.jpg" h="100%" bg="var(--bg-alt)" />
      </div>
    </section>

    {/* TICKER BAR */}
    <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'var(--bg-alt)', padding: '13px var(--page-x)', display: 'flex', gap: 48, alignItems: 'center', overflow: 'hidden' }}>
      <span style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-light)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Spokojny start dla opiekunów psów i kotów</span>
      <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      <span style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--amber)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Terapia behawioralna online</span>
    </div>

    {/* KWADRANS CARD */}
    <section style={{ padding: '80px var(--page-x)', display: 'grid', gridTemplateColumns: '5fr 4fr', gap: 64, alignItems: 'center' }}>
      <div>
        <window.Label>Pierwszy krok / Spokojna rozmowa</window.Label>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 52, fontWeight: 300, lineHeight: 1.15, marginBottom: 24, color: 'var(--ink)' }}>
          Kwadrans<br />z behawiorystą
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink-mid)', maxWidth: 440, marginBottom: 36 }}>
          15 minut rozmowy audio bez kamery. Jedno pytanie albo uporządkowanie tematu na start. Bez presji, bez długiej ankiety.
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 32 }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 48, fontWeight: 400, color: 'var(--ink)' }}>69 zł</span>
          <span style={{ fontSize: 13, color: 'var(--ink-light)' }}>· 15 min · audio · bez kamery</span>
        </div>
        <window.Btn onClick={() => navigate('/book')}>Rezerwacja <window.IconArrow /></window.Btn>
      </div>
      <div style={{ background: 'var(--bg-alt)', overflow: 'hidden', borderRadius: 2 }}>
        <ImgPH label="omnie-hero.webp" h={360} bg="var(--bg-card)" />
        <div style={{ padding: '22px 28px', borderTop: '1px solid var(--line)' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 400, marginBottom: 4, color: 'var(--ink)' }}>Krzysztof Regulski</div>
          <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>Behawiorysta COAPE · Trener · Technik weterynarii</div>
        </div>
      </div>
    </section>

    {/* PIES / KOT SPLIT */}
    <section style={{ padding: '0 var(--page-x) 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      {[
        { path: '/psy', roman: 'I. / Sekcja A', animal: 'psa', tag: 'Pies', desc: 'Spacery, pobudzenie, separacja albo młody pies, z którym trudno złapać codzienny rytm.', label: 'Zobacz pomoc dla psa', bg: 'var(--bg-alt)' },
        { path: '/koty', roman: 'I. / Sekcja B', animal: 'kota', tag: 'Kot', desc: 'Kuweta, wycofanie, napięcie po zmianach w domu albo trudne relacje między kotami.', label: 'Zobacz pomoc dla kota', bg: 'var(--bg-card)' },
      ].map(s => (
        <div key={s.path} style={{ background: s.bg, padding: '52px 44px' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-light)', textTransform: 'uppercase', marginBottom: 28 }}>{s.roman}</div>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 300, lineHeight: 1.2, marginBottom: 16, color: 'var(--ink)' }}>
            Pomoc dla opiekuna <em style={{ color: 'var(--amber)' }}>{s.animal}.</em>
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--ink-mid)', marginBottom: 32 }}>{s.desc}</p>
          <span onClick={() => navigate(s.path)} style={{ fontSize: 13, color: 'var(--amber)', cursor: 'pointer', borderBottom: '1px solid var(--amber-light)', paddingBottom: 2 }}>
            {s.label} →
          </span>
        </div>
      ))}
    </section>

    {/* STEPS */}
    <section style={{ borderTop: '1px solid var(--line)', padding: '80px var(--page-x)' }}>
      <window.SectionHeader roman="II. / Jak to działa" sub="Zacznij od Kwadransu. Najpierw ustalamy priorytet, potem pierwszy krok.">
        Trzy kroki do spokoju.
      </window.SectionHeader>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40 }}>
        {[
          { n: '01', t: 'Zaczynasz od Kwadransu', d: 'Krótki start, żeby spokojnie ustalić priorytet i kolejny krok. Bez presji, bez długiej ankiety.' },
          { n: '02', t: 'Krótko opisujesz sytuację', d: 'Mówisz, co dzieje się dziś w domu, na spacerze albo przy kuwecie, i co najbardziej Cię blokuje.' },
          { n: '03', t: 'Wiesz, co zrobić dalej', d: 'Po rozmowie wiesz, od czego zacząć, co obserwować i czy temat wymaga szerszej konsultacji.' },
        ].map(s => (
          <div key={s.n} style={{ borderTop: '2px solid var(--amber)', paddingTop: 24 }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 48, fontWeight: 300, color: 'var(--amber-light)', marginBottom: 14, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 10, color: 'var(--ink)', lineHeight: 1.3 }}>{s.t}</div>
            <div style={{ fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.75 }}>{s.d}</div>
          </div>
        ))}
      </div>
    </section>

    {/* SERVICES */}
    <section style={{ borderTop: '1px solid var(--line)', padding: '80px var(--page-x)', background: 'var(--ink)' }}>
      <div style={{ marginBottom: 56 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 16 }}>III. / Usługi</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 300, color: '#faf8f4', lineHeight: 1.2, maxWidth: 480 }}>
          Behawiorysta psów i kotów online.
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <window.ServiceCard
          tag="Kwadrans / Start"
          price="69 zł"
          time="15 min / audio / bez kamery"
          title="Kwadrans z behawiorystą"
          desc="Porządkuje temat na start. Jedno pytanie albo uporządkowanie sytuacji bez długiego wejścia."
          items={['Jedno pytanie albo uporządkowanie sytuacji', '15 minut audio bez kamery', 'Najprostszy pierwszy krok']}
          cta="Zarezerwuj"
          onBook={() => navigate('/book')}
        />
        <window.ServiceCard
          tag="Pełna konsultacja"
          price="350 zł"
          time="ok. 2 h / online"
          title="Kiedy od razu wejść szerzej"
          desc="Daje więcej czasu na kontekst, kilka wątków naraz i jasny plan dalszej pracy."
          items={['Szerszy temat z większą liczbą wątków', 'Więcej czasu na kontekst i plan', 'Opcja dla trudniejszych spraw']}
          cta="Umów konsultację"
          dark
          onBook={() => navigate('/book')}
        />
      </div>
    </section>

    {/* TESTIMONIALS */}
    <section style={{ padding: '80px var(--page-x)', borderTop: '1px solid var(--line)' }}>
      <window.SectionHeader roman="V. / Opinie">Co opiekunowie mówią po rozmowie.</window.SectionHeader>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <window.TestiCard
          quote="Po rozmowie wiedziałam, co zrobić od razu i co spokojnie odłożyć. W domu zrobiło się dużo lżej."
          who="Opiekunka psa reaktywnego / po pierwszym kontakcie audio"
        />
        <window.TestiCard
          quote="Przy kuwecie dostałam porządek zamiast kolejnych domysłów. To był pierwszy moment, kiedy wiedziałam, od czego zacząć."
          who="Opiekunka kota niewychodzącego / po uporządkowaniu tematu"
        />
      </div>
    </section>

    {/* CTA FINAL */}
    <section style={{ padding: '80px var(--page-x)', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40 }}>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px,3.5vw,52px)', fontWeight: 300, lineHeight: 1.2, maxWidth: 520, color: 'var(--ink)' }}>
        Jeśli coś Cię niepokoi,{' '}
        <em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>zacznij spokojnie.</em>
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', flexShrink: 0 }}>
        <window.Btn onClick={() => navigate('/book')}>Zarezerwuj Kwadrans z behawiorystą <window.IconArrow /></window.Btn>
        <window.Btn variant="outline" onClick={() => navigate('/kontakt')}>Napisz wiadomość</window.Btn>
      </div>
    </section>

    <window.Footer navigate={navigate} />
  </div>
);


/* ══ PAGE PIES ══════════════════════════════════════ */
const DOG_PROBLEMS = [
  { Icon: window.IconReactivity,    title: 'Reaktywność na smyczy',          desc: 'Pies reaguje na inne psy, ludzi lub rowerzystów — szczekaniem, szarpaniem, napięciem.' },
  { Icon: window.IconSeparation,    title: 'Separacja i lęk przed samotnością', desc: 'Niszczenie, skomlenie, czy wypadki w domu, gdy pies zostaje sam.' },
  { Icon: window.IconHyperactivity, title: 'Pobudzenie i nadaktywność',      desc: 'Trudno złapać codzienny rytm, pies nie potrafi się uspokoić ani skupić.' },
  { Icon: window.IconBarking,       title: 'Szczekanie',                     desc: 'Nadmierne szczekanie w domu, na spacerze lub na bodźce przez okno.' },
  { Icon: window.IconBiting,        title: 'Gryzienie i niszczenie',         desc: 'Gryzienie ludzi, innych psów lub przedmiotów — szczenię lub dorosły pies.' },
  { Icon: window.IconFear,          title: 'Strach i lęki',                  desc: 'Lęk przed dźwiękami, obcymi, czy nowymi sytuacjami — zamykanie się, drżenie.' },
  { Icon: window.IconSocialization, title: 'Socjalizacja i młody pies',      desc: 'Szczenię lub pies z nieznaną historią — budowanie pewności i pierwszych granic.' },
  { Icon: window.IconOtherDog,      title: 'Inny problem',                   desc: 'Nie widzisz swojego tematu? Opisz sytuację — ustalimy, od czego zacząć.' },
];

const PagePies = ({ navigate }) => (
  <div>
    {/* Hero */}
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 480 }}>
      <div style={{ padding: '88px var(--page-x) 72px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <window.Label>Pies / Strona gatunku</window.Label>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(44px,4vw,64px)', fontWeight: 300, lineHeight: 1.1, color: 'var(--ink)', marginBottom: 24 }}>
          Pomoc dla opiekuna <em style={{ color: 'var(--amber)' }}>psa.</em>
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink-mid)', maxWidth: 400, marginBottom: 36 }}>
          Najczęściej start dotyczy spacerów, pobudzenia, separacji albo młodego psa, z którym trudno złapać codzienny rytm.
        </p>
        <window.Btn onClick={() => navigate('/book')}>Zarezerwuj Kwadrans <window.IconArrow /></window.Btn>
      </div>
      <ImgPH label="pies-hero.jpg" h="100%" bg="var(--bg-card)" minH={480} />
    </section>

    {/* Problem grid */}
    <section style={{ padding: '72px var(--page-x)' }}>
      <window.SectionHeader roman="Problemy / Kategorie" sub="Wybierz temat, który dotyczy Ciebie. Każdy z nich można omówić na Kwadransie lub pełnej konsultacji.">
        Co najczęściej niepokoi opiekunów psów.
      </window.SectionHeader>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
        {DOG_PROBLEMS.map(p => (
          <window.ProblemCard
            key={p.title}
            Icon={p.Icon}
            title={p.title}
            desc={p.desc}
            onClick={() => navigate('/book')}
          />
        ))}
      </div>
    </section>

    {/* Services */}
    <section style={{ padding: '0 var(--page-x) 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      <window.ServiceCard
        tag="Start"
        price="69 zł"
        time="15 min / audio / bez kamery"
        title="Kwadrans z behawiorystą"
        desc="Najprostszy start — jedno pytanie albo uporządkowanie sytuacji psa."
        items={['Jedno pytanie', '15 min audio', 'Konkretny kolejny krok']}
        cta="Zarezerwuj"
        onBook={() => navigate('/book')}
      />
      <window.ServiceCard
        tag="Szerzej"
        price="350 zł"
        time="ok. 2 h / online"
        title="Pełna konsultacja behawioralna"
        desc="Szerszy temat, kilka wątków naraz, plan pracy z psem na kolejne tygodnie."
        items={['Pełen kontekst zachowania', 'Plan działania', 'Materiały do pobrania']}
        cta="Umów konsultację"
        dark
        onBook={() => navigate('/book')}
      />
    </section>

    {/* CTA */}
    <CtaStrip navigate={navigate} />
    <window.Footer navigate={navigate} />
  </div>
);


/* ══ PAGE KOTY ══════════════════════════════════════ */
const CAT_PROBLEMS = [
  { Icon: window.IconLitter,          title: 'Kuweta i nieodpowiednie miejsca', desc: 'Kot nie korzysta z kuwety lub robi w innych miejscach w domu.' },
  { Icon: window.IconCatAggression,   title: 'Agresja między kotami',          desc: 'Napięcia, przepychanki lub poważne bójki między kotami w domu.' },
  { Icon: window.IconHumanAggression, title: 'Agresja wobec ludzi',            desc: 'Gryzienie, drapanie lub atak na domowników — bez wyraźnej przyczyny.' },
  { Icon: window.IconWithdrawal,      title: 'Wycofanie i lęk',               desc: 'Chowanie się, brak kontaktu, odmowa jedzenia w obecności ludzi.' },
  { Icon: window.IconScratching,      title: 'Drapanie mebli',                desc: 'Niszczenie kanap, dywanów lub ram okiennych mimo drapaków.' },
  { Icon: window.IconVocalization,    title: 'Nadmierne wokalizowanie',       desc: 'Głośne miauczenie w nocy lub przez cały dzień — bez oczywistego powodu.' },
  { Icon: window.IconStress,          title: 'Stres po zmianach w domu',      desc: 'Przeprowadzka, nowy domownik, nowe zwierzę — kot nie może się dostosować.' },
  { Icon: window.IconOtherCat,        title: 'Inny problem',                  desc: 'Nie widzisz swojego tematu? Opisz sytuację na Kwadransie.' },
];

const PageKoty = ({ navigate }) => (
  <div>
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 480 }}>
      <div style={{ padding: '88px var(--page-x) 72px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <window.Label>Kot / Strona gatunku</window.Label>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(44px,4vw,64px)', fontWeight: 300, lineHeight: 1.1, color: 'var(--ink)', marginBottom: 24 }}>
          Pomoc dla opiekuna <em style={{ color: 'var(--amber)' }}>kota.</em>
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink-mid)', maxWidth: 400, marginBottom: 36 }}>
          Kuweta, wycofanie, napięcie po zmianach w domu albo trudne relacje między kotami.
        </p>
        <window.Btn onClick={() => navigate('/book')}>Zarezerwuj Kwadrans <window.IconArrow /></window.Btn>
      </div>
      <ImgPH label="kot-hero.jpg" h="100%" bg="var(--bg-alt)" minH={480} />
    </section>

    <section style={{ padding: '72px var(--page-x)' }}>
      <window.SectionHeader roman="Problemy / Kategorie" sub="Każdy temat można omówić na Kwadransie lub pełnej konsultacji.">
        Co najczęściej niepokoi opiekunów kotów.
      </window.SectionHeader>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
        {CAT_PROBLEMS.map(p => (
          <window.ProblemCard
            key={p.title}
            Icon={p.Icon}
            title={p.title}
            desc={p.desc}
            onClick={() => navigate('/book')}
          />
        ))}
      </div>
    </section>

    <section style={{ padding: '0 var(--page-x) 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      <window.ServiceCard
        tag="Start"
        price="69 zł"
        time="15 min / audio / bez kamery"
        title="Kwadrans z behawiorystą"
        desc="Najprostszy start — jedno pytanie albo uporządkowanie sytuacji kota."
        items={['Jedno pytanie', '15 min audio', 'Konkretny kolejny krok']}
        cta="Zarezerwuj"
        onBook={() => navigate('/book')}
      />
      <window.ServiceCard
        tag="Szerzej"
        price="350 zł"
        time="ok. 2 h / online"
        title="Pełna konsultacja behawioralna"
        desc="Szerszy temat, kilka wątków naraz, plan pracy z kotem na kolejne tygodnie."
        items={['Pełen kontekst zachowania', 'Plan działania', 'Materiały do pobrania']}
        cta="Umów konsultację"
        dark
        onBook={() => navigate('/book')}
      />
    </section>

    <CtaStrip navigate={navigate} />
    <window.Footer navigate={navigate} />
  </div>
);


/* ══ PAGE O MNIE ══════════════════════════════════ */
const PageOMnie = ({ navigate }) => (
  <div>
    <section style={{ padding: '88px var(--page-x) 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
      <div style={{ position: 'relative' }}>
        <ImgPH label="specialist-krzysztof-portrait.jpg" h={540} bg="var(--bg-card)" />
        <div style={{ marginTop: 2, padding: '20px 24px', background: 'var(--bg-alt)', borderTop: '2px solid var(--amber)' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400, color: 'var(--ink)', marginBottom: 4 }}>Krzysztof Regulski</div>
          <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>Behawiorysta COAPE · Trener zwierząt · Technik weterynarii</div>
        </div>
      </div>
      <div>
        <window.Label>O mnie / Podejście</window.Label>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px,3.5vw,52px)', fontWeight: 300, lineHeight: 1.2, color: 'var(--ink)', marginBottom: 28 }}>
          Spokojne podejście, <em style={{ color: 'var(--amber)' }}>konkretne doświadczenie</em> i materiały, do których można wrócić.
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--ink-mid)', marginBottom: 32 }}>
          Pracuję spokojnie, bez przymusu i kar, z naciskiem na kontekst, dobrostan i pierwszy wykonalny krok. Najpierw porządkuję tło zachowania, dopiero potem dobieram pierwszy ruch, który da się wdrożyć w domu bez dokładania chaosu.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { title: 'Behawiorysta COAPE', desc: 'Międzynarodowy standard kształcenia behawiorystów i spokojna praca z realną codziennością.' },
            { title: 'Trener zwierząt towarzyszących', desc: 'Pierwszy krok ma być wykonalny dla opiekuna i realny dla psa albo kota.' },
            { title: 'Technik weterynarii', desc: 'Szerszy kontekst zdrowia i tego, kiedy najpierw trzeba wykluczyć podłoże medyczne.' },
          ].map((c, i) => (
            <div key={c.title} style={{ padding: '20px 0', borderTop: '1px solid var(--line)' }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-mid)', lineHeight: 1.7 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <CtaStrip navigate={navigate} />
    <window.Footer navigate={navigate} />
  </div>
);


/* ══ PAGE FAQ ════════════════════════════════════ */
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 16, textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)', fontFamily: 'var(--sans)', lineHeight: 1.4 }}>{q}</span>
        <window.IconChevron up={open} style={{ color: 'var(--amber)', flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ paddingBottom: 24, paddingRight: 40 }}>
          <p style={{ fontSize: 15, color: 'var(--ink-mid)', lineHeight: 1.8 }}>{a}</p>
        </div>
      )}
    </div>
  );
};

const FAQ_ITEMS = [
  { q: 'Czym jest Kwadrans z behawiorystą?', a: 'To 15 minut rozmowy audio bez kamery. Opisujesz sytuację, ustalamy priorytet i wybieramy pierwszy konkretny krok. Nie musisz mieć gotowej diagnozy ani szczegółowego opisu historii.' },
  { q: 'Czy Kwadrans wystarczy?', a: 'Przy jednym pytaniu albo przy pierwszym uporządkowaniu tematu często tak. Przy sprawie złożonej pomaga zdecydować, czy potrzebujesz szerszej konsultacji. Po Kwadransie zawsze wiesz, co dalej.' },
  { q: 'Czy konsultacja online ma sens?', a: 'Tak. Przy wielu problemach ważna jest historia, środowisko i codzienny rytm — a nie tylko sam objaw. Wideo z zachowania psa lub kota możesz wysłać przed rozmową.' },
  { q: 'Czy mogę najpierw napisać?', a: 'Tak. Krótka wiadomość przez formularz kontaktowy pomaga doprecyzować sytuację, jeśli nie chcesz rezerwować od razu.' },
  { q: 'Jak wygląda pełna konsultacja?', a: 'Trwa ok. 2 godzin online. Omawiamy historię, środowisko, codzienność. Dostajesz plan z konkretnymi krokami i materiały do których możesz wrócić.' },
  { q: 'Czy pracujesz metodami bezkarnymi?', a: 'Tak. Pracuję bez przymusu, awersji i kar. Opieram się na dobrobycie zwierzęcia, teorii uczenia się i kontekście środowiskowym.' },
  { q: 'Czy można umówić konsultację dla kotów?', a: 'Tak — pracuję zarówno z psami, jak i z kotami. Każda strona gatunku (Pies / Kot) ma osobną listę problemów i podejście.' },
  { q: 'Jak długo czeka się na termin?', a: 'Kwadrans można zarezerwować często w ciągu kilku dni. Pełna konsultacja — zazwyczaj do tygodnia. Aktualny kalendarz dostępny po kliknięciu Rezerwacji.' },
];

const PageFAQ = ({ navigate }) => (
  <div>
    <section style={{ padding: '88px var(--page-x) 80px', maxWidth: 860 }}>
      <window.Label>FAQ</window.Label>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(40px,4vw,60px)', fontWeight: 300, lineHeight: 1.1, color: 'var(--ink)', marginBottom: 56 }}>
        Najczęstsze pytania przed<br /><em style={{ color: 'var(--amber)' }}>pierwszym ruchem.</em>
      </h1>
      <div>
        {FAQ_ITEMS.map(item => <FAQItem key={item.q} {...item} />)}
      </div>
    </section>

    <CtaStrip navigate={navigate} />
    <window.Footer navigate={navigate} />
  </div>
);


/* ══ PAGE KONTAKT ═════════════════════════════════ */
const PageKontakt = ({ navigate }) => {
  const [sent, setSent] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', animal: 'pies', message: '' });
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); setSent(true); };

  const inputStyle = {
    width: '100%', padding: '12px 16px', fontSize: 14,
    background: 'var(--bg-alt)', border: '1px solid var(--line)', borderRadius: 2,
    color: 'var(--ink)', fontFamily: 'var(--sans)',
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <div>
      <section style={{ padding: '88px var(--page-x) 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
        {/* Info */}
        <div>
          <window.Label>Kontakt</window.Label>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(40px,4vw,56px)', fontWeight: 300, lineHeight: 1.1, color: 'var(--ink)', marginBottom: 28 }}>
            Napisz,<br /><em style={{ color: 'var(--amber)' }}>zanim zarezerwujesz.</em>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink-mid)', marginBottom: 48 }}>
            Krótka wiadomość pomaga doprecyzować sytuację i sprawdzić, czy Kwadrans wystarczy, czy lepiej od razu umówić się na konsultację.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { Icon: window.IconCalendar, label: 'Rezerwacja online', action: () => navigate('/book'), text: 'Otwórz kalendarz →' },
              { Icon: window.IconMail, label: 'E-mail', text: 'kontakt@regulski.pl' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--amber)', marginTop: 2 }}><item.Icon /></div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--ink-light)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                  <div onClick={item.action} style={{ fontSize: 15, color: 'var(--ink)', cursor: item.action ? 'pointer' : 'default' }}>{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        {sent ? (
          <div style={{ padding: '48px', background: 'var(--bg-alt)', borderTop: '2px solid var(--amber)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center' }}>
            <div style={{ color: 'var(--amber)', marginBottom: 20 }}><window.IconCheck size={40} /></div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 300, color: 'var(--ink)', marginBottom: 12 }}>Wiadomość wysłana</h3>
            <p style={{ fontSize: 15, color: 'var(--ink-mid)', lineHeight: 1.75 }}>Odezwę się w ciągu 1–2 dni roboczych.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-light)', display: 'block', marginBottom: 8 }}>Imię</label>
                <input name="name" value={form.name} onChange={handleChange} style={inputStyle} placeholder="Twoje imię" required />
              </div>
              <div>
                <label style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-light)', display: 'block', marginBottom: 8 }}>E-mail</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="twoj@email.pl" required />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-light)', display: 'block', marginBottom: 8 }}>Dotyczy</label>
              <select name="animal" value={form.animal} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="pies">Pies</option>
                <option value="kot">Kot</option>
                <option value="inne">Inne</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-light)', display: 'block', marginBottom: 8 }}>Wiadomość</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={6} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Krótki opis sytuacji..." required />
            </div>
            <window.Btn type="submit" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
              Wyślij wiadomość <window.IconArrow />
            </window.Btn>
          </form>
        )}
      </section>

      <window.Footer navigate={navigate} />
    </div>
  );
};


/* ══ PAGE NIEZBĘDNIK ══════════════════════════════ */
const MATERIALS = [
  { tag: 'Psy', title: '5 kroków dla reaktywnego psa', desc: 'Porządkuje pierwszy tydzień obserwacji i pierwszych decyzji, gdy pies reaguje na innych psów, ludzi albo rowerzystów.', path: '/niezbednik/reaktywnosc' },
  { tag: 'Koty', title: 'Checklista kuweta', desc: 'Prowadzi krok po kroku przez zdrowie, kuwetę, środowisko i zmiany w domu. Kot nie robi tego ze złośliwości.', path: '/niezbednik/kuweta' },
  { tag: 'Konsultacja', title: 'Przygotowanie do konsultacji', desc: 'Nie musisz przychodzić z gotową diagnozą. Pokazuje, co warto mieć przed 15 min audio albo pełną konsultacją.', path: '/niezbednik/przygotowanie' },
];

const PageNiezbednik = ({ navigate }) => (
  <div>
    <section style={{ padding: '88px var(--page-x) 80px' }}>
      <window.Label>Niezbędnik / Materiały bezpłatne</window.Label>
      <window.SectionHeader sub="Bezpłatne materiały startowe — pobierz, zanim umówisz się na rozmowę.">
        Wejdź lżej.
      </window.SectionHeader>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
        {MATERIALS.map(m => (
          <div key={m.title} style={{ background: 'var(--bg-alt)', padding: '44px 40px' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: 20 }}>{m.tag}</div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 300, lineHeight: 1.3, color: 'var(--ink)', marginBottom: 16 }}>{m.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.75, marginBottom: 36 }}>{m.desc}</p>
            <Btn variant="amber" small>
              <window.IconDownload /> Zobacz materiał
            </Btn>
          </div>
        ))}
      </div>
    </section>

    <window.Footer navigate={navigate} />
  </div>
);


/* ══ PAGE BOOK ══════════════════════════════════ */
const PageBook = ({ navigate }) => (
  <div>
    <section style={{ padding: '88px var(--page-x) 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
      <div>
        <window.Label accent>Rezerwacja</window.Label>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(40px,4vw,56px)', fontWeight: 300, lineHeight: 1.1, color: 'var(--ink)', marginBottom: 28 }}>
          Wybierz termin<br /><em style={{ color: 'var(--amber)' }}>i zacznij spokojnie.</em>
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--ink-mid)', maxWidth: 400, marginBottom: 40 }}>
          Kwadrans porządkuje temat na start. Pełna konsultacja zostaje dla spraw, które od razu wymagają szerszego planu.
        </p>
        {[
          { label: 'Kwadrans z behawiorystą', price: '69 zł', time: '15 min · audio · bez kamery', tag: 'Najprostszy start' },
          { label: 'Dwa kwadranse', price: '129 zł', time: '30 min · audio · bez kamery', tag: 'Szerszy temat' },
          { label: 'Pełna konsultacja', price: '350 zł', time: 'ok. 2 h · online', tag: 'Złożona sprawa' },
        ].map(s => (
          <div key={s.label} style={{ padding: '20px 0', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-light)' }}>{s.time} · {s.tag}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 400, color: 'var(--amber)' }}>{s.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar placeholder */}
      <div style={{ background: 'var(--bg-alt)', padding: '44px', borderTop: '2px solid var(--amber)' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 28 }}>Wybierz termin</div>
        <div style={{ background: 'var(--bg-card)', borderRadius: 2, aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: 'var(--ink-light)', border: '1px solid var(--line)' }}>
          <window.IconCalendar size={48} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, color: 'var(--ink-mid)', marginBottom: 8 }}>Kalendarz rezerwacji</div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--ink-light)' }}>calendly.com / widget</div>
          </div>
        </div>
        <p style={{ marginTop: 20, fontSize: 13, color: 'var(--ink-light)', lineHeight: 1.7 }}>
          Nie chcesz rezerwować od razu?{' '}
          <span onClick={() => navigate('/kontakt')} style={{ color: 'var(--amber)', cursor: 'pointer' }}>Napisz wiadomość →</span>
        </p>
      </div>
    </section>

    <window.Footer navigate={navigate} />
  </div>
);


/* ── Shared helpers ────────────────────────────── */

/* Image placeholder */
const ImgPH = ({ label, h, bg, minH }) => (
  <div style={{
    height: h, minHeight: minH,
    background: `repeating-linear-gradient(135deg, ${bg || 'var(--bg-card)'} 0, ${bg || 'var(--bg-card)'} 10px, var(--bg-alt) 10px, var(--bg-alt) 20px)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }}>
    <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--ink-light)', background: 'var(--bg-alt)', padding: '4px 10px', borderRadius: 2 }}>{label}</span>
  </div>
);

/* Bottom CTA strip */
const CtaStrip = ({ navigate }) => (
  <section style={{ padding: '72px var(--page-x)', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40 }}>
    <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px,3vw,44px)', fontWeight: 300, lineHeight: 1.2, color: 'var(--ink)', maxWidth: 480 }}>
      Jeśli coś Cię niepokoi,{' '}
      <em style={{ color: 'var(--amber)' }}>zacznij spokojnie.</em>
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', flexShrink: 0 }}>
      <window.Btn onClick={() => navigate('/book')}>Zarezerwuj Kwadrans <window.IconArrow /></window.Btn>
      <window.Btn variant="outline" onClick={() => navigate('/kontakt')}>Napisz wiadomość</window.Btn>
    </div>
  </section>
);

/* ── Export all pages to window ── */
Object.assign(window, {
  PageHome, PagePies, PageKoty, PageOMnie, PageFAQ,
  PageKontakt, PageNiezbednik, PageBook,
  CtaStrip, ImgPH,
});
