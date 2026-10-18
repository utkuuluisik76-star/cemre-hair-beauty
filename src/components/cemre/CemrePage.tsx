import type { Metadata } from "next";
import { cemre, type CemreLocale } from "@/content/cemre";
import { Booking, Comparison } from "./Interactions";
import { HeroCarousel, HeroControls } from "./HeroCarousel";
import "./cemre.css";
import "./refinements.css";
import "./carousel.css";

export function cemreMetadata(locale: CemreLocale): Metadata {
  const title = `Cemre Hair & Beauty | ${locale === "tr" ? "Bodrum Konsept" : "Bodrum Concept"}`;
  const description = cemre[locale].sub;
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      siteName: "Cemre Hair & Beauty",
      type: "website",
      locale: locale === "tr" ? "tr_TR" : "en_US",
    },
    icons: { icon: "/cemre-icon.svg" },
  };
}

/** Responsive, pre-optimised concept imagery; no third-party image requests. */
function Scene({
  name,
  alt,
  priority = false,
  className = "",
}: {
  name: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <picture className={className}>
      <source
        type="image/avif"
        srcSet={`/images/cemre/${name}-640.avif 640w, /images/cemre/${name}-1280.avif 1280w`}
        sizes="(max-width: 700px) 100vw, 50vw"
      />
      <img
        src={`/images/cemre/${name}-1280.webp`}
        srcSet={`/images/cemre/${name}-640.webp 640w, /images/cemre/${name}-1280.webp 1280w`}
        sizes="(max-width: 700px) 100vw, 50vw"
        width="1280"
        height="1920"
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}

function CareIcon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      {name === "face" ? (
        <>
          <path d="M46 12c-17-2-29 11-29 28 0 18 12 28 25 28 12 0 20-10 20-22M46 12c-7 12-3 16 1 22l5 9-9 4v9l-8 2" />
          <path d="M26 39c3-3 6-3 9 0M44 53l6 1" />
          <circle cx="60" cy="20" r="8" />
        </>
      ) : name === "hair" ? (
        <>
          <path d="M22 68C-3 32 28 3 48 13c25 12 12 40 20 54M28 66C8 34 32 14 46 21c18 10 7 32 15 47M35 68c-18-28 0-44 9-38 12 7 0 20 11 38" />
        </>
      ) : (
        <>
          <circle cx="40" cy="33" r="15" />
          <path d="M40 7v5M40 54v5M14 33h5M61 33h5M21 14l4 4M55 48l4 4M21 52l4-4M55 18l4-4M12 66c9-6 18 6 28 0s18 6 28 0" />
        </>
      )}
    </svg>
  );
}

export function CemrePage({ locale }: { locale: CemreLocale }) {
  const t = cemre[locale];
  return (
    <div className="cemre-site">
      <a href="#main" className="skip-link">
        {t.skip}
      </a>
      <div className="concept-bar">{t.demo}</div>
      <header className="cemre-header">
        <a
          href={locale === "tr" ? "/" : "/en/"}
          className="cemre-logo"
          aria-label="Cemre Hair & Beauty"
        >
          <span>
            cemre<span className="logo-dot">.</span>
          </span>
          <small>hair & beauty</small>
        </a>
        <nav aria-label={locale === "tr" ? "Ana menü" : "Main navigation"}>
          {t.nav.map((label, i) => (
            <a key={label} href={["#bakimlar", "#donusum", "#atmosfer"][i]}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="language-link"
            href={locale === "tr" ? "/en/" : "/"}
            lang={locale === "tr" ? "en" : "tr"}
            aria-label={
              locale === "tr" ? "View in English" : "Türkçe görüntüleyin"
            }
          >
            {locale === "tr" ? "EN" : "TR"}
          </a>
          <a className="button header-book" href="#randevu">
            {t.cta}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>
      <main id="main">
        {/* 1. Symmetric photo split. One semantic title overlays both halves. */}
        <HeroCarousel locale={locale}>
          <div className="split-hero__images">
            <Scene name="hero-salon-v2" alt={t.caption} priority />
            <Scene
              name="bodrum-sea-v1"
              alt={
                locale === "tr"
                  ? "Beyaz Bodrum evleri ve Ege Denizi — konsept görsel"
                  : "White Bodrum houses and the Aegean Sea — concept image"
              }
              priority
            />
          </div>
          <div className="split-hero__copy">
            <p className="place-label">Bodrum, Muğla</p>
            <h1 id="hero-title">{t.hero}</h1>
            <p className="split-hero__sub">{t.sub}</p>
            <a href="#randevu" className="button">
              {t.cta}
              <span aria-hidden="true">↗</span>
            </a>
            <HeroControls />
          </div>
          <div className="split-hero__footer">
            <a
              href="#donusum"
              className="hero-comparison"
              aria-label={
                locale === "tr"
                  ? "Önce ve sonra karşılaştırmasını daha büyük görün — temsili görseller"
                  : "See the larger before and after comparison — illustrative images"
              }
            >
              <span className="hero-comparison__photos" aria-hidden="true">
                <span>
                  <img
                    src="/images/cemre/before-160.webp"
                    width="160"
                    height="240"
                    alt=""
                  />
                  <small>{t.before}</small>
                </span>
                <span>
                  <img
                    src="/images/cemre/after-160.webp"
                    width="160"
                    height="240"
                    alt=""
                  />
                  <small>{t.after}</small>
                </span>
              </span>
              <span className="hero-comparison__copy">
                <strong>
                  {t.before} & {t.after}
                </strong>
                <span>
                  {locale === "tr" ? "Daha fazla gör" : "See more"}
                  <span aria-hidden="true">↘</span>
                </span>
                <small>
                  {locale === "tr"
                    ? "Temsili görseller"
                    : "Illustrative images"}
                </small>
              </span>
            </a>
          </div>
        </HeroCarousel>
        {/* 2. Services: meaningful categories, not invented prices or duration. */}
        <section
          id="bakimlar"
          className="care-section section-pad"
          aria-labelledby="care-title"
        >
          <div className="section-heading">
            <h2 id="care-title">{t.servicesTitle}</h2>
            <p>{t.servicesText}</p>
          </div>
          <div className="care-grid">
            {t.services.map((service, i) => (
              <article key={service.title} className="care-card">
                <CareIcon name={service.icon} />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a href="#randevu" data-care={i} className="text-link">
                  {t.select}
                  <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
          <p className="fine-print">{t.conceptMenu}</p>
        </section>
        {/* 3. Comparison: keyboard-accessible slider; illustrative, never a result claim. */}
        <section
          id="donusum"
          className="comparison-section section-pad"
          aria-labelledby="comparison-title"
        >
          <div className="comparison-copy">
            <span className="outline-flower" aria-hidden="true">
              ✳
            </span>
            <h2 id="comparison-title">{t.compareTitle}</h2>
            <p>{t.compareText}</p>
            <p className="fine-print">{t.compareNote}</p>
          </div>
          <Comparison locale={locale} />
        </section>
        {/* 4. Three-step request; data stays in memory, no external delivery in demo. */}
        <section
          id="randevu"
          className="booking-section section-pad"
          aria-labelledby="booking-title"
        >
          <div className="booking-copy">
            <p className="place-label">Cemre Hair & Beauty</p>
            <h2 id="booking-title">{t.bookingTitle}</h2>
            <p>{t.bookingText}</p>
            <div className="booking-contact">
              <span aria-hidden="true">↗</span>
              <div>
                <p>WhatsApp</p>
                <span>+90 000 000 00 00 · Demo</span>
              </div>
            </div>
            <p className="fine-print">{t.demoNotice}</p>
          </div>
          <Booking locale={locale} />
        </section>
        {/* 5. No invented street address or fake salon map pin. */}
        <section
          id="atmosfer"
          className="atmosphere-section section-pad"
          aria-labelledby="space-title"
        >
          <figure>
            <Scene name="salon" alt={t.caption} />
            <figcaption>{t.caption}</figcaption>
          </figure>
          <div className="atmosphere-copy">
            <h2 id="space-title">{t.locationTitle}</h2>
            <p>{t.locationText}</p>
            <address>
              <strong>{t.location}</strong>
              <span>{t.address}</span>
              <span>{t.hours}</span>
            </address>
            <div className="area-map">
              <svg viewBox="0 0 500 170" fill="none" aria-hidden="true">
                <path
                  fill="#dce9eb"
                  d="M0 90c60-40 70 65 130 25s70 40 130 0 100 40 240-10v65H0Z"
                />
                <path
                  stroke="#c1c6c1"
                  strokeWidth="5"
                  d="M-20 15 90 60l80-25 80 30 80-45 190 50M25-10l70 180M205-10l-20 180M390-10l-45 180"
                />
                <path
                  stroke="#fff"
                  strokeWidth="2"
                  d="M0 20 130 85l120-50 100 45L500 5"
                />
              </svg>
              <span>Bodrum</span>
            </div>
            <p className="fine-print">{t.mapNote}</p>
            <a
              className="text-link"
              href="https://www.openstreetmap.org/#map=13/37.035/27.430"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.mapLink}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
        {/* 6. Explicit legal placeholders, no unsupported compliance promises. */}
        <section
          className="legal-section section-pad"
          aria-labelledby="legal-title"
        >
          <h2 id="legal-title">{t.legal}</h2>
          <div>
            {t.legalItems.map(([title, body]) => (
              <details key={title}>
                <summary>
                  {title}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{body}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className="cemre-footer">
        <div className="footer-top">
          <a className="cemre-logo" href="#main">
            <span>cemre.</span>
            <small>hair & beauty</small>
          </a>
          <p>{t.footer}</p>
          <a className="button button-light" href="#randevu">
            {t.cta}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © 2026 Cemre ·{" "}
            {locale === "tr" ? "Konsept tasarım" : "Concept design"}
          </span>
          <a
            href="https://u-luksstudyo.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.credit}
          </a>
        </div>
      </footer>
      <a
        href="#randevu"
        className="floating-whatsapp"
        aria-label={
          locale === "tr"
            ? "WhatsApp randevu demo akışını açın; mesaj gönderilmez"
            : "Open the WhatsApp appointment demo; no message is sent"
        }
      >
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M26.8 15.6a10.8 10.8 0 0 1-16 9.5L5 27l1.9-5.6A10.8 10.8 0 1 1 26.8 15.6Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="m12 10 2 3-1.4 1.5c.8 1.8 2 3 3.9 3.9L18 17l3 2c.2 2-1.1 3.1-3 2.5-4.6-1.3-8-4.7-9-8.7-.4-1.5 1-3.1 3-2.8Z"
            fill="currentColor"
          />
        </svg>
        <span>
          WhatsApp<small>Demo</small>
        </span>
      </a>
      <div className="mobile-cta">
        <span>{t.mobileSub}</span>
        <a href="#randevu" className="button">
          {t.cta}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
