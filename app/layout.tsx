import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CatAIlsyt | AI Readiness Platform",
  description: "Beyaz tema, Apple estetiği ve kırmızı vurgu ile CatAIlsyt ürün önizlemesi",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full bg-white">{children}</body>
    </html>
  );
}
