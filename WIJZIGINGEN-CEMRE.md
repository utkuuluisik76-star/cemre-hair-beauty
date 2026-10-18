# Cemre — vier verbeteringen, in volgorde

De wijzigingen zijn direct in de lokale demo verwerkt. De overige secties, content en formuliervalidatie zijn behouden. Nieuwe layoutregels staan in `src/components/cemre/refinements.css`, na de bestaande stylesheet geïmporteerd. Koppen blijven Instrument Serif; UI blijft Archivo. Geen nieuwe JavaScriptbibliotheek.

## 1. Twee beeldhelften met één titel

In `src/components/cemre/CemrePage.tsx` gebruikt de hero deze structuur binnen het bestaande component (waar `t`, `locale` en `Scene` beschikbaar zijn):

```tsx
<section className="split-hero" aria-labelledby="hero-title">
  <div className="split-hero__images">
    <Scene name="hero-salon-v2" alt={t.caption} priority />
    <Scene name="bodrum-sea-v1" alt="Bodrum & Ege — konsept görsel" priority />
  </div>
  <div className="split-hero__copy">
    <p className="place-label">Bodrum, Muğla</p>
    <h1 id="hero-title">{t.hero}</h1>
    <p className="split-hero__sub">{t.sub}</p>
    <a href="#randevu" className="button">
      {t.cta}<span aria-hidden="true">↗</span>
    </a>
  </div>
</section>
```

Kern van de layout; de volledige responsive regels en de footer van de hero staan in de bronbestanden:

```css
.split-hero {
  position: relative;
  isolation: isolate;
  min-height: max(650px, calc(100svh - 130px));
  display: grid;
  place-items: center;
  overflow: hidden;
  color: white;
}
.split-hero__images {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  gap: 2px;
  z-index: -2;
}
.split-hero__images img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.split-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgb(5 28 42 / 65%);
  z-index: -1;
}
```

De donkere cover houdt de witte tekst leesbaar; geen tekst rechtstreeks op een onvoorspelbaar licht beeld. Beelden gebruiken AVIF/WebP, srcset, expliciete afmetingen en hoge laadprioriteit. Ook mobiel blijft de beeldverdeling 50/50; lettergrootte en tekstbreedte schalen mee. Geen video/autoplay of scrollscènes.

Nieuw conceptbeeld gemaakt met het ingebouwde beeldgeneratiegereedschap: `src/images-src/cemre/bodrum-sea-v1.png`. Definitieve prompt en exportpaden: `src/images-src/cemre/bodrum-sea-v1-prompt.md`. De gebruikte beelden zijn fictief en zichtbaar als concept gemarkeerd.

## 2. Donkere vóór/na-pillen

De bestaande labels in `Interactions.tsx` zijn behouden; alleen hun vormgeving is aangepast:

```css
.compare-tag {
  border-radius: 999px;
  background: rgb(7 26 37 / 84%);
  color: white;
  padding: 8px 18px;
  font-size: 12px;
  line-height: 1.5;
  font-weight: 500;
  border: 1px solid rgb(255 255 255 / 30%);
}
```

## 3. Zwevende WhatsApp-knop

Het nieuwe anker in `CemrePage.tsx` heeft een inline WhatsApp-pictogram, de zichtbare tekst WhatsApp + Demo en een beschrijvende ARIA-label. De bestemming is bewust de afspraakflow, niet het ongeldige voorbeeldnummer:

```tsx
<a href="#randevu" className="floating-whatsapp"
   aria-label="WhatsApp randevu demo akışını açın; mesaj gönderilmez">
  {/* Inline SVG-pictogram staat volledig in CemrePage.tsx. */}
  <span>WhatsApp<small>Demo</small></span>
</a>
```

```css
.floating-whatsapp {
  position: fixed;
  right: max(24px, env(safe-area-inset-right));
  bottom: max(24px, env(safe-area-inset-bottom));
  z-index: 30;
  min-height: 60px;
  border-radius: 999px;
  background: #123d55;
  color: white;
}
@media (max-width: 700px) {
  .floating-whatsapp {
    right: max(14px, env(safe-area-inset-right));
    bottom: calc(84px + env(safe-area-inset-bottom));
    min-height: 56px;
  }
}
```

De vaste mobiele afspraakbalk blijft bereikbaar. Geen automatische WhatsApp-verzending; de demo kan uitsluitend een Turks bericht voorbereiden en kopiëren.

## 4. Zachte selectie en stapwissels

De keuzekaarten en knoppen krijgen kleine transform-reacties. Alleen hover op apparaten met een fijne muisaanwijzer; geen kleverige hover op touch:

```css
.choice {
  transition: transform 220ms cubic-bezier(.22,.61,.36,1);
}
.choice:active { transform: scale(.985); }
@media (hover:hover) and (pointer:fine) {
  .choice:hover { transform: translateY(-2px); }
}
.booking-panel .button:active { transform: scale(.975); }
```

In `Booking` uit `Interactions.tsx` animeert alleen de inkomende stap. Alle velden blijven gemount, waardoor teruggaan geen invoer wist:

```tsx
const panel = useRef<HTMLDivElement>(null);
useEffect(() => {
  if (!ready || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const incoming = panel.current?.querySelector(
    message ? '.message-preview' : 'fieldset:not([hidden])'
  );
  const animation = incoming?.animate([
    { opacity: 0, transform: 'translateY(8px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], {
    duration: 260,
    easing: 'cubic-bezier(.22,.61,.36,1)'
  });
  return () => animation?.cancel();
}, [step, message, ready]);
```

`ref={panel}` staat op `.booking-panel`. Reduced motion schakelt deze animatie uit; CSS-feedback wordt eveneens uitgeschakeld. Geen hoogte-, filter- of schaduwanimatie per frame.
