/**
 * Floating WhatsApp button — fixed bottom-right on every page. Malaysian
 * customers reach for WhatsApp first, so a persistent tap-to-chat is the
 * single highest-converting contact affordance on the site.
 *
 * Links to wa.me with a pre-filled enquiry message. Brand-green so it reads
 * as WhatsApp instantly, but sized/positioned to sit below the sticky quote
 * bar without colliding.
 */
import { trackWhatsAppClick } from "@/lib/analytics";

const WA_NUMBER = "60179778289";
const WA_PREFILL = encodeURIComponent(
  "Hi Kova Sun Shade, I'd like a quote for blinds.",
);

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=${WA_PREFILL}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackWhatsAppClick}
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 active:scale-95"
    >
      <svg viewBox="0 0 24 24" width="30" height="30" fill="#fff" aria-hidden>
        <path d="M17.47 14.38c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.29-.74.94-.9 1.13-.17.19-.33.21-.62.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.72-1.6-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.64-1.55-.88-2.12-.23-.56-.47-.48-.64-.49l-.55-.01c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38s1.02 2.76 1.17 2.95c.14.19 2.01 3.08 4.88 4.32.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z" />
      </svg>
    </a>
  );
}
