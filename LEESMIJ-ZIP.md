# Cemre Hair & Beauty — conceptwebsite

Deze ZIP bevat de complete projectbron, de conceptbeelden en de actuele statische website onder `out/`.

## Website bekijken / hosten

- De kant-en-klare website staat in `out/`. Voor statische hosting gebruik je de INHOUD van die map, niet de hele broncodemap.
- Voor een lokale preview: installeer Node.js 22+; open deze projectmap in PowerShell; voer `npm.cmd ci` uit, daarna `npm.cmd start`. Open http://localhost:4173/.
- Wijzigingen bouwen: `npm.cmd run build`. Dit vernieuwt `out/`.

## GitHub

De broncode en afbeeldingen staan in de projectroot onder `src/`, `public/`, `content/`, `scripts/` en in de configuratiebestanden. Upload die als projectbron. De meegeleverde `.gitignore` houdt `out/`, dependencies en caches buiten Git; de host kan de site met `npm ci` en `npm run build` opnieuw bouwen. Geen commit of push uitgevoerd.

## Wat erin zit

Drie headerslides met pijlen, swipe en toetsenbordbediening; salon/Bodrum, gezichtsbehandeling en haarstyling. Kleine vóór/na-teaser plus grote vergelijking, behandelingen, driestaps afspraakdemo, WhatsApp-demosnelkoppeling, conceptlocatie en juridische placeholders. Turks `/`, Engels `/en/`.

## Belangrijk

Fictieve conceptdemo, niet een echte salon. Foto's zijn gegenereerde conceptbeelden, geen echte behandelresultaten. WhatsApp gebruikt een ongeldig voorbeeldnummer en verstuurt niets. Adres, uren, echte contactgegevens en juridische voorwaarden zijn TO CONFIRM. Niet klaar voor echte afspraken of indexering; noindex is bewust actief. CMS niet gekoppeld. Volledige launch-snelheidsaudit blijft open.

Installatiebestanden (`node_modules`), buildcache (`.next`), lokale screenshots/testrapporten, Git-metadata, persoonlijke agentinstructies en eventuele geheimen zijn niet meegenomen. Dependencies kunnen met `npm ci` worden teruggezet.

Zie ook `README-CEMRE.md`, `HEADER-SLIDER.md` en `WIJZIGINGEN-CEMRE.md`. Bronbeelden en prompts staan onder `src/images-src/cemre/`.
