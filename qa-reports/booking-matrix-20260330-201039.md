# Raport QA Booking Matrix

- Data: 2026-03-30 20:10:39 Europe/Warsaw
- Tryb lokalnego serwera: next dev
- URL: http://localhost:3581
- Topics z kodu: 7
- Wynik: PASS

## Zakres
- Każdy topic z `lib/data.ts` został sprawdzony przez ścieżkę `/slot -> /form`.
- Dla każdego topicu potwierdzono 2 przyszłe sloty.
- W każdej kombinacji formularz załadował się bez błędów RSC i bez pageerrorów.

## Wyniki
### PASS - szczeniak
- Label: Szczeniak i młody pies
- Slot 1: 22:10 | http://localhost:3581/form?problem=szczeniak&slotId=2026-03-30-22%3A10
- Slot 2: 22:30 | http://localhost:3581/form?problem=szczeniak&slotId=2026-03-30-22%3A30

### PASS - kot
- Label: Kot i trudne zachowania
- Slot 1: 22:10 | http://localhost:3581/form?problem=kot&slotId=2026-03-30-22%3A10
- Slot 2: 22:30 | http://localhost:3581/form?problem=kot&slotId=2026-03-30-22%3A30

### PASS - separacja
- Label: Lęk separacyjny
- Slot 1: 22:10 | http://localhost:3581/form?problem=separacja&slotId=2026-03-30-22%3A10
- Slot 2: 22:30 | http://localhost:3581/form?problem=separacja&slotId=2026-03-30-22%3A30

### PASS - agresja
- Label: Agresja i reakcje obronne
- Slot 1: 22:10 | http://localhost:3581/form?problem=agresja&slotId=2026-03-30-22%3A10
- Slot 2: 22:30 | http://localhost:3581/form?problem=agresja&slotId=2026-03-30-22%3A30

### PASS - niszczenie
- Label: Pobudzenie, pogoń i niszczenie
- Slot 1: 22:10 | http://localhost:3581/form?problem=niszczenie&slotId=2026-03-30-22%3A10
- Slot 2: 22:30 | http://localhost:3581/form?problem=niszczenie&slotId=2026-03-30-22%3A30

### PASS - dogoterapia
- Label: Dogoterapia
- Slot 1: 22:10 | http://localhost:3581/form?problem=dogoterapia&slotId=2026-03-30-22%3A10
- Slot 2: 22:30 | http://localhost:3581/form?problem=dogoterapia&slotId=2026-03-30-22%3A30

### PASS - inne
- Label: Inny temat do omówienia
- Slot 1: 22:10 | http://localhost:3581/form?problem=inne&slotId=2026-03-30-22%3A10
- Slot 2: 22:30 | http://localhost:3581/form?problem=inne&slotId=2026-03-30-22%3A30
