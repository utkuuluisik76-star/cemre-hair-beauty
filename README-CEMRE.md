# Cemre Hair & Beauty — lokale conceptdemo

Een fictieve salon, geen echte klant of actieve reserveringsdienst. Gebouwd vanuit studio-starter; de ULUX-site is ongewijzigd. Niet gepubliceerd of naar GitHub gepusht.

## Lokaal bekijken

Node.js 22+. PowerShell: `npm.cmd ci`, `npm.cmd run build`, `$env:PORT='4181'`, `npm.cmd start`. Open http://localhost:4181/ of `/en/` voor Engels.

## Code per onderdeel

- `src/components/cemre/CemrePage.tsx`: server-rendered secties met verklarende codecommentaren: hero, diensten, vergelijking, reservering, locatie, juridische informatie.
- `src/components/cemre/cemre.css`: tokens, responsive layout en beperkte interactieovergangen.
- `src/components/cemre/Interactions.tsx`: vergelijking met native toetsenbordtoegankelijke range-input en twee tegengestelde transforms; driestapsformulier met invoervalidatie en berichtvoorbeeld.
- `src/content/cemre.ts`: Turkse/Engelse teksten, voorbeeldmenu en demo-instellingen.
- `src/app/(tr)/page.tsx`, `src/app/(en)/en/page.tsx`: routes en conceptmetadata (noindex).
- `scripts/cemre-assets.mjs`: crops en AVIF/WebP-export. Bron: `src/images-src/cemre/concept-sheet.png`. Websitebeelden: `public/images/cemre/`.

## WhatsApp en gegevens

Het voorbeeldnummer +90 000 000 00 00 is ongeldig. Geen WhatsApp-verzoek wordt uitgevoerd. De bezoeker kan het Turkse bericht alleen bekijken en kopiëren. Geen serveropslag of localStorage; formuliergegevens blijven in het werkgeheugen en verdwijnen bij herladen. Gebruik testgegevens. Datum en tijd zijn voorkeuren in Turkse tijd, geen echte beschikbaarheid of bevestiging. Een echte koppeling vraagt een gecontroleerd nummer en expliciete verzendactie; alleen het nummer veranderen activeert geen verzending.

## Conceptbeelden

Gemaakt met het ingebouwde beeldgeneratiegereedschap. Op de site expliciet gemarkeerd als concept/illustratie, nooit als echte klantresultaten. De oorspronkelijke prompt:

> Create one high-end editorial photographic contact sheet with EXACTLY three equal vertical panels side by side, no margins or borders, overall landscape 3:2 image. This is imagery for a clearly fictional Bodrum hair and beauty salon concept. LEFT PANEL: airy sophisticated Mediterranean salon interior, ivory plaster walls, travertine floor, single deep navy blue salon chair, tall arched mirror, linen curtains, sunlight and a glimpse of blue sea, restrained expensive architecture, no people. CENTER PANEL: close rear view shoulders and head of a fictional adult woman with long chestnut brown naturally wavy voluminous hair, simple ivory top, warm grey plain studio background. RIGHT PANEL: exact same fictional woman same pose same crop same hair length and colour and background, hair professionally blow dried smooth shiny with soft curved ends. Hair comparisons are illustrative not real results. No text, no logos, no watermarks. Cinematic natural light, convincing tactile photographic detail. Each third must be independently usable as a portrait website image.

## Open vóór echt gebruik

Echte foto's/rechten/toestemming, team, adres, uren, prijzen, contact, privacy- en annuleringsvoorwaarden en eigen domein: TO CONFIRM. De schematische regiokaart bevat geen salonpin. CMS en starter-SEO-landingspagina's zijn niet geactiveerd voor dit concept. Geen betaling, agenda-integratie of medische claims. Een volledige launch-audit en live controles zijn pas van toepassing op een goedgekeurde echte lancering.

Zonder JavaScript blijft de inhoud zichtbaar, inclusief een statische vergelijking; de boekingsknoppen zijn uitgeschakeld met uitleg. Geen scrollscènes, GSAP of smooth-scrollbibliotheek op deze pagina. Reduced motion schakelt CSS-overgangen uit.
