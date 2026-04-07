# Raport QA Booking Matrix

- Data: 2026-04-04 06:57:09 Europe/Warsaw
- Tryb lokalnego serwera: next start
- URL: http://localhost:3472
- Topics z kodu: 7
- Wynik: PASS

## Zakres
- Każdy topic z `lib/data.ts` został sprawdzony przez ścieżkę `/slot -> /form`.
- Dla każdego topicu potwierdzono 2 przyszłe sloty.
- W każdej kombinacji formularz załadował się bez błędów RSC i bez pageerrorów.

## Wyniki
### PASS - szczeniak
- Label: Szczeniak i młody pies
- Slot 1: 08:56 | http://localhost:3472/form?problem=szczeniak&slotId=2026-04-04-08%3A56
- Slot 2: 09:16 | http://localhost:3472/form?problem=szczeniak&slotId=2026-04-04-09%3A16

### PASS - kot
- Label: Kot i trudne zachowania
- Slot 1: 08:56 | http://localhost:3472/form?problem=kot&slotId=2026-04-04-08%3A56
- Slot 2: 09:16 | http://localhost:3472/form?problem=kot&slotId=2026-04-04-09%3A16

### PASS - separacja
- Label: Lęk separacyjny
- Slot 1: 08:56 | http://localhost:3472/form?problem=separacja&slotId=2026-04-04-08%3A56
- Slot 2: 09:16 | http://localhost:3472/form?problem=separacja&slotId=2026-04-04-09%3A16

### PASS - agresja
- Label: Agresja i reakcje obronne
- Slot 1: 08:56 | http://localhost:3472/form?problem=agresja&slotId=2026-04-04-08%3A56
- Slot 2: 09:16 | http://localhost:3472/form?problem=agresja&slotId=2026-04-04-09%3A16

### PASS - niszczenie
- Label: Pobudzenie, pogoń i niszczenie
- Slot 1: 08:56 | http://localhost:3472/form?problem=niszczenie&slotId=2026-04-04-08%3A56
- Slot 2: 09:16 | http://localhost:3472/form?problem=niszczenie&slotId=2026-04-04-09%3A16

### PASS - dogoterapia
- Label: Dogoterapia
- Slot 1: 08:56 | http://localhost:3472/form?problem=dogoterapia&slotId=2026-04-04-08%3A56
- Slot 2: 09:16 | http://localhost:3472/form?problem=dogoterapia&slotId=2026-04-04-09%3A16

### PASS - inne
- Label: Inny temat do omówienia
- Slot 1: 08:56 | http://localhost:3472/form?problem=inne&slotId=2026-04-04-08%3A56
- Slot 2: 09:16 | http://localhost:3472/form?problem=inne&slotId=2026-04-04-09%3A16
