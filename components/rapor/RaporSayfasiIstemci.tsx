"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MARKA } from "@/lib/marka";
import { raporOku } from "@/lib/depolama";
import { raporUret, type Rapor } from "@/lib/rapor";
import { Buton, Kart } from "@/components/ui/temel";
import { TemaAnahtari } from "@/components/ui/TemaAnahtari";
import { RaporGorunumu } from "./RaporGorunumu";

export function RaporSayfasiIstemci() {
  const [durum, setDurum] = useState<"yukleniyor" | "hazir" | "yok">("yukleniyor");
  const [rapor, setRapor] = useState<Rapor | null>(null);

  /* localStorage bir dış sistem; mount'ta bir kez okunur. Bu effect kasıtlı olarak
     durum yazar — sunucuda olmayan veriyi hidrasyondan sonra almanın tek yolu bu. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const oturum = raporOku();
    if (!oturum || oturum.soruIdleri.length === 0) {
      setDurum("yok");
      return;
    }
    try {
      setRapor(raporUret(oturum));
      setDurum("hazir");
    } catch {
      setDurum("yok");
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (durum === "yukleniyor") {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <p className="text-sm text-[var(--ink-3)]">Rapor hazırlanıyor…</p>
      </main>
    );
  }

  if (durum === "yok" || !rapor) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-10">
        <Kart className="p-6">
          <h1 className="text-xl font-semibold text-[var(--ink-1)]">Görüntülenecek rapor yok</h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-2)]">
            Raporlar bu tarayıcıda saklanır. Tarayıcı verisini temizlediysen veya başka bir cihazda
            açtıysan yeniden ölçüm yapman gerekiyor.
          </p>
          <div className="mt-5">
            <Link href="/olcum">
              <Buton>Ölçüme başla</Buton>
            </Link>
          </div>
        </Kart>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-0)]">
      <header className="no-print sticky top-0 z-20 border-b border-[var(--line-1)] bg-[var(--surface-0)]/92 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <Link href="/" className="text-sm font-semibold tracking-tight text-[var(--ink-1)]">
            {MARKA.ad}
          </Link>
          <TemaAnahtari />
        </div>
      </header>
      <main id="icerik">
        <RaporGorunumu rapor={rapor} />
      </main>
    </div>
  );
}
