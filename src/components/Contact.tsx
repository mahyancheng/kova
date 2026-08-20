import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useT, useLang } from "@/lib/i18n";
import { useConfigurator } from "@/lib/configurator/context";
import { useRoutes } from "@/lib/routes";
import { submitLead } from "@/lib/leads";
import { trackWhatsAppClick } from "@/lib/analytics";

export function Contact() {
  const t = useT();
  const r = useRoutes();
  const { configuration, submissionToken } = useConfigurator();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [prefilled, setPrefilled] = useState(false);
  const [lastSummary, setLastSummary] = useState<string | null>(null);

  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const interestRef = useRef<HTMLFieldSetElement | null>(null);
  const { lang } = useLang();

  useEffect(() => {
    if (submissionToken === 0) return;
    const productLabel = t.configurator.products[configuration.product];
    const fabricLabel = configuration.fabric.name;

    const summary = `${productLabel} · ${fabricLabel}`;
    const intro = t.configurator.contactPrefillIntro;
    const body = `${intro}\n• ${t.configurator.productLabel}: ${productLabel}\n• ${t.configurator.fabricLabel}: ${fabricLabel} (${configuration.fabric.hex.toUpperCase()})`;

    if (messageRef.current) {
      messageRef.current.value = body;
    }
    if (interestRef.current) {
      const inputs = interestRef.current.querySelectorAll<HTMLInputElement>("input[name='interest']");
      inputs.forEach((input) => {
        input.checked = input.value.toLowerCase() === productLabel.toLowerCase();
      });
    }
    setPrefilled(true);
    setLastSummary(summary);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionToken]);

  // 提交表单：走统一的 submitLead() 管道（Google Sheet + Supabase 双写），
  // 外加蜜罐字段和 60 秒冷却期这两个轻量防刷措施。
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const data = new FormData(form);

    // 蜜罐：机器人才会填这个隐藏字段，人类看不到它。填了就假装成功、直接拦截。
    if (data.get("website")) {
      setSent(true);
      return;
    }

    // 前端冷却期，避免手滑连点或简单重放（真正的防刷仍需服务端限流）。
    const lastSubmitTime = localStorage.getItem("lastContactSubmit");
    if (lastSubmitTime && Date.now() - parseInt(lastSubmitTime, 10) < 60_000) {
      alert(lang === "ms" ? "Sila tunggu seminit sebelum menghantar lagi." : "Please wait a minute before sending again.");
      return;
    }

    const interests = data
      .getAll("interest")
      .map((v) => String(v))
      .join(", ");

    setSubmitting(true);
    // Fire the lead to the agency Supabase, then always thank the
    // visitor (submitLead never throws — it stashes on failure).
    submitLead({
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      location: String(data.get("location") || ""),
      message: String(data.get("message") || ""),
      interest: interests,
      configSummary: lastSummary,
      lang,
    }).finally(() => {
      localStorage.setItem("lastContactSubmit", Date.now().toString());
      setSubmitting(false);
      setSent(true);
    });
  };

  return (
    <section
      id="contact"
      className="relative py-16 lg:py-20 border-t border-[var(--color-line)] bg-[var(--color-ink)] text-[var(--color-cream)] overflow-hidden"
    >
      <div className="absolute inset-0 grain opacity-[0.12] pointer-events-none" />

      <div className="relative max-w-[1240px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-16 lg:items-start">
          {/* HEADING */}
          <div className="lg:col-span-6 lg:row-start-1 lg:col-start-1">
            <p className="eyebrow !text-[var(--color-sand)]">{t.contact.eyebrow}</p>
            <h1 className="mt-4 font-serif text-[2.2rem] sm:text-[2.6rem] lg:text-[3.2rem] leading-[1.04] tracking-tightest text-[var(--color-cream)]">
              {t.contact.titleA}{" "}
              <span className="italic font-light text-[var(--color-clay-light)]">{t.contact.titleB}</span>
            </h1>
            <p className="mt-5 max-w-md text-[0.98rem] sm:text-[1rem] leading-[1.6] text-[var(--color-cream)]/75">
              {t.contact.intro}
            </p>
            <div className="mt-5 inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-[var(--color-cream)]/20 bg-white/[0.04]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-clay-light)]" />
              <span className="text-[0.82rem] tracking-tight text-[var(--color-cream)]/85">
                {t.contact.pricingChipA}{" "}
                <span className="text-[var(--color-clay-light)]">{t.contact.pricingChipB}</span>
              </span>
            </div>
          </div>

          {/* FORM */}
          <div className="row-start-2 lg:row-start-1 lg:row-span-2 lg:col-start-7 lg:col-span-6 lg:pl-10 lg:border-l lg:border-[var(--color-cream)]/15">
            {sent ? (
              <div className="rounded-md border border-[var(--color-cream)]/20 p-8 bg-[var(--color-cream)]/5">
                <p className="font-serif text-[1.6rem] sm:text-[1.8rem] leading-tight">{t.contact.sentTitle}</p>
                <p className="mt-4 text-[var(--color-cream)]/75 leading-relaxed max-w-sm">
                  {t.contact.sentBody}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* 防垃圾邮件的隐藏蜜罐字段：机器人才会填，人类看不到也摸不到 */}
                <div style={{ display: "none" }} aria-hidden="true">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                {/* Configuration summary chip */}
                {prefilled && lastSummary && (
                  <div className="mb-5 flex items-start gap-3 rounded-md border border-[var(--color-clay-light)]/40 bg-[var(--color-clay)]/10 p-3.5">
                    <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-[var(--color-clay-light)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.68rem] tracking-widest uppercase text-[var(--color-sand)]">
                        {t.configurator.contactSummaryLabel}
                      </p>
                      <p className="mt-0.5 font-serif text-[1rem] text-[var(--color-cream)] leading-snug">
                        {lastSummary}
                      </p>
                    </div>
                    <Link
                      to={r.configurator}
                      className="shrink-0 text-[0.78rem] text-[var(--color-clay-light)] hover:text-[var(--color-cream)] transition-colors whitespace-nowrap"
                    >
                      {t.configurator.contactSummaryEdit} →
                    </Link>
                  </div>
                )}

                {/* Essentials — Name + Phone live large at the top, easy to reach */}
                <div className="grid grid-cols-1 gap-y-4">
                  <Field
                    label={t.contact.nameLabel}
                    name="name"
                    placeholder={t.contact.namePh}
                    required
                  />
                  <Field
                    label={t.contact.phoneLabel}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    placeholder={t.contact.phonePh}
                    hint={t.contact.phoneHint}
                    required
                    primary
                  />
                </div>

                {/* Secondary contact fields — paired so they don't dominate the form */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                  <Field
                    label={t.contact.emailLabel}
                    optionalLabel={t.contact.emailOptional}
                    name="email"
                    type="email"
                    placeholder={t.contact.emailPh}
                  />
                  <Field
                    label={t.contact.locationLabel}
                    name="location"
                    placeholder={t.contact.locationPh}
                  />
                </div>

                {/* Message */}
                <div className="mt-5">
                  <label className="block text-[0.74rem] tracking-widest uppercase text-[var(--color-sand)] mb-2">
                    {t.contact.messageLabel}
                  </label>
                  <textarea
                    ref={messageRef}
                    name="message"
                    rows={3}
                    placeholder={t.contact.messagePh}
                    className="w-full bg-transparent border-b border-[var(--color-cream)]/25 focus:border-[var(--color-clay-light)] outline-none py-2 text-[0.95rem] text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/35 resize-none transition-colors"
                  />
                </div>

                {/* Interest */}
                <fieldset ref={interestRef} className="mt-5">
                  <legend className="block text-[0.74rem] tracking-widest uppercase text-[var(--color-sand)] mb-2">
                    {t.contact.interestLabel}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {t.contact.interests.map((option) => (
                      <label
                        key={option}
                        className="cursor-pointer px-3 py-1.5 rounded-full border border-[var(--color-cream)]/25 text-[0.84rem] text-[var(--color-cream)]/85 hover:bg-[var(--color-cream)]/10 has-[:checked]:bg-[var(--color-clay)] has-[:checked]:border-[var(--color-clay)] has-[:checked]:text-[var(--color-cream)] transition-colors"
                      >
                        <input type="checkbox" name="interest" value={option} className="sr-only" />
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Submit */}
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 rounded-full bg-[var(--color-clay)] text-[var(--color-cream)] font-medium text-[0.95rem] sm:text-[0.92rem] hover:bg-[var(--color-clay-deep)] active:bg-[var(--color-clay-deep)] transition-colors disabled:opacity-60 disabled:cursor-wait"
                  >
                    {submitting ? t.contact.submitting : t.contact.submit}
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* STUDIO INFO — mobile row 3 / desktop col 1 row 2 */}
          <div className="row-start-3 lg:row-start-2 lg:col-start-1 lg:col-span-6">
            <p className="eyebrow !text-[var(--color-sand)] mb-5 lg:mb-6">
              {t.contact.studio} · {t.contact.direct}
            </p>
            <dl className="grid grid-cols-2 gap-y-5 gap-x-8 max-w-md text-[0.92rem]">
              <div>
                <dt className="text-[var(--color-sand)] text-[0.7rem] tracking-widest uppercase">
                  {t.contact.studio}
                </dt>
                <dd className="mt-1 text-[var(--color-cream)]/85 leading-relaxed whitespace-pre-line">
                  {t.contact.studioAddr}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--color-sand)] text-[0.7rem] tracking-widest uppercase">
                  {t.contact.direct}
                </dt>
                <dd className="mt-1 text-[var(--color-cream)]/85 leading-relaxed flex flex-col gap-0.5">
                  <a
                    href="mailto:info@kovasunshade.com"
                    className="hover:text-[var(--color-clay-light)] transition-colors break-all"
                  >
                    info@kovasunshade.com
                  </a>
                  <a
                    href="https://wa.me/60179778289"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackWhatsAppClick}
                    className="inline-flex items-center gap-1.5 hover:text-[var(--color-clay-light)] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden className="shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741 1.031 1.001-3.617-.235-.373a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.438 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
                    </svg>
                    +60 17-977 8289
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[var(--color-sand)] text-[0.7rem] tracking-widest uppercase">
                  {t.contact.hours}
                </dt>
                <dd className="mt-1 text-[var(--color-cream)]/85 leading-relaxed whitespace-pre-line">
                  {t.contact.hoursInfo}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--color-sand)] text-[0.7rem] tracking-widest uppercase">
                  {t.contact.service}
                </dt>
                <dd className="mt-1 text-[var(--color-cream)]/85 leading-relaxed whitespace-pre-line">
                  {t.contact.serviceInfo}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  optionalLabel,
  hint,
  name,
  type = "text",
  inputMode,
  placeholder,
  required,
  primary,
}: {
  label: string;
  optionalLabel?: string;
  hint?: string;
  name: string;
  type?: string;
  inputMode?: "text" | "tel" | "email" | "search" | "numeric" | "decimal";
  placeholder?: string;
  required?: boolean;
  primary?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={name}
          className="block text-[0.74rem] tracking-widest uppercase text-[var(--color-sand)]"
        >
          {label}
          {primary && (
            <span
              className="ml-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-clay-light)] align-middle"
              aria-hidden
            />
          )}
        </label>
        {optionalLabel && (
          <span className="text-[0.7rem] tracking-tight text-[var(--color-cream)]/45 lowercase">
            {optionalLabel}
          </span>
        )}
      </div>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        required={required}
        className="mt-1.5 w-full bg-transparent border-b border-[var(--color-cream)]/25 focus:border-[var(--color-clay-light)] outline-none py-2.5 text-[1rem] sm:text-[0.98rem] text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/35 transition-colors"
      />
      {hint && (
        <p className="mt-1.5 text-[0.74rem] text-[var(--color-cream)]/55 leading-snug">{hint}</p>
      )}
    </div>
  );
}