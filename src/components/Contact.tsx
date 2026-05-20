import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { useConfigurator } from "@/lib/configurator/context";

export function Contact() {
  const t = useT();
  const { configuration, submissionToken } = useConfigurator();
  const [sent, setSent] = useState(false);
  const [prefilled, setPrefilled] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const interestRef = useRef<HTMLFieldSetElement | null>(null);

  // When the user clicks "Quote this configuration", the configurator bumps
  // submissionToken. We then prefill the form fields.
  useEffect(() => {
    if (submissionToken === 0) return;
    const productLabel = t.configurator.products[configuration.product];
    const opacityLabel = t.configurator.opacityNames[configuration.opacity];
    const fabricLabel = configuration.fabric.name;

    const summary = `${productLabel} · ${fabricLabel} · ${opacityLabel}`;
    const intro = t.configurator.contactPrefillIntro;
    const body = `${intro}\n\n• ${t.configurator.productLabel}: ${productLabel}\n• ${t.configurator.fabricLabel}: ${fabricLabel} (${configuration.fabric.hex.toUpperCase()})\n• ${t.configurator.opacityLabel}: ${opacityLabel}\n`;

    if (messageRef.current) {
      messageRef.current.value = body;
    }
    // Tick the matching interest checkbox.
    if (interestRef.current) {
      const inputs = interestRef.current.querySelectorAll<HTMLInputElement>("input[name='interest']");
      inputs.forEach((input) => {
        // Match by the visible label text — works in EN and BM because the
        // labels are pulled from the same dictionary.
        const wants = input.value.toLowerCase() === productLabel.toLowerCase();
        input.checked = wants;
      });
    }
    setPrefilled(true);
    // Stash a small summary chip above the form
    setLastSummary(summary);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionToken]);

  const [lastSummary, setLastSummary] = useState<string | null>(null);

  return (
    <section
      id="contact"
      className="relative py-24 lg:py-32 border-t border-[var(--color-line)] bg-[var(--color-ink)] text-[var(--color-cream)] overflow-hidden"
    >
      <div className="absolute inset-0 grain opacity-[0.12] pointer-events-none" />
      <div className="relative max-w-[1240px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="eyebrow !text-[var(--color-sand)]">{t.contact.eyebrow}</p>
            <h2 className="mt-5 font-serif text-[2.4rem] sm:text-[3rem] lg:text-[3.8rem] leading-[1.02] tracking-tightest text-[var(--color-cream)]">
              {t.contact.titleA} <span className="italic font-light text-[var(--color-clay-light)]">{t.contact.titleB}</span>
            </h2>
            <p className="mt-7 max-w-md text-[1.02rem] leading-[1.65] text-[var(--color-cream)]/75">
              {t.contact.intro}
            </p>
            <div className="mt-6 inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-[var(--color-cream)]/20 bg-white/[0.04]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-clay-light)]" />
              <span className="text-[0.82rem] tracking-tight text-[var(--color-cream)]/85">
                {t.contact.pricingChipA}{" "}
                <span className="text-[var(--color-clay-light)]">{t.contact.pricingChipB}</span>
              </span>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-y-6 gap-x-10 max-w-md text-[0.92rem]">
              <div>
                <dt className="text-[var(--color-sand)] text-[0.78rem] tracking-widest uppercase">{t.contact.studio}</dt>
                <dd className="mt-1 text-[var(--color-cream)]/85 leading-relaxed whitespace-pre-line">
                  {t.contact.studioAddr}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--color-sand)] text-[0.78rem] tracking-widest uppercase">{t.contact.direct}</dt>
                <dd className="mt-1 text-[var(--color-cream)]/85 leading-relaxed whitespace-pre-line">
                  {t.contact.directInfo}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--color-sand)] text-[0.78rem] tracking-widest uppercase">{t.contact.hours}</dt>
                <dd className="mt-1 text-[var(--color-cream)]/85 leading-relaxed whitespace-pre-line">
                  {t.contact.hoursInfo}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--color-sand)] text-[0.78rem] tracking-widest uppercase">{t.contact.service}</dt>
                <dd className="mt-1 text-[var(--color-cream)]/85 leading-relaxed whitespace-pre-line">
                  {t.contact.serviceInfo}
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-6 lg:pl-10 lg:border-l lg:border-[var(--color-cream)]/15">
            {sent ? (
              <div className="rounded-sm border border-[var(--color-cream)]/20 p-10 bg-[var(--color-cream)]/5">
                <p className="font-serif text-[1.8rem] leading-tight">{t.contact.sentTitle}</p>
                <p className="mt-4 text-[var(--color-cream)]/75 leading-relaxed max-w-sm">
                  {t.contact.sentBody}
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-6"
              >
                {/* Configuration summary chip (visible only after submit from configurator) */}
                {prefilled && lastSummary && (
                  <div className="flex items-start gap-3 rounded-md border border-[var(--color-clay-light)]/40 bg-[var(--color-clay)]/10 p-4">
                    <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-[var(--color-clay-light)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.72rem] tracking-widest uppercase text-[var(--color-sand)]">
                        {t.configurator.contactSummaryLabel}
                      </p>
                      <p className="mt-1 font-serif text-[1.1rem] text-[var(--color-cream)] leading-snug">
                        {lastSummary}
                      </p>
                    </div>
                    <a
                      href="#configurator"
                      className="shrink-0 text-[0.8rem] text-[var(--color-clay-light)] hover:text-[var(--color-cream)] transition-colors whitespace-nowrap"
                    >
                      {t.configurator.contactSummaryEdit} →
                    </a>
                  </div>
                )}

                <Field label={t.contact.nameLabel} name="name" placeholder={t.contact.namePh} />
                <Field label={t.contact.emailLabel} name="email" type="email" placeholder={t.contact.emailPh} />
                <Field label={t.contact.locationLabel} name="location" placeholder={t.contact.locationPh} />
                <div>
                  <label className="block text-[0.78rem] tracking-widest uppercase text-[var(--color-sand)] mb-2">
                    {t.contact.messageLabel}
                  </label>
                  <textarea
                    ref={messageRef}
                    name="message"
                    rows={6}
                    placeholder={t.contact.messagePh}
                    className="w-full bg-transparent border-b border-[var(--color-cream)]/25 focus:border-[var(--color-clay-light)] outline-none py-3 text-[0.98rem] text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/35 resize-none transition-colors"
                  />
                </div>
                <fieldset ref={interestRef} className="pt-2">
                  <legend className="block text-[0.78rem] tracking-widest uppercase text-[var(--color-sand)] mb-3">
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

                <button
                  type="submit"
                  className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-clay)] text-[var(--color-cream)] font-medium text-[0.92rem] hover:bg-[var(--color-clay-deep)] transition-colors"
                >
                  {t.contact.submit}
                  <span aria-hidden>→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[0.78rem] tracking-widest uppercase text-[var(--color-sand)] mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-[var(--color-cream)]/25 focus:border-[var(--color-clay-light)] outline-none py-3 text-[0.98rem] text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/35 transition-colors"
      />
    </div>
  );
}
