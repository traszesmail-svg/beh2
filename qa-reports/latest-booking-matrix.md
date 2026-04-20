# Raport QA Booking Matrix

- Data: 2026-04-08 11:16:26 Europe/Warsaw
- Tryb lokalnego serwera: next start
- URL: http://localhost:3606
- Topics z kodu: 11
- Wynik: PASS

## Zakres
- Każdy topic z `lib/data.ts` został sprawdzony przez ścieżkę `/slot -> /form`.
- Dla każdego topicu potwierdzono 2 przyszłe sloty.
- W każdej kombinacji formularz załadował się bez błędów RSC i bez pageerrorów.

## Wyniki
### PASS - szczeniak
- Label: Szczeniak i młody pies
- Slot 1: 13:16 | http://localhost:3606/form?problem=szczeniak&slotId=2026-04-08-13%3A16
- Slot 2: 13:36 | http://localhost:3606/form?problem=szczeniak&slotId=2026-04-08-13%3A36

### PASS - separacja
- Label: Problemy separacyjne
- Slot 1: 13:16 | http://localhost:3606/form?problem=separacja&slotId=2026-04-08-13%3A16
- Slot 2: 13:36 | http://localhost:3606/form?problem=separacja&slotId=2026-04-08-13%3A36

### PASS - spacer
- Label: Spacer i reakcje
- Slot 1: 13:16 | http://localhost:3606/form?problem=spacer&slotId=2026-04-08-13%3A16
- Slot 2: 13:36 | http://localhost:3606/form?problem=spacer&slotId=2026-04-08-13%3A36

### PASS - pobudzenie
- Label: Pobudzenie i pogoń
- Slot 1: 13:16 | http://localhost:3606/form?problem=pobudzenie&slotId=2026-04-08-13%3A16
- Slot 2: 13:36 | http://localhost:3606/form?problem=pobudzenie&slotId=2026-04-08-13%3A36

### PASS - agresja
- Label: Agresja i obrona zasobów
- Slot 1: 13:16 | http://localhost:3606/form?problem=agresja&slotId=2026-04-08-13%3A16
- Slot 2: 13:36 | http://localhost:3606/form?problem=agresja&slotId=2026-04-08-13%3A36

### PASS - kot-kuweta
- Label: Kuweta i zachowania toaletowe
- Slot 1: 13:16 | http://localhost:3606/form?problem=kot-kuweta&slotId=2026-04-08-13%3A16
- Slot 2: 13:36 | http://localhost:3606/form?problem=kot-kuweta&slotId=2026-04-08-13%3A36

### PASS - kot-konflikt
- Label: Konflikt między kotami
- Slot 1: 13:16 | http://localhost:3606/form?problem=kot-konflikt&slotId=2026-04-08-13%3A16
- Slot 2: 13:36 | http://localhost:3606/form?problem=kot-konflikt&slotId=2026-04-08-13%3A36

### PASS - kot-dotyk
- Label: Dotyk, pielęgnacja i obrona
- Slot 1: 13:16 | http://localhost:3606/form?problem=kot-dotyk&slotId=2026-04-08-13%3A16
- Slot 2: 13:36 | http://localhost:3606/form?problem=kot-dotyk&slotId=2026-04-08-13%3A36

### PASS - kot-stres
- Label: Lęk, stres i wycofanie
- Slot 1: 13:16 | http://localhost:3606/form?problem=kot-stres&slotId=2026-04-08-13%3A16
- Slot 2: 13:36 | http://localhost:3606/form?problem=kot-stres&slotId=2026-04-08-13%3A36

### PASS - kot-nocna-wokalizacja
- Label: Nocna aktywność i rytm dnia
- Slot 1: 13:16 | http://localhost:3606/form?problem=kot-nocna-wokalizacja&slotId=2026-04-08-13%3A16
- Slot 2: 13:36 | http://localhost:3606/form?problem=kot-nocna-wokalizacja&slotId=2026-04-08-13%3A36

### PASS - inne
- Label: Inny problem lub temat pokrewny
- Slot 1: 13:16 | http://localhost:3606/form?problem=inne&slotId=2026-04-08-13%3A16
- Slot 2: 13:36 | http://localhost:3606/form?problem=inne&slotId=2026-04-08-13%3A36
