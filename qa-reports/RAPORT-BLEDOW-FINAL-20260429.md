# 🚨 RAPORT BŁĘDÓW DO POPRAWY - 2026-04-29

**Data audytu:** 2026-04-29 (głęboki audyt z Claude Opus 4.7)
**Przetestowane strony:** 30 + 8 dodatkowo sprawdzonych routów
**Screenshotów:** 30 (folder `qa-screenshots-deep/`)

---

## 🔴 KRYTYCZNE BŁĘDY (do naprawy NATYCHMIAST)

### 1. ❌ Hydration Error na HOME (`/`)

**Problem:** `<a>` zagnieżdżony w `<a>` - **invalid HTML**, powoduje hydration error w React.

**Lokalizacja:** [components/PetTopicCard.tsx:55-78](components/PetTopicCard.tsx#L55-L78)

**Co się dzieje:** Cała karta `PetTopicCard` (która zawiera własne `<Link>` w środku) jest zawijana w zewnętrzny `<Link href="/book?species=pies">`:

```tsx
<Link href="/book?species=pies">  // ← Zewnętrzny <a>
  <PetTopicCard>
    <Link href="/psy/reaktywnosc...">  // ← Wewnętrzny <a> = INVALID
    </Link>
  </PetTopicCard>
</Link>
```

**Konsole pokazują 11 błędów na home:**
- `Hydration failed because the initial UI does not match what was rendered on the server`
- `In HTML, <a> cannot be a descendant of <a>. This will cause a hydration error.`

**Naprawa:** Usunąć zewnętrzny `<Link>` lub zmienić na `<div>` z onClick handler.

**Priorytet:** 🔴 KRYTYCZNY (na głównej stronie!)

---

### 2. ❌ Brakujące pliki PWA Icons (404 na każdej stronie)

**Problem:** Manifest referuje 3 pliki ikon, które nie istnieją.

**Lokalizacja:** [app/manifest.ts:21-37](app/manifest.ts#L21-L37)

**Brakujące pliki:**
- `/icon-192.png` ❌
- `/icon-512.png` ❌
- `/icon-maskable-512.png` ❌

**Skutek:** 404 na każdej z 30 stron (errors w console).

**Naprawa:** Dodać pliki PNG do `/public/` lub usunąć z manifest.ts.

**Priorytet:** 🔴 WYSOKIE (404 na wszystkich stronach)

---

### 3. ❌ Złe canonical URL (SEO błąd)

**Problem:** Niektóre strony mają `<link rel="canonical">` wskazujący na **home page** zamiast na siebie.

**Strony dotknięte:**
- `/przybornik` → canonical=`/` ❌
- `/jak-sie-przygotowac` → canonical=`/` ❌

**Skutek:** Google nie zaindeksuje tych stron - traktuje jak duplicate of home.

**Priorytet:** 🔴 WYSOKIE (negatywny wpływ SEO)

---

## 🟠 WYSOKIE PRIORYTET

### 4. ⚠️ Duplikaty stron / podejrzane duplikaty content

#### 4a. `/przybornik` to stub `/niezbednik`
- `/przybornik`: 20,574 znaków, ten sam Title i H1 co `/niezbednik`
- `/niezbednik`: 80,763 znaków
- **Zalecenie:** Albo usunąć `/przybornik`, albo dodać redirect 301 do `/niezbednik`

#### 4b. `/jak-sie-przygotowac` to stub `/book`
- `/jak-sie-przygotowac`: 20,605 znaków, ten sam Title i H1 co `/book`
- `/book`: 84,436 znaków
- **Zalecenie:** Dodać redirect 301 lub naprawić canonical

#### 4c. `/metodyka` i `/o-mnie` mają ten sam Title
- Title: "Krzysztof Regulski - behawiorysta COAPE psow i kotow | Regulski"
- H1: "Krzysztof Regulski - behawiorysta psow i kotow."
- **Zalecenie:** Sprawdzić czy to celowe; nadać unikalny Title dla `/metodyka`

**Priorytet:** 🟠 WYSOKIE (SEO + UX)

---

### 5. ⚠️ Tytuły stron za długie (>70 znaków)

Google obcina tytuły powyżej ~60 znaków. **6 stron** ma tytuł za długi:

| Strona | Długość | Tytuł |
|--------|---------|-------|
| `/blog/dlaczego-moj-pies-szczeka-na-inne-psy` | 87 | "Dlaczego mój pies szczeka na inne psy? Co to naprawdę znaczy..." |
| `/blog/pies-wyje-kiedy-zostaje-sam` | 88 | "Pies wyje, kiedy zostaje sam — co to znaczy i od czego zacząć..." |
| `/koty` | 76 | "Behawiorysta kotow online - kuweta, stres i relacje miedzy kotami..." |
| `/psy` | 75 | "Behawiorysta psow online - reaktywnosc, separacja i pomoc w..." |
| `/materialy/pies-ile-ruchu-potrzebuje` | 74 | "Czy Twój pies naprawdę potrzebuje więcej ruchu?..." |
| `/koty/zalatwianie-poza-kuweta` | 72 | "Kot załatwia się poza kuwetą — co sprawdzić..." |

**Naprawa:** Skrócić Title do max 60 znaków.

---

### 6. ⚠️ Meta descriptions za długie (>200 znaków)

Google obcina descriptions powyżej ~155-160 znaków.

| Strona | Długość |
|--------|---------|
| `/jak-sie-przygotowac` | 227 znaków |
| `/book` | 227 znaków |
| `/oferta` | 211 znaków |

**Naprawa:** Skrócić do 150-160 znaków.

---

### 7. ⚠️ React Warning - duplicate keys na `/psy/reaktywnosc-na-smyczy`

**Komunikat:** `Encountered two children with the same key. Keys should be unique...`

**Skutek:** Komponenty mogą renderować się nieprawidłowo, problemy z update'owaniem.

**Naprawa:** Znaleźć element z duplikatem klucza w komponentach `/psy/reaktywnosc-na-smyczy`.

---

## 🟡 ŚREDNIE PRIORYTET

### 8. Mixed content - HTTP w canonical przy localhost

Strony używają `http://localhost:3000` w canonical URL nawet kiedy serwer chodzi na innym porcie. To w trakcie devu, ale w produkcji powinno być automatyczne.

### 9. /zamow-pdf - 404

Route `/zamow-pdf` zwraca 404. Sprawdzić czy to celowe (usunięte) czy dead link gdzieś w kodzie.

```bash
curl http://localhost:4000/zamow-pdf → 404
```

---

## 🟢 NISKIE PRIORYTET / Drobne

### 10. Obrazy bez ALT (każda strona)

Każda strona ma 2 obrazy bez ALT - to są **dekoracyjne side-visuals** (`alt=""` + `aria-hidden="true"`). To jest **technicznie poprawne** dla obrazów dekoracyjnych. False positive z mojego skryptu.

✅ **Status:** OK, nie wymaga naprawy.

---

## 📊 PEŁNA TABELA WYNIKÓW

| # | Strona | HTTP | Title len | Description len | Problemy |
|---|--------|------|-----------|-----------------|----------|
| 1 | / | 200 | 33 | OK | 🔴 Hydration error, 🔴 PWA icons |
| 2 | /psy | 200 | **75** ⚠️ | OK | Title za długi |
| 3 | /psy/reaktywnosc-na-smyczy | 200 | OK | OK | 🟠 Duplicate keys warning |
| 4 | /psy/lek-separacyjny | 200 | OK | OK | OK |
| 5 | /koty | 200 | **76** ⚠️ | OK | Title za długi |
| 6 | /koty/zalatwianie-poza-kuweta | 200 | **72** ⚠️ | OK | Title za długi |
| 7 | /koty/konflikt-miedzy-kotami | 200 | OK | OK | OK |
| 8 | /o-mnie | 200 | OK | OK | ⚠️ Same as /metodyka |
| 9 | /cennik | 200 | OK | OK | OK |
| 10 | /faq | 200 | OK | OK | OK |
| 11 | /blog | 200 | OK | OK | OK |
| 12 | /niezbednik | 200 | OK | OK | OK |
| 13 | /kontakt | 200 | OK | OK | OK |
| 14 | /book | 200 | OK | **227** ⚠️ | Description za długi |
| 15 | /jak-sie-przygotowac | 200 | OK | **227** ⚠️ | 🔴 Złe canonical, stub /book |
| 16 | /przybornik | 200 | OK | OK | 🔴 Złe canonical, stub /niezbednik |
| 17 | /opinie | 200 | OK | OK | OK |
| 18 | /metodyka | 200 | OK | OK | ⚠️ Same as /o-mnie |
| 19 | /oferta | 200 | OK | **211** ⚠️ | Description za długi |
| 20 | /konsultacja-behawioralna-online | 200 | OK | OK | OK |
| 21 | /behawiorysta-online-polska | 200 | OK | OK | OK |
| 22 | /polityka-prywatnosci | 200 | OK | OK | OK |
| 23 | /regulamin | 200 | OK | OK | OK |
| 24 | /regulamin-pelna-konsultacja | 200 | OK | OK | OK |
| 25 | /blog/dlaczego-moj-pies-szczeka-na-inne-psy | 200 | **87** ⚠️ | OK | Title za długi |
| 26 | /blog/pies-wyje-kiedy-zostaje-sam | 200 | **88** ⚠️ | OK | Title za długi |
| 27 | /blog/kot-zalatwia-sie-poza-kuweta | 200 | OK | OK | OK |
| 28 | /materialy/kot-zyje-w-napieciu | 200 | OK | OK | OK |
| 29 | /materialy/pies-ile-ruchu-potrzebuje | 200 | **74** ⚠️ | OK | Title za długi |
| 30 | /materialy/kot-problem-poza-kuweta | 200 | OK | OK | OK |

---

## 📋 CHECKLIST NAPRAW (priorytetyzowana)

### 🔴 KRYTYCZNE (NATYCHMIAST)

- [ ] **Naprawić hydration error na home** - usunąć zewnętrzny `<Link>` z `PetTopicCard` w komponencie `PetTopicsSection` ([components/PetTopicCard.tsx:55-78](components/PetTopicCard.tsx#L55-L78))
- [ ] **Dodać PWA icons** - `/public/icon-192.png`, `/public/icon-512.png`, `/public/icon-maskable-512.png` (lub usunąć z manifest)
- [ ] **Naprawić canonical** dla `/przybornik` i `/jak-sie-przygotowac`

### 🟠 WYSOKIE

- [ ] **Skrócić tytuły** 6 stron do max 60 znaków
- [ ] **Skrócić description** 3 stron do max 160 znaków
- [ ] **Zdecydować** co zrobić z `/przybornik` i `/jak-sie-przygotowac` (redirect/usunąć)
- [ ] **Naprawić duplicate Title** dla `/metodyka` (lub potwierdzić że to celowe)
- [ ] **Naprawić React duplicate key warning** na `/psy/reaktywnosc-na-smyczy`

### 🟡 ŚREDNIE

- [ ] Usunąć dead route `/zamow-pdf` lub naprawić
- [ ] Sprawdzić wszystkie 11 hydration warnings na home

---

## 🎯 PODSUMOWANIE

**Zakres audytu:**
- 30 stron przetestowanych
- 8 dodatkowych routów sprawdzonych
- 30 screenshotów wykonanych
- Sprawdzono: HTTP status, metadata (title, description, h1), obrazy, layout overflow, content (TODO/undefined), formularze, encoding, console errors, canonical URLs, duplicate content

**Statystyki:**
- ✅ 22 strony bez krytycznych błędów
- 🔴 1 strona z hydration error (HOME!)
- 🟠 6 stron z długim Title
- 🟠 3 strony z długim Description
- 🔴 2 strony z błędnym canonical
- ⚠️ 4 prawdopodobne duplikaty content
- 🐛 30 stron z 404 dla PWA icons

**Najważniejsze:**
1. **HOME ma poważny hydration error** - to widzą użytkownicy i Google
2. **Brakujące PWA icons** - 30 stron pokazuje 404 w console
3. **2 strony są stubami** z błędnym canonical → SEO problem

---

**Generated:** 2026-04-29
**Tester:** Claude Code (Opus 4.7)
**Screeny:** `qa-screenshots-deep/` (30 plików PNG)
**Surowe dane:** `qa-reports/RAPORT-DEEP-AUDIT.md`
