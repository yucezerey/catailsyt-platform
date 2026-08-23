import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { MARKA } from "@/lib/marka";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${MARKA.ad} — Yapay Zekâ Hazırlık Ölçümü`,
    template: `%s · ${MARKA.ad}`,
  },
  description: MARKA.aciklama,
  applicationName: MARKA.ad,
  openGraph: {
    title: MARKA.tamAd,
    description: MARKA.aciklama,
    locale: "tr_TR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1216" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Tema seçimini boyamadan önce uygula — yanıp sönmeyi engeller */
const TEMA_SCRIPTI = `try{var t=localStorage.getItem('catailyst:tema');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: TEMA_SCRIPTI }} />
      </head>
      <body>
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--accent-contrast)]"
        >
          İçeriğe geç
        </a>
        {children}
      </body>
    </html>
  );
}
