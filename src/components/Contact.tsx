import { useState } from "react";
import { useT } from "@/lib/i18n";

export function Contact() {
  const t = useT();
  const [sent, setSent] = useState(false);

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
                <Field label={t.contact.nameLabel} name="name" placeholder={t.contact.namePh} />
                <Field label={t.contact.emailLabel} name="email" type="email" placeholder={t.contact.emailPh} />
                <Field label={t.contact.locationLabel} name="location" placeholder={t.contact.locationPh} />
                <div>
                  <label className="block text-[0.78rem] tracking-widest uppercase text-[var(--color-sand)] mb-2">
                    {t.contact.messageLabel}
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder={t.contact.messagePh}
                    className="w-full bg-transparent border-b border-[var(--color-cream)]/25 focus:border-[var(--color-clay)] outline-none py-3 text-[0.98rem] text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/35 resize-none transition-colors"
                  />
                </div>
                <fieldset className="pt-2">
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
        className="w-full bg-transparent border-b border-[var(--color-cream)]/25 focus:border-[var(--color-clay)] outline-none py-3 text-[0.98rem] text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/35 transition-colors"
      />
    </div>
  );
}
