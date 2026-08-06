/**
 * Analytics events.
 *
 * WhatsApp is the primary conversion action on this site (Malaysian
 * customers tap-to-chat rather than fill a form), so every WhatsApp entry
 * point reports a `whatsapp_click` event. The agency console counts leads
 * on that EXACT event name — renaming it silently zeroes the counter — and
 * the same name/category/label triple is used across all LeadZap client
 * sites so the numbers stay comparable.
 *
 * Everything here is best-effort and must NEVER interfere with the click:
 * the handlers below only ever send a beacon, never call preventDefault,
 * so if gtag/GTM is missing or blocked by an ad blocker the link still
 * navigates to WhatsApp exactly as before.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Fire the WhatsApp conversion event.
 *
 * Sent to both destinations so it works whichever tag is installed:
 *   - gtag.js (GA4) — the direct `event` command.
 *   - GTM — a dataLayer push, which gtag.js itself ignores (it only reads
 *     arguments-style commands), so this cannot double-count on a GA4-only
 *     install.
 *
 * The links are all `target="_blank"`, so the current document survives the
 * click and the beacon has time to leave — no navigation delay needed.
 */
export function trackWhatsAppClick() {
  try {
    window.gtag?.("event", "whatsapp_click", {
      event_category: "engagement",
      event_label: "whatsapp_button",
    });

    window.dataLayer?.push({
      event: "whatsapp_click",
      event_category: "engagement",
      event_label: "whatsapp_button",
    });
  } catch {
    // Analytics must never break the outbound link.
  }
}
