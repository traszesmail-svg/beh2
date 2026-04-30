

const BASE_URL = 'https://regulskibehawiorysta.pl';
const EMAIL = 'traszesmail@gmail.com';

const bookings = [
  // 1. KWADRANS NA JUZ (99 zł, no preferred slots needed)
  {
    service: 'kwadrans-na-juz',
    name: 'Anna Testowa',
    email: EMAIL,
    species: 'pies',
    description: 'Mój pies Reksio od kilku dni dziwnie się zachowuje na spacerach - szczeka na inne psy, ciągnie smyczę. Pilnie potrzebuję porady, co robić.',
    preferredSlots: '',
    consentRodo: true, consentRegulamin: true, consentEarlyStart: true, honeypot: ''
  },
  {
    service: 'kwadrans-na-juz',
    name: 'Bartosz Testowy',
    email: EMAIL,
    species: 'kot',
    description: 'Mój kot Mruczek od wczoraj nie korzysta z kuwety. Robi w nieoczekiwanych miejscach. Bardzo się martwię i potrzebuję natychmiastowej porady.',
    preferredSlots: '',
    consentRodo: true, consentRegulamin: true, consentEarlyStart: true, honeypot: ''
  },

  // 2. SZYBKA KONSULTACJA 15 MIN (69 zł)
  {
    service: 'szybka-konsultacja-15-min',
    name: 'Cezary Testowy',
    email: EMAIL,
    species: 'pies',
    description: 'Pies Burek w wieku 3 lat ma problem z separacją - wyje gdy zostaje sam w domu. Sytuacja trwa od 2 miesięcy. Chcę omówić od czego zacząć pracę.',
    preferredSlots: 'Poniedziałek 10-12, wtorek po 16:00, środa rano',
    consentRodo: true, consentRegulamin: true, consentEarlyStart: true, honeypot: ''
  },
  {
    service: 'szybka-konsultacja-15-min',
    name: 'Dorota Testowa',
    email: EMAIL,
    species: 'kot',
    description: 'Mam dwa koty, młodszy zaczął atakować starszego. Widać napięcie w domu. Potrzebuję pomocy w zrozumieniu sytuacji i pierwszych kroków.',
    preferredSlots: 'Czwartek 14-16, piątek 10-12, sobota cały dzień',
    consentRodo: true, consentRegulamin: true, consentEarlyStart: true, honeypot: ''
  },

  // 3. KONSULTACJA 30 MIN (169 zł)
  {
    service: 'konsultacja-30-min',
    name: 'Eryk Testowy',
    email: EMAIL,
    species: 'pies',
    description: 'Szczeniak labrador 6 miesięcy. Reaktywność na inne psy, gryzienie podczas zabawy, niszczenie domu gdy zostaje sam. Potrzebuję dłuższej rozmowy.',
    preferredSlots: 'Wtorek-czwartek po 17:00, sobota rano (10-12), niedziela elastycznie',
    consentRodo: true, consentRegulamin: true, consentEarlyStart: true, honeypot: ''
  },
  {
    service: 'konsultacja-30-min',
    name: 'Felicja Testowa',
    email: EMAIL,
    species: 'kot',
    description: 'Kotka po adopcji ze schroniska, 2 lata. Nadal chowa się po szafach, nie chce wychodzić, je tylko w nocy. Potrzebuję planu adaptacji.',
    preferredSlots: 'Poniedziałek-piątek 9-11 lub 14-16, weekendy elastycznie',
    consentRodo: true, consentRegulamin: true, consentEarlyStart: true, honeypot: ''
  },

  // 4. PELNA KONSULTACJA (470 zł)
  {
    service: 'konsultacja-behawioralna-online',
    name: 'Grzegorz Testowy',
    email: EMAIL,
    species: 'pies',
    description: 'Owczarek niemiecki 4 lata, agresja terytorialna - atakuje gości w domu, gryzie listonosza. Sytuacja narasta od roku. Potrzebuję pełnej diagnozy i planu.',
    preferredSlots: 'Najlepiej weekend (sobota lub niedziela) rano. Mogę też w tygodniu po 18:00.',
    consentRodo: true, consentRegulamin: true, consentEarlyStart: true, honeypot: ''
  },
  {
    service: 'konsultacja-behawioralna-online',
    name: 'Hanna Testowa',
    email: EMAIL,
    species: 'kot',
    description: 'Trzy koty, jeden nowy adoptowany 3 miesiące temu. Konflikt eskaluje, walki, oznaczanie terenu, jeden chudnie ze stresu. Pełna analiza środowiska.',
    preferredSlots: 'Czwartek lub piątek wieczorem, sobota cały dzień, niedziela do 14:00.',
    consentRodo: true, consentRegulamin: true, consentEarlyStart: true, honeypot: ''
  }
];

async function submitBooking(booking, index) {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/api/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    const elapsed = Date.now() - start;
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ [${index + 1}/8] ${booking.service.padEnd(35)} | ${booking.species} | ${booking.name.padEnd(20)} | ${elapsed}ms`);
      console.log(`     Response: ${data.message?.substring(0, 80) || 'OK'}`);
    } else {
      console.log(`❌ [${index + 1}/8] ${booking.service} - HTTP ${response.status}`);
      console.log(`     Error: ${data.error || JSON.stringify(data)}`);
    }
    return { ok: response.ok, data };
  } catch (e) {
    console.log(`❌ [${index + 1}/8] ${booking.service} - Exception: ${e.message}`);
    return { ok: false, error: e.message };
  }
}

(async () => {
  console.log('\n' + '█'.repeat(70));
  console.log(`🎯 WYKONUJĘ 8 REZERWACJI (2 × 4 typy usług)`);
  console.log(`📧 Email: ${EMAIL}`);
  console.log('█'.repeat(70));
  console.log('');

  const results = [];
  for (let i = 0; i < bookings.length; i++) {
    const result = await submitBooking(bookings[i], i);
    results.push(result);
    // Small delay between bookings
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n' + '█'.repeat(70));
  const ok = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;
  console.log(`📊 WYNIKI: ${ok}/8 OK, ${failed}/8 błędów`);
  console.log('█'.repeat(70));
})();
