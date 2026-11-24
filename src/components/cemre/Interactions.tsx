"use client";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { bookingConfig, cemre, type CemreLocale } from "@/content/cemre";
import { Arrow } from '@/components/ui/Arrow';

/** The reveal uses paired transforms, not a per-frame width or clip-path animation. */
export function Comparison({ locale }: { locale: CemreLocale }) {
  const t = cemre[locale];
  const [value, setValue] = useState(50);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <figure className="comparison-figure">
      <div
        className="comparison-stage"
        style={{ "--reveal": `${value}%` } as CSSProperties}
      >
        <img
          src="/images/cemre/after-1280.webp"
          width="1280"
          height="1920"
          loading="lazy"
          alt={
            locale === "tr"
              ? "Düz ve parlak şekillendirilmiş saç — temsili görsel"
              : "Smooth, glossy styled hair — illustrative image"
          }
        />
        <div className="comparison-reveal">
          <img
            src="/images/cemre/before-1280.webp"
            width="1280"
            height="1920"
            loading="lazy"
            alt={
              locale === "tr"
                ? "Doğal dalgalı saç — temsili görsel"
                : "Naturally wavy hair — illustrative image"
            }
          />
        </div>
        <span className="compare-tag before-tag">{t.before}</span>
        <span className="compare-tag after-tag">{t.after}</span>
        <span className="compare-divider">
          <span aria-hidden="true">‹ ›</span>
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          disabled={!ready}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label={t.compareLabel}
          aria-valuetext={`${t.before} ${value}%, ${t.after} ${100 - value}%`}
        />
      </div>
      <figcaption>
        {t.compareLabel} <span aria-hidden="true"><Arrow dir="leftRight" /></span>
      </figcaption>
    </figure>
  );
}

export function Booking({ locale }: { locale: CemreLocale }) {
  const t = cemre[locale];
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [service, setService] = useState(1);
  const [specialist, setSpecialist] = useState("");
  const [preference, setPreference] = useState(false);
  const [message, setMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [minimum, setMinimum] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  // Animate only the incoming step. Inputs stay mounted so going back preserves data.
  useEffect(() => {
    if (!ready || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const incoming = panel.current?.querySelector(
      message ? ".message-preview" : "fieldset:not([hidden])",
    );
    const animation = incoming?.animate(
      [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 260, easing: "cubic-bezier(.22,.61,.36,1)" },
    );
    return () => animation?.cancel();
  }, [step, message, ready]);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    (window as Window & { __appReady?: boolean }).__appReady = true;
    if (
      window.scrollY < window.innerHeight &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      document.documentElement.classList.add("motion");
    setReady(true);
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Istanbul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    setMinimum(today);
    const pick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        "[data-care]",
      );
      if (!link) return;
      event.preventDefault();
      setService(Number(link.dataset.care));
      setStep(0);
      setMessage("");
      document.getElementById("randevu")?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
      heading.current?.focus({ preventScroll: true });
    };
    document.addEventListener("click", pick);
    return () => document.removeEventListener("click", pick);
  }, []);
  function move(next: number) {
    setStep(next);
    requestAnimationFrame(() =>
      heading.current?.focus({ preventScroll: true }),
    );
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 2) {
      move(step + 1);
      return;
    }
    const data = new FormData(event.currentTarget);
    const date = String(data.get("date"));
    const localToday = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Istanbul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    if (date < localToday) {
      const input = event.currentTarget.elements.namedItem(
        "date",
      ) as HTMLInputElement;
      input.setCustomValidity(
        locale === "tr"
          ? "Lütfen bugünü veya sonraki bir tarihi seçin."
          : "Please choose today or a later date.",
      );
      input.reportValidity();
      return;
    }
    const formatted = new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Istanbul",
    }).format(new Date(`${date}T12:00:00+03:00`));
    setMessage(
      `Merhaba Cemre Hair & Beauty, randevu talebimi iletmek istiyorum.\n\nBakım: ${cemre.tr.services[service].title}\nUzman tercihi: ${preference && specialist.trim() ? specialist.trim() : "Tercihim yok"}\nTercih edilen tarih: ${formatted}\nTercih edilen saat: ${data.get("time")} (Türkiye saati)\nAd soyad: ${String(data.get("name")).trim()}\nTelefon: ${String(data.get("phone")).trim()}${String(data.get("note")).trim() ? `\nNot: ${String(data.get("note")).trim()}` : ""}\n\nUygunluk ve ücret bilgisi paylaşabilir misiniz?\n\n[DEMO — Gerçek randevu oluşturulmamıştır.]`,
    );
    setCopyStatus("");
    requestAnimationFrame(() =>
      heading.current?.focus({ preventScroll: true }),
    );
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopyStatus(t.copied);
    } catch {
      setCopyStatus(t.copyFail);
    }
  }
  return (
    <div className="booking-panel" ref={panel}>
      <ol
        className="booking-steps"
        aria-label={locale === "tr" ? "Randevu adımları" : "Appointment steps"}
      >
        {t.steps.map((label, i) => (
          <li
            key={label}
            aria-current={step === i ? "step" : undefined}
            className={i <= step ? "active" : ""}
          >
            <span>{i < step ? "✓" : i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <h3 ref={heading} tabIndex={-1}>
        {message
          ? t.preview
          : [t.serviceLegend, t.expertLegend, t.steps[2]][step]}
      </h3>
      <noscript>
        <p className="demo-note">{t.noJs}</p>
      </noscript>
      <form ref={form} onSubmit={submit} hidden={Boolean(message)}>
        <fieldset hidden={step !== 0} disabled={step !== 0 || !ready}>
          <legend className="sr-only">{t.serviceLegend}</legend>
          <div className="choice-list">
            {t.services.map((item, i) => (
              <label className="choice" key={item.title}>
                <input
                  type="radio"
                  name="service"
                  value={i}
                  checked={service === i}
                  onChange={() => setService(i)}
                />
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.items[0]}</small>
                </span>
                <span className="radio-mark" aria-hidden="true" />
              </label>
            ))}
          </div>
          <p className="fine-print">{t.conceptMenu}</p>
        </fieldset>
        <fieldset hidden={step !== 1} disabled={step !== 1 || !ready}>
          <legend className="sr-only">{t.expertLegend}</legend>
          <div className="choice-list">
            <label className="choice">
              <input
                type="radio"
                name="preference"
                checked={!preference}
                onChange={() => setPreference(false)}
              />
              <span>
                <strong>{t.noPreference}</strong>
                <small>{t.noPreferenceText}</small>
              </span>
              <span className="radio-mark" aria-hidden="true" />
            </label>
            <label className="choice">
              <input
                type="radio"
                name="preference"
                checked={preference}
                onChange={() => setPreference(true)}
              />
              <span>
                <strong>{t.expertOption}</strong>
              </span>
              <span className="radio-mark" aria-hidden="true" />
            </label>
          </div>
          {preference && (
            <label className="field-label">
              {t.expertLabel}
              <input
                value={specialist}
                onChange={(e) => setSpecialist(e.target.value)}
                maxLength={80}
                placeholder={t.expertPlaceholder}
              />
            </label>
          )}
          <p className="fine-print">{t.expertNote}</p>
        </fieldset>
        <fieldset hidden={step !== 2} disabled={step !== 2 || !ready}>
          <legend className="sr-only">{t.steps[2]}</legend>
          <div className="form-grid">
            <label className="field-label">
              {t.date}
              <input
                type="date"
                name="date"
                required
                min={minimum}
                onChange={(e) => e.target.setCustomValidity("")}
              />
            </label>
            <label className="field-label">
              {t.time}
              <input type="time" name="time" required />
              <small>
                {locale === "tr" ? "Türkiye saati" : "Türkiye time"}
              </small>
            </label>
            <label className="field-label">
              {t.name}
              <input
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                pattern=".*\S.*"
                placeholder={
                  locale === "tr" ? "Demo ad soyad" : "Demo full name"
                }
              />
            </label>
            <label className="field-label">
              {t.phone}
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                required
                pattern="\+?[0-9\s\(\)\-]{7,24}"
                maxLength={25}
                placeholder="+90 …"
              />
            </label>
          </div>
          <p className="fine-print">{t.availability}</p>
          <label className="field-label">
            {t.note}
            <textarea
              name="note"
              rows={2}
              maxLength={500}
              placeholder={t.notePlaceholder}
            />
          </label>
          <label className="privacy-check">
            <input type="checkbox" required />
            {t.privacy}
          </label>
        </fieldset>
        <p className="demo-note">{t.demoNotice}</p>
        <div className="form-actions">
          {step > 0 && (
            <button
              type="button"
              className="back-button"
              onClick={() => move(step - 1)}
            >
              {t.back}
            </button>
          )}
          <button className="button" type="submit" disabled={!ready}>
            {step === 2 ? t.prepare : t.next}
            <span aria-hidden="true"><Arrow dir="upRight" /></span>
          </button>
        </div>
      </form>
      {message && (
        <div className="message-preview">
          <p className="demo-note">{t.demoNotice}</p>
          <label className="field-label">
            {t.messageLabel}
            <textarea value={message} readOnly rows={12} />
          </label>
          <div className="form-actions">
            <button
              type="button"
              className="back-button"
              onClick={() => {
                setMessage("");
                setCopyStatus("");
              }}
            >
              {t.edit}
            </button>
            <button className="button" type="button" onClick={copy}>
              {t.copy}
            </button>
          </div>
          <p role="status">{copyStatus}</p>
          <small>{bookingConfig.displayNumber} · Demo</small>
        </div>
      )}
    </div>
  );
}
