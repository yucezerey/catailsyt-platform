import type { Metadata } from "next";
import { RaporSayfasiIstemci } from "@/components/rapor/RaporSayfasiIstemci";

export const metadata: Metadata = {
  title: "Rapor",
  description: "Yapay zekâ hazırlık raporun: boyut haritası, fark skoru ve yol haritası.",
  robots: { index: false, follow: false },
};

export default function RaporSayfasi() {
  return <RaporSayfasiIstemci />;
}
