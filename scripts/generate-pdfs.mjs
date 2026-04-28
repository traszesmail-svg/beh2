import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'poradniki');
mkdirSync(OUT, { recursive: true });

const ARIAL = 'C:/Windows/Fonts/arial.ttf';
const ARIAL_BOLD = 'C:/Windows/Fonts/arialbd.ttf';

const C = {
  accent: rgb(0.29, 0.553, 0.478),
  accentLight: rgb(0.91, 0.953, 0.941),
  ink: rgb(0.11, 0.102, 0.094),
  muted: rgb(0.353, 0.337, 0.314),
  white: rgb(1, 1, 1),
  bg: rgb(0.98, 0.976, 0.969),
};

async function makePdf(outFile, buildFn) {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle('Regulski Behawiorysta');
  doc.setAuthor('Krzysztof Regulski - COAPE/CAPBT');
  const boldBytes = readFileSync(ARIAL_BOLD);
  const regularBytes = readFileSync(ARIAL);
  const bold = await doc.embedFont(boldBytes);
  const regular = await doc.embedFont(regularBytes);
  const fonts = { bold, regular };
  await buildFn(doc, fonts);
  const bytes = await doc.save();
  writeFileSync(join(OUT, outFile), bytes);
  console.log('OK', outFile);
}

function addPage(doc) {
  return doc.addPage([595, 842]);
}

function header(page, fonts) {
  page.drawRectangle({ x: 0, y: 822, width: 595, height: 20, color: C.accent });
  page.drawText('regulskibehawiorysta.pl', {
    x: 30, y: 826, size: 8, font: fonts.regular, color: C.white,
  });
}

function footer(page, fonts, pageNum) {
  page.drawLine({ start: { x: 30, y: 30 }, end: { x: 565, y: 30 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
  page.drawText('Krzysztof Regulski - behawiorysta COAPE/CAPBT', {
    x: 30, y: 16, size: 7, font: fonts.regular, color: C.muted,
  });
  page.drawText(String(pageNum), {
    x: 560, y: 16, size: 7, font: fonts.regular, color: C.muted,
  });
}

function accentBox(page, x, y, w, h) {
  page.drawRectangle({ x, y: y - h + 4, width: w, height: h, color: C.accentLight, borderColor: C.accent, borderWidth: 0.5 });
}

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > maxChars) {
      if (line) lines.push(line.trim());
      line = word;
    } else {
      line = (line + ' ' + word).trim();
    }
  }
  if (line) lines.push(line.trim());
  return lines.length ? lines : [''];
}

// =====================================================================
// PDF 1: 30 zachowan
// =====================================================================
await makePdf('30-zachowan.pdf', async (doc, fonts) => {
  let page = addPage(doc);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: C.bg });
  page.drawRectangle({ x: 0, y: 742, width: 595, height: 100, color: C.accent });
  page.drawText('DARMOWY PORADNIK', { x: 30, y: 820, size: 10, font: fonts.bold, color: C.white });
  page.drawText('KRZYSZTOF REGULSKI  -  COAPE / CAPBT', { x: 30, y: 750, size: 9, font: fonts.regular, color: C.white });
  page.drawText('30 zachowan', { x: 30, y: 680, size: 52, font: fonts.bold, color: C.ink });
  page.drawText('do obserwacji', { x: 30, y: 618, size: 52, font: fonts.bold, color: C.accent });
  page.drawText('Sygnaly u psa i kota - co naprawde znacza', { x: 30, y: 585, size: 15, font: fonts.regular, color: C.muted });
  page.drawRectangle({ x: 30, y: 480, width: 240, height: 80, color: C.accentLight, borderColor: C.accent, borderWidth: 1 });
  page.drawText('Co znajdziesz w srodku:', { x: 42, y: 545, size: 10, font: fonts.bold, color: C.ink });
  ['15 sygnalow psa + interpretacja', '15 sygnalow kota + interpretacja', 'Kiedy reagowac, kiedy obserwowac', 'Kiedy do behawiorysty'].forEach((t, i) => {
    page.drawText('- ' + t, { x: 42, y: 527 - i * 14, size: 9, font: fonts.regular, color: C.ink });
  });
  page.drawText('regulskibehawiorysta.pl', { x: 30, y: 60, size: 10, font: fonts.bold, color: C.accent });
  page.drawText('konsultacje behawioralne psow i kotow online', { x: 30, y: 45, size: 9, font: fonts.regular, color: C.muted });

  // Strona 2 - Wstep
  page = addPage(doc);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: C.white });
  header(page, fonts);
  page.drawText('Wstep', { x: 30, y: 790, size: 20, font: fonts.bold, color: C.accent });
  const wstep = [
    'Ta lista powstala po wielu rozmowach z opiekunami psow i kotow,',
    'ktorzy pytali mnie: "Czy to normalne?" - i czesto nie wiedzieli,',
    'ze warto bylo wczesniej reagowac.',
    '',
    'Nie jest to lista diagnoz. To zbior sygnalow, ktore warto znac -',
    'zeby wiedziec, kiedy zachowanie zwierzecia jest komunikatem,',
    'a kiedy powodem do kontaktu z weterynarzem lub behawiorysty.',
    '',
    'Jak korzystac z tej listy:',
    '- Przejrzyj ja spokojnie - nie szukaj problemow na sile.',
    '- Jesli widzisz kilka sygnalow naraz - warto porozmawiac.',
    '- Jedno zachowanie nie jest diagnoza. Kontekst jest wszystkim.',
    '- Nagla zmiana zachowania: zawsze najpierw weterynarz.',
  ];
  wstep.forEach((line, i) => {
    page.drawText(line, { x: 30, y: 758 - i * 16, size: 10, font: fonts.regular, color: C.ink });
  });
  footer(page, fonts, 2);

  // Strona 3 - Pies czesc 1
  page = addPage(doc);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: C.white });
  header(page, fonts);
  page.drawRectangle({ x: 30, y: 775, width: 200, height: 22, color: C.accent });
  page.drawText('Pies - 15 sygnalow (1-8)', { x: 38, y: 781, size: 11, font: fonts.bold, color: C.white });

  const dogBehaviors = [
    ['1. Oblizywanie pyska', 'Sygnal uspokajajacy, stres lub napiecie. Nie mylic z oblizywaniem po jedzeniu.'],
    ['2. Ziewanie poza snem', 'Stres, nie zmeczenie. Czesto w sytuacjach nowych lub napiecia.'],
    ['3. Odwracanie glowy', '"Nie szukam konfliktu" - sygnal deeskalacji. Szanuj to.'],
    ['4. Sztywnienie ciala', 'Alarm. Pies przygotowuje sie do reakcji. Nie ignoruj.'],
    ['5. Widoczne bialka oczu', 'Duzy stres lub dyskomfort. Daj przestrzen.'],
    ['6. Drapanie sie bez powodu', 'Sygnal uspokajajacy lub przekierowanie uwagi.'],
    ['7. Spuszczone uszy + ogon', 'Submisja lub strach. Nie wymuszaj kontaktu.'],
    ['8. Merdanie nisko i szybko', 'Nie zawsze radosc - mieszane uczucia, ostroznosc.'],
  ];

  let y = 755;
  dogBehaviors.forEach(([name, desc]) => {
    page.drawText(name, { x: 30, y, size: 10, font: fonts.bold, color: C.ink });
    const lines = wrapText(desc, 80);
    lines.forEach((line, j) => {
      page.drawText(line, { x: 44, y: y - 13 - j * 12, size: 9, font: fonts.regular, color: C.muted });
    });
    y -= 13 + lines.length * 12 + 8;
  });
  footer(page, fonts, 3);

  // Strona 4 - Pies czesc 2
  page = addPage(doc);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: C.white });
  header(page, fonts);
  page.drawRectangle({ x: 30, y: 775, width: 200, height: 22, color: C.accent });
  page.drawText('Pies - sygnaly 9-15', { x: 38, y: 781, size: 11, font: fonts.bold, color: C.white });

  const dogBehaviors2 = [
    ['9. Warczenie', 'Jasny komunikat. NIE karac - warczenie to ostrzezenie. Karanie usuwa sygnal, nie problem.'],
    ['10. Niechec do ulubionego jedzenia', 'Stres lub choroba. Wymaga uwagi.'],
    ['11. Czeste zalatwianie sie', 'Moze byc stres lub problem zdrowotny - weterynarz.'],
    ['12. Niszczenie kiedy sam', 'Lek separacyjny vs. nuda - rozne podejscia. Obserwuj kontekst.'],
    ['13. Chowanie sie stale', 'Jesli regularne - niepokojace. Bol, stres, choroba.'],
    ['14. Glosne wzdychanie', 'Kontekst decyduje: relaks albo frustracja.'],
    ['15. Luk przy podejsciu', 'Chec zaangazowania, ale ostrozna. Zaproc, nie wymuczaj.'],
  ];

  y = 755;
  dogBehaviors2.forEach(([name, desc]) => {
    page.drawText(name, { x: 30, y, size: 10, font: fonts.bold, color: C.ink });
    const lines = wrapText(desc, 80);
    lines.forEach((line, j) => {
      page.drawText(line, { x: 44, y: y - 13 - j * 12, size: 9, font: fonts.regular, color: C.muted });
    });
    y -= 13 + lines.length * 12 + 8;
  });

  accentBox(page, 30, y - 10, 535, 55);
  page.drawText('Wazne przy warczeniu:', { x: 40, y: y - 20, size: 10, font: fonts.bold, color: C.accent });
  page.drawText('Pies ktory nie warczy, nie "jest grzeczny" - moze nauczyl sie,', { x: 40, y: y - 35, size: 9, font: fonts.regular, color: C.ink });
  page.drawText('ze ostrzeganie nic nie daje. To jest bardziej niebezpieczne.', { x: 40, y: y - 48, size: 9, font: fonts.regular, color: C.ink });
  footer(page, fonts, 4);

  // Strona 5 - Kot czesc 1
  page = addPage(doc);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: C.white });
  header(page, fonts);
  page.drawRectangle({ x: 30, y: 775, width: 200, height: 22, color: C.accent });
  page.drawText('Kot - 15 sygnalow (1-8)', { x: 38, y: 781, size: 11, font: fonts.bold, color: C.white });

  const catBehaviors = [
    ['1. Mruczenie', 'Kontentnos, ALE tez bol lub stres. Kontekst jest kluczowy.'],
    ['2. Powolne mruganie', '"Ufam ci" - odpowiedz tym samym. Komunikat pozytywny.'],
    ['3. Machanie kocowka ogona', 'Irytacja, nie radosc. Daj przestrzen.'],
    ['4. Plasie uszy do tylu', 'Strach lub agresja obronna. Nie zblizaj sie.'],
    ['5. Splaszczenie ciala', 'Strach lub silny stres.'],
    ['6. Ogon w ksztalt U', 'Strach lub bolesnos.'],
    ['7. Uniesiony ogon prosto', 'Pozytywne powitanie, otwartosc na kontakt.'],
    ['8. Drapanie mebli', 'Naturalne. Dostarcz drapaka w dobrym miejscu.'],
  ];

  y = 755;
  catBehaviors.forEach(([name, desc]) => {
    page.drawText(name, { x: 30, y, size: 10, font: fonts.bold, color: C.ink });
    const lines = wrapText(desc, 80);
    lines.forEach((line, j) => {
      page.drawText(line, { x: 44, y: y - 13 - j * 12, size: 9, font: fonts.regular, color: C.muted });
    });
    y -= 13 + lines.length * 12 + 8;
  });
  footer(page, fonts, 5);

  // Strona 6 - Kot czesc 2
  page = addPage(doc);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: C.white });
  header(page, fonts);
  page.drawRectangle({ x: 30, y: 775, width: 200, height: 22, color: C.accent });
  page.drawText('Kot - sygnaly 9-15', { x: 38, y: 781, size: 11, font: fonts.bold, color: C.white });

  const catBehaviors2 = [
    ['9. Sikanie poza kuweta', 'ZAWSZE: 1) weterynarz, 2) sprawdz kuwete, 3) stres/srodowisko.'],
    ['10. Spreyowanie', 'Komunikacja terytorialna. Czesto stres lub koty w domu.'],
    ['11. Mlaskanie przy oknie', 'Frustracja lowiecka - daj zabawy wechowe/ruchowe.'],
    ['12. Ukrywanie sie', 'Stres, nowosc lub choroba. Jesli stale - niepokojace.'],
    ['13. Nadmierne lizanie ciala', 'Stres, bol lub alergia. Obserwuj lokalizacje.'],
    ['14. Ataki na lydki i rece', 'Niedobor bodzcow lowieckich. Zabawa 2× dziennie.'],
    ['15. Regularne wymioty', 'Nie norma. Weterynarz - rozne przyczyny.'],
  ];

  y = 755;
  catBehaviors2.forEach(([name, desc]) => {
    page.drawText(name, { x: 30, y, size: 10, font: fonts.bold, color: C.ink });
    const lines = wrapText(desc, 80);
    lines.forEach((line, j) => {
      page.drawText(line, { x: 44, y: y - 13 - j * 12, size: 9, font: fonts.regular, color: C.muted });
    });
    y -= 13 + lines.length * 12 + 8;
  });
  footer(page, fonts, 6);

  // Strona 7 - Kiedy do behawiorysty
  page = addPage(doc);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: C.white });
  header(page, fonts);
  page.drawText('Kiedy skontaktowac sie z behawiorysty?', { x: 30, y: 790, size: 16, font: fonts.bold, color: C.ink });

  const signals = [
    'Zachowanie trwa ponad 4 tygodnie mimo zmian w srodowisku',
    'Pojawilo sie nagle - sprawdz najpierw weterynarz',
    'Wyraznie sie nasila w czasie',
    'Pies / kot przestaje jesc, pic, lub rani siebie',
    'Konflikt miedzy zwierzetami w domu',
    'Coraz trudniej Ci z tym emocjonalnie radzic',
  ];

  page.drawText('Sygnaly, ktore wymagaja konsultacji:', { x: 30, y: 758, size: 11, font: fonts.bold, color: C.accent });
  y = 738;
  signals.forEach((s) => {
    page.drawText('-', { x: 30, y, size: 10, font: fonts.bold, color: C.accent });
    const lines = wrapText(s, 75);
    lines.forEach((line, j) => {
      page.drawText(line, { x: 44, y: y - j * 13, size: 10, font: fonts.regular, color: C.ink });
    });
    y -= lines.length * 13 + 8;
  });

  y -= 20;
  accentBox(page, 30, y - 10, 535, 80);
  page.drawText('Zarezerwuj konsultacje online', { x: 40, y: y - 20, size: 13, font: fonts.bold, color: C.accent });
  page.drawText('Kwadrans 69 zl  -  Dwa kwadranse 169 zl  -  Pelna konsultacja 470 zl', { x: 40, y: y - 38, size: 9, font: fonts.regular, color: C.ink });
  page.drawText('Bez kary, bez przymusu. Pierwszy krok nie musi byc duzy.', { x: 40, y: y - 53, size: 9, font: fonts.regular, color: C.muted });
  page.drawText('regulskibehawiorysta.pl/book', { x: 40, y: y - 68, size: 10, font: fonts.bold, color: C.accent });
  footer(page, fonts, 7);

  // Tylna okladka
  page = addPage(doc);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: C.accent });
  page.drawText('Krzysztof Regulski', { x: 30, y: 750, size: 32, font: fonts.bold, color: C.white });
  page.drawText('behawiorysta zwierzecy', { x: 30, y: 712, size: 16, font: fonts.regular, color: C.white });
  ['Certyfikat COAPE / CAPBT', 'Technik weterynarii', 'Praca bez kar i przymusu'].forEach((t, i) => {
    page.drawText('- ' + t, { x: 30, y: 670 - i * 22, size: 12, font: fonts.regular, color: C.white });
  });
  page.drawText('kontakt@regulskibehawiorysta.pl', { x: 30, y: 120, size: 11, font: fonts.regular, color: C.white });
  page.drawText('regulskibehawiorysta.pl', { x: 30, y: 98, size: 14, font: fonts.bold, color: C.white });
});

// =====================================================================
// PDF 2: Pies sam w domu
// =====================================================================
await makePdf('pies-sam-w-domu.pdf', async (doc, fonts) => {
  let page = addPage(doc);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: C.bg });
  page.drawRectangle({ x: 0, y: 742, width: 595, height: 100, color: C.accent });
  page.drawText('DARMOWY PORADNIK', { x: 30, y: 820, size: 10, font: fonts.bold, color: C.white });
  page.drawText('KRZYSZTOF REGULSKI  -  COAPE / CAPBT', { x: 30, y: 750, size: 9, font: fonts.regular, color: C.white });
  page.drawText('Pies sam w domu', { x: 30, y: 680, size: 42, font: fonts.bold, color: C.ink });
  page.drawText('7 krokow do spokoju', { x: 30, y: 630, size: 30, font: fonts.bold, color: C.accent });
  page.drawText('Wprowadzenie do pracy z lekiem separacyjnym', { x: 30, y: 598, size: 13, font: fonts.regular, color: C.muted });
  page.drawRectangle({ x: 30, y: 490, width: 240, height: 85, color: C.accentLight, borderColor: C.accent, borderWidth: 1 });
  page.drawText('W tym poradniku:', { x: 42, y: 558, size: 10, font: fonts.bold, color: C.ink });
  ['Jak rozpoznac lek (nie nude)', '7 krokow stopniowego przyzwyczajania', 'Najczestsze bledy opiekunow', 'Plan na pierwsze 14 dni'].forEach((t, i) => {
    page.drawText('- ' + t, { x: 42, y: 540 - i * 14, size: 9, font: fonts.regular, color: C.ink });
  });
  page.drawText('regulskibehawiorysta.pl', { x: 30, y: 60, size: 10, font: fonts.bold, color: C.accent });

  // Strona 2 - Nuda vs Lek
  page = addPage(doc);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: C.white });
  header(page, fonts);
  page.drawText('Nuda czy lek? Jak odroznic', { x: 30, y: 790, size: 18, font: fonts.bold, color: C.ink });
  const nudaLek = [
    ['NUDA', ['Niszczenie gdy pies ma energię', 'Kradnie rzeczy i gryzie', 'Spokojny przy wyjsciu', 'Wita radosnie po powrocie']],
    ['LEK SEPARACYJNY', ['Niszczenie przy drzwiach/oknach', 'Wyje, szczeka, skowyczy', 'Niepokój przed wyjsciem', 'Hiper-przywiazanie do opiekuna']],
  ];
  let y = 760;
  nudaLek.forEach(([title, items]) => {
    page.drawRectangle({ x: 30, y: y - 5, width: 250, height: 22, color: title === 'NUDA' ? rgb(0.9, 0.9, 0.9) : C.accent });
    page.drawText(title, { x: 40, y: y, size: 11, font: fonts.bold, color: title === 'NUDA' ? C.ink : C.white });
    y -= 25;
    items.forEach((item) => {
      page.drawText('- ' + item, { x: 40, y, size: 9, font: fonts.regular, color: C.ink });
      y -= 15;
    });
    y -= 15;
  });
  footer(page, fonts, 2);

  // Strony 3-4 - 7 krokow
  const steps = [
    ['Krok 1: Obserwacja bez oceniania', 'Przez 3-5 dni obserwuj bez zmieniania. Nagraj wideo przez 30 min po wyjsciu. To twoj punkt startowy.'],
    ['Krok 2: Cwicz rozstania w domu', 'Wyjdz do innego pokoju. Wróc zanim pies zareaguje. Zwiększaj czas o kilka sekund dziennie.'],
    ['Krok 3: Zneutralizuj sygnaly wyjscia', 'Klucze, kurtka, buty - ubieraj je losowo bez wychodzenia. Pies uczy sie, ze to nie = samotnosc.'],
    ['Krok 4: Progi nie sa szczytami', 'Wychodz za drzwi na 1 sekunde. Wróc. Pies spokojny? Nastepnym razem 2 sekundy. Nie spiesz sie.'],
    ['Krok 5: Aktywizacja przed wyjsciem', '20-30 minut zabawy wechowej lub fizycznej. Zmeczony pies latwiej odpuszcza.'],
    ['Krok 6: Bezpieczne miejsce', 'Boks / mata / pokój - nie wiezienie, ale azyl. Buduj pozytywne skojarzenie przez kilka tygodni.'],
    ['Krok 7: Konsekwencja i cierpliwosc', 'Postep nie jest liniowy. Regres po weekendzie jest normalny. Kluczowa jest regularnosc, nie dlugosc sesji.'],
  ];

  for (let p = 0; p < 2; p++) {
    page = addPage(doc);
    page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: C.white });
    header(page, fonts);
    page.drawText('7 krokow stopniowego przyzwyczajania', { x: 30, y: 790, size: 15, font: fonts.bold, color: C.ink });
    y = 760;
    const chunk = steps.slice(p * 3, p * 3 + (p === 0 ? 3 : 4));
    chunk.forEach(([title, desc]) => {
      page.drawRectangle({ x: 30, y: y - 5, width: 535, height: 18, color: C.accentLight });
      page.drawText(title, { x: 38, y: y - 1, size: 10, font: fonts.bold, color: C.accent });
      y -= 22;
      const lines = wrapText(desc, 85);
      lines.forEach((line) => {
        page.drawText(line, { x: 38, y, size: 9, font: fonts.regular, color: C.ink });
        y -= 13;
      });
      y -= 12;
    });
    footer(page, fonts, p + 3);
  }

  // Strona 5 - Plan 14 dni
  page = addPage(doc);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: C.white });
  header(page, fonts);
  page.drawText('Plan na pierwsze 14 dni', { x: 30, y: 790, size: 18, font: fonts.bold, color: C.ink });
  const plan = [
    ['Dni 1-3', 'Obserwacja + nagranie. Zadnych zmian.'],
    ['Dni 4-7', 'Cwiczenia w domu. Rozstania 1-30 sekund.'],
    ['Dni 8-10', 'Progi (1-5 minut). Neutralizuj sygnaly wyjscia.'],
    ['Dni 11-14', 'Stopniowo do 15-20 minut. Oceniaj spokój, nie czas.'],
  ];
  y = 758;
  plan.forEach(([days, desc]) => {
    page.drawText(days, { x: 30, y, size: 11, font: fonts.bold, color: C.accent });
    page.drawText(desc, { x: 120, y, size: 10, font: fonts.regular, color: C.ink });
    y -= 22;
  });

  y -= 20;
  accentBox(page, 30, y - 10, 535, 80);
  page.drawText('Potrzebujesz indywidualnego planu?', { x: 40, y: y - 22, size: 12, font: fonts.bold, color: C.accent });
  page.drawText('Jesli po 14 dniach nie widzisz poprawy - to czas na konsultacje.', { x: 40, y: y - 40, size: 9, font: fonts.regular, color: C.ink });
  page.drawText('regulskibehawiorysta.pl/book', { x: 40, y: y - 58, size: 10, font: fonts.bold, color: C.accent });
  footer(page, fonts, 5);
});

// =====================================================================
// PDF 3: Pierwszy tydzien z kotem
// =====================================================================
await makePdf('pierwszy-tydzien-z-kotem.pdf', async (doc, fonts) => {
  let page = addPage(doc);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: C.bg });
  page.drawRectangle({ x: 0, y: 742, width: 595, height: 100, color: C.accent });
  page.drawText('DARMOWY PORADNIK', { x: 30, y: 820, size: 10, font: fonts.bold, color: C.white });
  page.drawText('KRZYSZTOF REGULSKI  -  COAPE / CAPBT', { x: 30, y: 750, size: 9, font: fonts.regular, color: C.white });
  page.drawText('Pierwszy tydzien', { x: 30, y: 680, size: 42, font: fonts.bold, color: C.ink });
  page.drawText('z kotem', { x: 30, y: 632, size: 42, font: fonts.bold, color: C.accent });
  page.drawText('Checklist + plan na pierwsze 7 dni', { x: 30, y: 598, size: 13, font: fonts.regular, color: C.muted });
  page.drawRectangle({ x: 30, y: 490, width: 240, height: 85, color: C.accentLight, borderColor: C.accent, borderWidth: 1 });
  page.drawText('Co znajdziesz w srodku:', { x: 42, y: 558, size: 10, font: fonts.bold, color: C.ink });
  ['Lista zakupow (10 pozycji)', 'Pokoj bezpieczny - jak zorganizowac', 'Wprowadzenie krok po kroku', 'Drukowana checklist 7 dni'].forEach((t, i) => {
    page.drawText('- ' + t, { x: 42, y: 540 - i * 14, size: 9, font: fonts.regular, color: C.ink });
  });
  page.drawText('regulskibehawiorysta.pl', { x: 30, y: 60, size: 10, font: fonts.bold, color: C.accent });

  // Lista zakupow
  page = addPage(doc);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: C.white });
  header(page, fonts);
  page.drawText('Lista zakupow - 10 niezbednych rzeczy', { x: 30, y: 790, size: 16, font: fonts.bold, color: C.ink });
  const zakupy = [
    ['1. Kuweta', 'Otwarta lub zamknieta. Min. 1,5x dlugosc ciala kota.'],
    ['2. Zwirek', 'Na poczatek: bentonitowy, bez zapachu. Zmiana stopniowa.'],
    ['3. Drapak wysoki', 'Min. 90 cm. Stabilny. Przy miejscu do spania.'],
    ['4. Miseczki', 'Plyukie, szerokie - koty nie lubia wasami dotykac krawedzi.'],
    ['5. Fontanna wody', 'Koty pija wiecej z ruchomej wody. Zalecane.'],
    ['6. Transporter', 'Musi byc zawsze dostepny - nie tylko na wizyty u wet.'],
    ['7. Legowisko', 'Cieple, z bokami. Kilka opcji - kot wybierze.'],
    ['8. Zabawki', 'Wedka z piorem + mysz do noszenia. Min. 2x dziennie 10-15 min.'],
    ['9. Strefa wspinaczki', 'Polki, drzewko - koty potrzebuja wysokosci.'],
    ['10. Feliway (opcjonalnie)', 'Redukuje stres przy przeprowadzce.'],
  ];
  let y = 760;
  zakupy.forEach(([name, desc]) => {
    page.drawText(name, { x: 30, y, size: 10, font: fonts.bold, color: C.ink });
    const lines = wrapText(desc, 78);
    lines.forEach((line, j) => {
      page.drawText(line, { x: 44, y: y - 13 - j * 12, size: 9, font: fonts.regular, color: C.muted });
    });
    y -= 13 + lines.length * 12 + 6;
  });
  footer(page, fonts, 2);

  // Plan 7 dni
  page = addPage(doc);
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: C.white });
  header(page, fonts);
  page.drawText('Plan na pierwsze 7 dni', { x: 30, y: 790, size: 18, font: fonts.bold, color: C.ink });
  const planKot = [
    ['Dzien 1', 'Pokoj bezpieczny. Karmienie bez nacisku. Zostaw w spokoju.'],
    ['Dni 2-3', 'Krotkie wizyty bez wymuszania kontaktu. Daj inicjatywe kotowi.'],
    ['Dni 4-5', 'Stopniowo otwierasz drzwi do reszty mieszkania.'],
    ['Dni 6-7', 'Eksploracja w swoim tempie. Zabawy wedka 2x dziennie.'],
  ];
  y = 755;
  planKot.forEach(([day, desc]) => {
    page.drawRectangle({ x: 30, y: y - 3, width: 80, height: 18, color: C.accent });
    page.drawText(day, { x: 38, y: y, size: 10, font: fonts.bold, color: C.white });
    page.drawText(desc, { x: 122, y: y, size: 9, font: fonts.regular, color: C.ink });
    y -= 28;
  });

  y -= 20;
  accentBox(page, 30, y - 10, 535, 75);
  page.drawText('Wazna zasada pierwszego tygodnia:', { x: 40, y: y - 22, size: 11, font: fonts.bold, color: C.accent });
  page.drawText('Nie przyspieszaj socjalizacji. Kot ktory dostal czas - latwiej ufa.', { x: 40, y: y - 38, size: 9, font: fonts.regular, color: C.ink });
  page.drawText('Kot ktory byl zmuszany - moze potrzebowac miesiecy.', { x: 40, y: y - 52, size: 9, font: fonts.regular, color: C.ink });
  y -= 100;
  page.drawText('Pytania? Zarezerwuj konsultacje:', { x: 30, y, size: 11, font: fonts.bold, color: C.ink });
  page.drawText('regulskibehawiorysta.pl/book', { x: 30, y: y - 18, size: 11, font: fonts.bold, color: C.accent });
  footer(page, fonts, 3);
});

console.log('\nWszystkie PDFy gotowe w public/poradniki/');
