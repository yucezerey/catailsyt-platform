"use client";

import type { FarkSkoru } from "@/lib/skorlama";
import { Etiket } from "@/components/ui/temel";

/**
 * Yatay eksen: ölçülen bilgi (solda düşük, sağda yüksek)
 * Dikey eksen: kendine verilen not (yukarıda yüksek, aşağıda düşük)
 */
const HUCRELER = [
  {
    profil: "asiri-guven",
    baslik: "Aşırı güven",
    aciklama: "En riskli grup",
    konum: "col-start-1 row-start-1",
  },
  {
    profil: "kalibre-yetkin",
    baslik: "Kalibre yetkin",
    aciklama: "Çoğaltıcı profil",
    konum: "col-start-2 row-start-1",
  },
  {
    profil: "kalibre-acemi",
    baslik: "Kalibre acemi",
    aciklama: "Temiz başlangıç",
    konum: "col-start-1 row-start-2",
  },
  {
    profil: "yetersiz-guven",
    baslik: "Yetersiz güven",
    aciklama: "Bilgi var, cesaret yok",
    konum: "col-start-2 row-start-2",
  },
] as const;

export function FarkMatrisi({ fark }: { fark: FarkSkoru }) {
  const risk = fark.risk === "yuksek" ? "kritik" : fark.risk === "orta" ? "uyari" : "basari";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-semibold text-[var(--ink-1)]">{fark.baslik}</h3>
          <Etiket ton={risk}>
            {fark.risk === "yuksek" ? "Yüksek risk" : fark.risk === "orta" ? "Orta risk" : "Düşük risk"}
          </Etiket>
        </div>

        <div className="mt-4 flex flex-wrap gap-6">
          <Sayi etiket="Kendini gördüğün yer" deger={fark.oznel} ton="notr" />
          <Sayi etiket="Ölçümün gösterdiği" deger={fark.nesnel} ton="vurgu" />
          <Sayi
            etiket="Fark"
            deger={fark.fark}
            ton={Math.abs(fark.fark) > 12 ? "kritik" : "notr"}
            isaretli
          />
        </div>

        <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-2)]">{fark.yorum}</p>
        <p className="mt-3 rounded-[var(--radius-field)] border border-[var(--accent-line)] bg-[var(--accent-soft)] px-4 py-3 text-sm font-medium text-[var(--accent-ink)]">
          Ne yapmalı: {fark.aksiyon}
        </p>
      </div>

      <div>
        <div className="grid grid-cols-2 grid-rows-2 gap-1.5 text-xs">
          {HUCRELER.map((hucre) => {
            const aktif = hucre.profil === fark.profil;
            return (
              <div
                key={hucre.profil}
                className={`flex min-h-[92px] flex-col justify-center rounded-[var(--radius-field)] border p-3 ${hucre.konum} ${
                  aktif
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : "border-[var(--line-1)] bg-[var(--surface-1)]"
                }`}
              >
                <p
                  className={`font-semibold ${aktif ? "text-[var(--accent-ink)]" : "text-[var(--ink-3)]"}`}
                >
                  {hucre.baslik}
                </p>
                <p className={aktif ? "text-[var(--accent-ink)]" : "text-[var(--ink-3)]"}>
                  {hucre.aciklama}
                </p>
                {aktif && (
                  <p className="mt-1 font-semibold text-[var(--accent)]">← buradasın</p>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-2 space-y-0.5 text-[11px] text-[var(--ink-3)]">
          <p>Soldan sağa: ölçülen bilgi artıyor</p>
          <p>Aşağıdan yukarı: kendine verdiğin not artıyor</p>
        </div>
      </div>
    </div>
  );
}

function Sayi({
  etiket,
  deger,
  ton,
  isaretli = false,
}: {
  etiket: string;
  deger: number;
  ton: "notr" | "vurgu" | "kritik";
  isaretli?: boolean;
}) {
  const renk =
    ton === "vurgu"
      ? "text-[var(--accent)]"
      : ton === "kritik"
        ? "text-[var(--critical)]"
        : "text-[var(--ink-1)]";
  const gosterim = isaretli
    ? `${deger > 0 ? "+" : ""}${deger.toFixed(0)}`
    : `%${deger.toFixed(0)}`;

  return (
    <div>
      <p className="text-xs text-[var(--ink-3)]">{etiket}</p>
      <p className={`text-2xl font-bold tabular-nums ${renk}`}>{gosterim}</p>
    </div>
  );
}
