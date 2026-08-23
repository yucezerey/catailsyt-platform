import type { Metadata } from "next";
import { OlcumAkisi } from "@/components/olcum/OlcumAkisi";

export const metadata: Metadata = {
  title: "Ölçüm",
  description:
    "Yapay zekâ hazırlığını ölç. Kayıt gerekmez; sekmeyi kapatsan da kaldığın yerden devam eder.",
  robots: { index: false, follow: true },
};

export default function OlcumSayfasi() {
  return <OlcumAkisi />;
}
