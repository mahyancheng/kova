/// <reference types="vite/client" />
declare module "*.css";

interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  ttq?: {
    page: (...args: unknown[]) => void;
    track: (...args: unknown[]) => void;
    identify: (...args: unknown[]) => void;
    instances: (...args: unknown[]) => void;
    debug: (...args: unknown[]) => void;
    on: (...args: unknown[]) => void;
    off: (...args: unknown[]) => void;
    once: (...args: unknown[]) => void;
    ready: (...args: unknown[]) => void;
    alias: (...args: unknown[]) => void;
    group: (...args: unknown[]) => void;
    enableCookie: (...args: unknown[]) => void;
    disableCookie: (...args: unknown[]) => void;
    holdConsent: (...args: unknown[]) => void;
    revokeConsent: (...args: unknown[]) => void;
    grantConsent: (...args: unknown[]) => void;
    load: (pixelId: string, options?: Record<string, unknown>) => void;
    [key: string]: unknown;
  };
}
