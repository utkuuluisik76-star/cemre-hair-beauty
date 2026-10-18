# Studio starter

> Dit is de afzonderlijke Cemre Hair & Beauty-conceptdemo. Zie [README-CEMRE.md](README-CEMRE.md) voor de sectie-indeling, WhatsApp-demo, beeldverantwoording en lokale startinstructies. Onderstaande tekst is de meegeleverde technische starterreferentie, niet de status van de fictieve salon.

Het technische vertrekpunt voor elke nieuwe klantsite. Het is gebouwd uit wat op u-luksstudyo.com werkt en getest is.

**Wat erin zit:**
- **Basis:** Next.js als statische export, Turks op `/` en Engels op `/en/`.
- **CMS:** voor de klant, met DecapBridge-login (zonder GitHub-account).
- **SEO:** titels, hreflang, sitemap, robots en structured data.
- **Landingspagina's:** een systeem voor extra SEO-pagina's.
- **Mobiel:** een vaste CTA-balk onderaan.
- **Snelheid:** zelf gehoste fonts met Turkse letters, AVIF/WebP-foto's met aparte crops voor telefoons, en de animatie-runtime volgens de studio-blueprint.
- **QA-scripts:** controleren tegen de snelheids- en kwaliteitsnormen.

**Wat er níet in zit: een ontwerp.** De secties in `src/components/sections` zijn een neutraal skelet. Ze laten zien hoe de onderdelen samenwerken. Bouw ze per klant opnieuw op rond het bedrijfsdoel en de primaire actie. Een klantsite mag nooit op deze starter lijken.

Gele `[[...]]`-markeringen op de pagina zijn ontbrekende gegevens. `npm run todo` geeft de volledige lijst.

## Nieuwe klant opzetten

**1. Intake.** Vul eerst het PROJECT-blok in `Website training/BLUEPRINT-PROMPT.md` volledig in. Het gaat om naam, domein, primaire actie, logo, foto's, prijzen, teksten en het WhatsApp-nummer. Ontbrekende feiten blijven gemarkeerde placeholders; verzin niets.

**2. Kopie maken** (in `Documenten`):

```bash
cp -r studio-starter klantnaam && cd klantnaam && rm -rf .git node_modules out .next qa && git init -b main && npm install
```

Pas daarna `name` in `package.json` aan.

**3. Basisgegevens.**
- `src/content/site.ts`: naam, `businessType`, adres en `themeColor`.
- `content/settings.json`: telefoon, WhatsApp en e-mail.
- Kleuren: de tokens in `src/app/globals.css`. Controleer elk tekst/achtergrond-paar op minstens 4.5:1.
- Fonts: zie `scripts/fonts.mjs`, daarna `npm run fonts`.
- Logo: vervang `src/components/ui/Logo.tsx`. Zet het beeldmerk als `src/images-src/logo-mark.png` neer en draai `npm run icons`.
- Foto's: zet de originelen in `src/images-src`, stel de crops in `scripts/images.mjs` in en draai `npm run images`. Houd `images` in `site.ts` gelijk.
- Teksten: `content/pages/*.json`.
- Social-preview: `npm run og`.

**4. Ontwerp en bouw**, één goedgekeurde fase tegelijk.
- Herbouw de secties.
- Voeg landingspagina's toe in `src/content/landing.ts`.
- Een scroll-verhaal is een eigen scene met `useScene` (zie `src/lib/motion/runtime.ts`) en een sticky stage.

**5. Online zetten.** Stappen met 🔑 vragen een login of betaling van jou. Die kan Claude niet doen.

1. 🔑 Koop het domein bij Cloudflare (Domain Registration). Een eigen domein is nodig, want `*.pages.dev` is in Turkije geblokkeerd.
2. 🔑 Maak een privé-repo op GitHub onder het studio-account (`utkuuluisik76-star`). Push vanuit de projectmap:

   ```bash
   git remote add origin https://github.com/utkuuluisik76-star/<repo>.git
   ```

   Gebruik daarna `git push -u origin main`.
3. Cloudflare → Workers & Pages → Create → Pages → koppel de repo.
   - Build command: `npm run build`
   - Output directory: `out`
   - Framework preset: None
   - Node komt uit `.node-version`.

   Voeg daarna onder Custom domains het domein en `www` toe. Maak een Redirect Rule `www` → apex (301, query string behouden).
4. Vul `url` in `site.ts` in en de projectnaam in `public/_headers`. Push, en vanaf dan zet elke push de site live.
5. 🔑 DecapBridge (decapbridge.com):
   - Maak een nieuwe site met de repo, branch `main` en een fine-grained GitHub-token met alleen deze repo en Contents: read/write.
   - Neem de site-id en de repo over in `public/admin/config.yml`. Zet daar ook `site_url`.
   - Nodig de klant uit. Laat de klant altijd inloggen via `/admin` → Giriş, want een uitnodigingslink werkt maar één keer.
6. Cloudflare Email Routing: `info@<domein>` → het adres van de klant.
7. Cloudflare Web Analytics: automatic setup voor het domein.
8. 🔑 Google Search Console: domeineigenschap, verificatie via een DNS TXT-record in Cloudflare, sitemap `https://<domein>/sitemap.xml` indienen, en indexering aanvragen voor de belangrijkste pagina's.
9. 🔑 Google Bedrijfsprofiel voor de klant: zonder URL's of prijzen in de beschrijving.

**6. Lanceren.** Loop de checklist hieronder door. Herhaal `npm run qa -- https://<domein>` na elke deploy.

## Commando's

| Commando | Wat het doet |
| --- | --- |
| `npm run dev` | Ontwikkelserver op http://localhost:3000 |
| `npm run build` / `npm start` | Productieversie in `out/`, geserveerd op http://localhost:4173 |
| `npm run cms` | Lokale CMS-server; daarna http://localhost:3000/admin/index.html (geen login nodig) |
| `npm run todo` | Alle open placeholders en ontbrekende instellingen (`-- --strict` faalt als er nog iets openstaat) |
| `npm run images` / `fonts` / `icons` / `og` | Foto's, fonts, favicons en social-preview opnieuw maken |
| `npm run qa` | Elke pagina op desktop en telefoon: consolefouten, hydration, mislukte requests, horizontale scroll, één H1, alt-teksten, afmetingen van afbeeldingen, `.motion` |
| `npm run qa:shots` | Screenshots op 390, 768 en 1440 px in `qa/shots` (`-- --reduced` voor reduced motion) |
| `npm run qa:jank` | Frametijden per sectie bij een volledige scroll (`-- --mobile` = 390×844 met 4× CPU-vertraging) |
| `npm run qa:lighthouse` | Lighthouse, mediaan van 5 runs (`-- --desktop` voor desktop) |

Alle QA-scripts testen standaard de lokale build. Geef een URL mee om de live site te testen.

## Checklist voor lancering

- [ ] `npm run todo -- --strict` slaagt: geen placeholders meer, domein ingevuld, echte nummers.
- [ ] `npm run qa` slaagt lokaal en daarna op het live domein.
- [ ] Lighthouse (mediaan van 5): performance mobiel ≥ 90 en desktop ≥ 98; accessibility, best practices en SEO 100. LCP < 2.5 s (doel < 2.0 s), CLS < 0.05.
- [ ] `qa:jank`: desktop 0 frames boven 20 ms. Mobiel (4× CPU) minder dan 2% trage frames en geen taak boven 100 ms.
- [ ] Screenshots op 390/768/1440 gecontroleerd, ook met `--reduced`.
- [ ] Live HTML vergeleken met `out/`. `.motion` staat na het laden op `<html>`.
- [ ] Klant kan inloggen op `/admin`. Een testwijziging staat binnen een minuut live en is daarna teruggedraaid.
- [ ] Sitemap ingediend en indexering aangevraagd.

## Een bewerkbaar veld toevoegen

1. **Data:** voeg het veld in beide talen toe in het JSON-bestand in `content/pages/`.
2. **Editor:** voeg het toe in `public/admin/config.yml`.
   - `i18n: true` = per taal verschillend.
   - `i18n: duplicate` = in beide talen gelijk. Niet gebruiken op een `object`-veld; laat het daar weg.
   - Zet een waarde met een komma tussen aanhalingstekens.
3. **Inlezen:** lees het in via `src/content/cms.ts`, met `.text()`, `.optional()`, `.list()` en dergelijke. Gedeelde waarden (foto's, WhatsApp-teksten) lees je uit `shared`.
4. **Tonen:** zet het veld in `src/content/types.ts` en in `tr.ts`/`en.ts`, en toon het in het component.
5. **Testen:** draai `npm run build`. Een ontbrekend veld stopt de build met een melding die bestand en veld noemt. Cloudflare houdt dan de vorige versie online.

## Landingspagina's

- **Toevoegen:** zet een sleutel en slugs in `src/content/landing.ts`, dezelfde sleutel in `content/pages/landing.json` (tr en en), en een object in `config.yml`. Routes, sitemap, footer en hreflang volgen vanzelf.
- **Geen landingspagina's:** verwijder `src/app/(tr)/[landing]` en `src/app/(en)/en/[landing]`.
- **Adres wijzigen na livegang:** zet een 301 in `public/_redirects`, bijvoorbeeld `/oud/ /nieuw/ 301`.

## Lessen uit eerdere projecten (al verwerkt, niet terugdraaien)

- **Head opschonen:** hosts voegen nodes toe aan `<head>`, waardoor React-hydration breekt. Het bootscript in `Document.tsx` ruimt dat op.
- **Geen per-frame variabelen op `:root`:** schrijf tijdens het scrollen nooit CSS-variabelen of classes op `<html>`/`<body>`/`:root`, want dan wordt de stijl van de hele pagina elk frame opnieuw berekend. Animeer alleen `transform`/`opacity`.
- **Lenis alleen voor muis en trackpad:** telefoons houden native scroll.
- **Verborgen Button:** een `Button` verbergen doe je met `max-lg:hidden!`, niet met `hidden`. Zijn eigen `inline-flex` wint anders.
- **Screenshots in headless Edge:** zonder `--blink-settings=lazyLoadEnabled=false` (de QA-scripts doen dat al) vervangt Edge lazy-afbeeldingen door placeholders.
- **Netlify Drop:** zip met `tar.exe -a -c -f`, nooit `Compress-Archive`.
- **Netlify Free:** credit-gebaseerd (een productie-deploy kost 15 van de 300 credits per maand; bij 0 pauzeren alle sites). Daarom Cloudflare Pages.
