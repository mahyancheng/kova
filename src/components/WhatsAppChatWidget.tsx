// src/components/WhatsAppChatWidget.tsx
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { trackWhatsAppClick } from "@/lib/analytics";

/**
 * Official WhatsApp glyph (Simple Icons brand mark) — replaces the earlier
 * hand-approximated phone-handset path so the badge reads as the real
 * WhatsApp logo instead of a rough lookalike.
 */
function WhatsAppLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741 1.031 1.001-3.617-.235-.373a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.438 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  );
}

type Props = {
  phoneE164: string; // 例如马来西亚号码 60123456789（不要加 +）
  defaultMessage?: string;
};

export default function WhatsAppChatWidget({
  phoneE164,
  // 1. 修改默认的输入框预设文字，贴合窗帘咨询
  defaultMessage = "Hi KOVA, I would like to get more information about your window blinds.",
}: Props) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(defaultMessage);
  const [mounted, setMounted] = useState(false);

  // 确保只在客户端渲染，防止 SSG 打包时报错
  useEffect(() => setMounted(true), []);

  const waUrl = useMemo(
    () => `https://wa.me/${phoneE164}?text=${encodeURIComponent(msg)}`,
    [phoneE164, msg]
  );

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-5 right-5 z-[9999]">
      {open && (
        <div className="absolute bottom-full right-0 mb-3 w-[320px] rounded-2xl shadow-2xl border bg-white overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-[#25D366] text-white flex justify-between items-center">
            <div>
              {/* 2. 修改品牌名称 */}
              <div className="text-sm font-semibold">KOVA Sunshade</div>
              {/* 3. 修改副标题 */}
              <div className="text-xs opacity-90">Customer Support • Typically replies fast</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/20"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            {/* 4. 修改客服的开场欢迎语 */}
            <div className="mb-3 text-sm bg-gray-100 rounded-xl px-3 py-2 inline-block">
              Hi 👋 Looking for the perfect blinds for your home? How can we help you today?
            </div>

            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              rows={3}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#25D366]/40"
            />

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackWhatsAppClick}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white py-2.5 text-sm font-semibold hover:opacity-90"
            >
              Continue on WhatsApp
            </a>

            <div className="mt-2 text-[11px] text-gray-400">
              Opens WhatsApp Web / App
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="h-14 w-14 rounded-full bg-[#25D366] text-white shadow-xl grid place-items-center hover:opacity-90"
        aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
      >
        <WhatsAppLogo size={30} />
      </button>
    </div>,
    document.body
  );
}