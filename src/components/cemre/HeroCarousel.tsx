"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cemre, type CemreLocale } from "@/content/cemre";

const text = {
  tr: {
    region: "Cemre bakım ve salon görselleri",
    prev: "Önceki slayt",
    next: "Sonraki slayt",
    labels: ["Salon & Ege", "Cilt bakımı", "Saç tasarım ve bakım"],
    titles: [
      "",
      "Cildiniz için sakin bir bakım molası.",
      "Saçınıza doğal hareket, özenli bir bitiş.",
    ],
    sub: [
      "",
      "Cilt bakımına ayırdığınız zamanı, kendinize ait bir molaya dönüştürün.",
      "Kesim, şekillendirme ve saç bakımı için tercihlerinizi birlikte planlayalım.",
    ],
    demo: "Temsili konsept görsel · Gerçek danışan veya işlem sonucu değildir.",
  },
  en: {
    region: "Cemre salon and care images",
    prev: "Previous slide",
    next: "Next slide",
    labels: ["Salon & Aegean", "Skin care", "Hair design & care"],
    titles: [
      "",
      "A quiet moment of care for your skin.",
      "Natural movement. A considered finish.",
    ],
    sub: [
      "",
      "Make time for yourself with a calm skin-care ritual.",
      "Plan your cut, styling and hair-care preferences with us.",
    ],
    demo: "Illustrative concept image · Not a real client or treatment result.",
  },
};
const assets = ["", "facial-v1", "hair-care-v1"];
type Navigation = {
  locale: CemreLocale;
  index: number;
  ready: boolean;
  busy: boolean;
  go: (next: number, focus?: number) => void;
};
const NavigationContext = createContext<Navigation | null>(null);

/** A stable control row in every slide; keyboard focus follows the same arrow on a change. */
export function HeroControls() {
  const nav = useContext(NavigationContext);
  if (!nav) return null;
  const t = text[nav.locale];
  return (
    <div
      className="hero-controls"
      aria-label={nav.locale === "tr" ? "Slayt kontrolü" : "Slide controls"}
    >
      <button
        type="button"
        data-direction="-1"
        aria-label={t.prev}
        disabled={!nav.ready || nav.busy}
        onClick={() => nav.go(nav.index - 1, -1)}
      >
        ←
      </button>
      <span className="hero-controls__count" aria-hidden="true">
        {String(nav.index + 1).padStart(2, "0")} <span>/ 03</span>
      </span>
      <button
        type="button"
        data-direction="1"
        aria-label={t.next}
        disabled={!nav.ready || nav.busy}
        onClick={() => nav.go(nav.index + 1, 1)}
      >
        →
      </button>
    </div>
  );
}

function TreatmentPhoto({ name, alt }: { name: string; alt: string }) {
  return (
    <picture className="hero-treatment-photo">
      <source
        media="(max-width:700px)"
        type="image/avif"
        srcSet={`/images/cemre/${name}-portrait-960.avif`}
      />
      <source
        type="image/avif"
        srcSet={`/images/cemre/${name}-1280.avif 1280w, /images/cemre/${name}-1920.avif 1920w`}
        sizes="100vw"
      />
      <img
        src={`/images/cemre/${name}-1920.webp`}
        srcSet={`/images/cemre/${name}-1280.webp 1280w, /images/cemre/${name}-1920.webp 1920w`}
        sizes="100vw"
        width="1920"
        height="1280"
        alt={alt}
      />
    </picture>
  );
}

/** User-driven only: no autoplay, no scroll hooks, no carousel library. */
export function HeroCarousel({
  locale,
  children,
}: {
  locale: CemreLocale;
  children: ReactNode;
}) {
  const t = text[locale],
    dict = cemre[locale];
  const [index, setIndex] = useState(0),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false);
  const root = useRef<HTMLElement>(null),
    locked = useRef(false),
    gesture = useRef<{ x: number; y: number } | null>(null),
    direction = useRef(1),
    previousIndex = useRef(0);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (index === previousIndex.current) return;
    previousIndex.current = index;
    if (!ready || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const incoming = root.current?.querySelector<HTMLElement>(
      '[data-active="true"]',
    );
    const animation = incoming?.animate(
      [
        { opacity: 0, transform: `translateX(${direction.current * 14}px)` },
        { opacity: 1, transform: "translateX(0)" },
      ],
      { duration: 380, easing: "cubic-bezier(.22,.61,.36,1)" },
    );
    return () => animation?.cancel();
  }, [index, ready]);
  async function go(requested: number, focus?: number) {
    if (locked.current) return;
    const next = (requested + 3) % 3;
    if (next === index) return;
    locked.current = true;
    setBusy(true);
    direction.current = focus ?? (next > index ? 1 : -1);
    // Decode only the requested treatment before revealing it; the initial page doesn't fetch all slides.
    if (next) {
      const photo = new Image();
      const variant =
        innerWidth <= 700
          ? "portrait-960"
          : innerWidth * devicePixelRatio > 1280
            ? "1920"
            : "1280";
      photo.src = `/images/cemre/${assets[next]}-${variant}.avif`;
      await photo.decode().catch(() => undefined);
    }
    setIndex(next);
    setBusy(false);
    locked.current = false;
    if (focus)
      requestAnimationFrame(() =>
        root.current
          ?.querySelector<HTMLButtonElement>(
            `[data-active="true"] [data-direction="${focus}"]`,
          )
          ?.focus({ preventScroll: true }),
      );
  }
  return (
    <NavigationContext.Provider value={{ locale, index, ready, busy, go }}>
      <section
        ref={root}
        className="split-hero hero-carousel"
        role="region"
        aria-roledescription={locale === "tr" ? "Slayt gösterisi" : "Carousel"}
        aria-label={t.region}
        aria-busy={busy}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            const delta = event.key === "ArrowRight" ? 1 : -1;
            void go(index + delta, delta);
          }
        }}
        onPointerDown={(event) => {
          if (
            event.pointerType !== "touch" ||
            (event.target as Element).closest("a,button,input")
          )
            return;
          gesture.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerCancel={() => (gesture.current = null)}
        onPointerUp={(event) => {
          const start = gesture.current;
          gesture.current = null;
          if (!start) return;
          const dx = event.clientX - start.x,
            dy = event.clientY - start.y;
          if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3)
            void go(index + (dx < 0 ? 1 : -1));
        }}
      >
        <div
          className="hero-carousel__slide"
          data-active={index === 0}
          hidden={index !== 0}
          inert={index !== 0}
          role="group"
          aria-roledescription={locale === "tr" ? "Slayt" : "Slide"}
          aria-label={`1 / 3: ${t.labels[0]}`}
        >
          {children}
        </div>
        {[1, 2].map((number) => (
          <div
            key={number}
            className="hero-carousel__slide hero-carousel__treatment"
            data-active={index === number}
            hidden={index !== number}
            inert={index !== number}
            role="group"
            aria-roledescription={locale === "tr" ? "Slayt" : "Slide"}
            aria-label={`${number + 1} / 3: ${t.labels[number]}`}
          >
            {index === number && (
              <TreatmentPhoto
                name={assets[number]}
                alt={
                  number === 1
                    ? locale === "tr"
                      ? "Başında beyaz havlu, yüzünde beyaz bakım maskesi ve gözlerinde salatalık dilimleri olan kadın — temsili görsel"
                      : "Woman with a white towel, white facial mask and cucumber slices over her eyes — illustrative image"
                    : locale === "tr"
                      ? "Salonda fırça ve fön makinesiyle saçları şekillendirilen kadın — temsili görsel"
                      : "Woman having her hair styled with a brush and blow dryer — illustrative image"
                }
              />
            )}
            <div className="split-hero__copy">
              <p className="place-label">{t.labels[number]}</p>
              <h2>{t.titles[number]}</h2>
              <p className="split-hero__sub">{t.sub[number]}</p>
              <a
                href="#randevu"
                className="button"
                data-care={number === 1 ? 0 : 1}
              >
                {dict.cta}
                <span aria-hidden="true">↗</span>
              </a>
              <HeroControls />
            </div>
            <p className="hero-carousel__disclaimer">{t.demo}</p>
          </div>
        ))}
        <span
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {index + 1} / 3: {t.labels[index]}
        </span>
      </section>
    </NavigationContext.Provider>
  );
}
