# Cemre header-slider

Drie handmatig bediende slides: salon/Ege, gezichtsbehandeling (witte handdoek, wit masker, komkommers op de ogen), en haarstyling met borstel en föhn. Geen autoplay.

- Code: src/components/cemre/HeroCarousel.tsx; vormgeving: carousel.css.
- Pijlen links/rechts, nummering, toetsenbordpijlen en horizontale swipe. Verticale touchscroll blijft native.
- Afspraakknoppen van slide 2 en 3 selecteren respectievelijk cilt bakımı en saç tasarım ve bakım in de bestaande demo.
- Alleen de aangevraagde nieuwe foto wordt gedecodeerd voor de slidewissel; tijdens laden blijft de vorige slide staan. Geen witte flits of initiële download van alle behandelbeelden.
- Transitie alleen transform/opacity; bij reduced motion geen stapanimatie. Inactieve slides zijn hidden en inert; na pijlbediening volgt de toetsenbordfocus dezelfde pijl op de nieuwe slide.
- Zonder JavaScript blijft de eerste hero en de vóór/na-teaser leesbaar; slideknoppen zijn dan uitgeschakeld.
- De bestaande kleine vóór/na-teaser blijft op de eerste slide.

De twee nieuwe foto's zijn met de ingebouwde beeldgenerator gemaakt en zichtbaar als concept gemarkeerd. Geen echte klanten of behandelresultaten. Bronnen: src/images-src/cemre/facial-v1.png en hair-care-v1.png. Volledige definitieve prompts en exportpaden: src/images-src/cemre/carousel-prompts.md. Mobiele portrait crops en AVIF/WebP-export: scripts/cemre-treatment-assets.mjs.
