"use client";

import { useState } from "react";
import Link from "next/link";
import type { Rapor } from "@/lib/rapor";
import { bolumKisaAd } from "@/lib/rapor";
import { BOLUM_ONERILERI } from "@/lib/skorlama";
import { Buton, Etiket, Kart, OlcuCubugu } from "@/components/ui/temel";
import { RadarGrafik } from "./RadarGrafik";
import { FarkMatrisi } from "./FarkMatrisi";

export function RaporGorunumu({ rapor }: { rapor: Rapor }) {
  const [pdfYukleniyor, setPdfYukleniyor] = useState(false);
  const [docxYukleniyor, setDocxYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  const pdfIndirTikla = async () => {
    setHata(null);
    setPdfYukleniyor(true);
    try {
      const { pdfIndir } = await import("@/lib/disa-aktar/pdf");
      await pdfIndir(rapor);
    } catch {
      setHata("PDF oluşturulamadı. Sayfayı yenileyip tekrar dene.");
    } finally {
      setPdfYukleniyor(false);
    }
  };

  const docxIndirTikla = async () => {
    setHata(null);
    setDocxYukleniyor(true);
    try {
      const { docxIndir } = await import("@/lib/disa-aktar/docx");
      await docxIndir(rapor);
    } catch {
      setHata("DOCX oluşturulamadı. Sayfayı yenileyip tekrar dene.");
    } finally {
      setDocxYukleniyor(false);
    }
  };

  const radarEksenleri = rapor.bolumler.map((bolum) => ({
    etiket: bolumKisaAd(bolum.bolum),
    deger: bolum.yuzde,
  }));

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10 md:px-8">
      {/* Skor kahramanı */}
      <header className="cat-enter">
        <div className="flex flex-wrap items-center gap-2">
          <Etiket ton="vurgu">{rapor.modEtiketi}</Etiket>
          <Etiket>{rapor.paketEtiketi}</Etiket>
          {!rapor.veriKalitesi.guvenilir && <Etiket ton="uyari">Düşük güven</Etiket>}
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ink-1)] md:text-4xl">
          {rapor.mod === "corporate" && rapor.kurum ? rapor.kurum : "Hazırlık raporun"}
        </h1>

        <div className="mt-6 grid gap-6 rounded-[var(--radius-card)] border border-[var(--accent-line)] bg-[var(--accent-soft)] p-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-ink)]">
              Genel skor
            </p>
            <p className="text-6xl font-bold tabular-nums leading-none text-[var(--accent)]">
              %{rapor.genelSkor.toFixed(0)}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold text-[var(--ink-1)]">{rapor.bant.etiket}</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--ink-2)]">{rapor.bant.anlam}</p>
            <p className="mt-3 text-sm font-medium text-[var(--accent-ink)]">
              Öncelik: {rapor.bant.oncelik}
            </p>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <Kunye baslik="Yanıtlanan" deger={`${rapor.cevaplananSayisi}/${rapor.soruSayisi}`} />
          <Kunye baslik="Süre" deger={`${rapor.gecenSureDk} dk`} />
          <Kunye baslik="Tarih" deger={rapor.uretimTarihi.split(" ")[0]} />
          <Kunye baslik="Rapor no" deger={rapor.id} />
        </dl>

        {rapor.baglamOzeti.length > 0 && (
          <p className="mt-3 text-xs text-[var(--ink-3)]">
            {rapor.baglamOzeti.map((b) => `${b.etiket}: ${b.deger}`).join("  ·  ")}
          </p>
        )}
      </header>

      {/* Fark skoru — ürünün ayrışma noktası, en üstte */}
      {rapor.fark && (
        <Bolum baslik="Fark skoru" altBaslik="Algı ile ölçüm arasındaki açıklık">
          <Kart className="p-6">
            <FarkMatrisi fark={rapor.fark} />
            <p className="mt-5 border-t border-[var(--line-1)] pt-4 text-xs leading-relaxed text-[var(--ink-3)]">
              Neden önemli: 514 kişilik bir çalışmada, insanların yapay zekâ bilgisine dair
              öz-değerlendirmesi ile nesnel test sonucu arasındaki korelasyon r = .02 çıktı.
              İstatistiksel olarak sıfır. &ldquo;Biliyorum&rdquo; hissi, gerçekte ne bildiğini
              öngörmüyor — ölçtüğü şey yetkinlik değil, özgüven.
            </p>
          </Kart>
        </Bolum>
      )}

      {/* Radar + boyutlar */}
      <Bolum baslik="Boyut haritası" altBaslik="Hangi alanda güçlüsün, hangisinde açık var">
        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <Kart className="p-5">
            <RadarGrafik eksenler={radarEksenleri} />
          </Kart>

          <div className="space-y-2.5">
            {rapor.bolumler.map((bolum) => (
              <Kart key={bolum.bolum} className="p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink-1)]">{bolum.baslik}</p>
                    <p className="text-xs text-[var(--ink-3)]">
                      {bolum.bolum} · {bolum.alan} · {bolum.cevaplanan}/{bolum.toplam} madde
                    </p>
                  </div>
                  <span className="text-lg font-bold tabular-nums text-[var(--accent)]">
                    %{bolum.yuzde.toFixed(0)}
                  </span>
                </div>
                <div className="mt-3">
                  <OlcuCubugu yuzde={bolum.yuzde} etiket={`${bolum.baslik} skoru`} ince />
                </div>
              </Kart>
            ))}
          </div>
        </div>
      </Bolum>

      {/* Güçlü / zayıf */}
      <Bolum baslik="Nereden başlamalı" altBaslik="En düşük iki boyut, yol haritasının çıkış noktası">
        <div className="grid gap-4 md:grid-cols-2">
          <Kart yumusak className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--success)]">
              Güçlü yanların
            </p>
            <ul className="mt-3 space-y-2">
              {rapor.gucluAlanlar.map((bolum) => (
                <li key={bolum.bolum} className="text-sm text-[var(--ink-2)]">
                  <span className="font-medium text-[var(--ink-1)]">{bolum.baslik}</span>{" "}
                  <span className="tabular-nums text-[var(--ink-3)]">
                    %{bolum.yuzde.toFixed(0)}
                  </span>
                </li>
              ))}
            </ul>
          </Kart>

          <Kart yumusak className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--critical)]">
              Gelişim alanların
            </p>
            <ul className="mt-3 space-y-3">
              {rapor.zayifAlanlar.map((bolum) => {
                const oneri = BOLUM_ONERILERI[bolum.bolum]?.acil[0];
                return (
                  <li key={bolum.bolum} className="text-sm text-[var(--ink-2)]">
                    <span className="font-medium text-[var(--ink-1)]">{bolum.baslik}</span>{" "}
                    <span className="tabular-nums text-[var(--ink-3)]">
                      %{bolum.yuzde.toFixed(0)}
                    </span>
                    {oneri && <p className="mt-1 text-xs text-[var(--ink-3)]">{oneri}</p>}
                  </li>
                );
              })}
            </ul>
          </Kart>
        </div>
      </Bolum>

      {/* Çerçeveler */}
      <Bolum
        baslik="Küresel çerçeve uyumu"
        altBaslik="NIST AI RMF, ISO/IEC 42001, OECD ve EU AI Act karşılığın"
      >
        <div className="space-y-3">
          {rapor.cerceveler.map((cerceve) => (
            <details
              key={cerceve.ad}
              className="group rounded-[var(--radius-card)] border border-[var(--line-1)] bg-[var(--surface-0)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--ink-1)]">{cerceve.ad}</p>
                  <p className="mt-0.5 text-xs text-[var(--ink-3)]">{cerceve.durum}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold tabular-nums text-[var(--accent)]">
                    %{cerceve.genel.toFixed(0)}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-[var(--ink-3)] transition-transform group-open:rotate-180"
                  >
                    ▾
                  </span>
                </div>
              </summary>

              <div className="border-t border-[var(--line-1)] p-4 pt-3">
                <p className="text-xs text-[var(--ink-3)]">{cerceve.amac}</p>
                <div className="mt-3 space-y-3">
                  {cerceve.boyutlar.map((boyut) => (
                    <div key={boyut.baslik}>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="font-medium text-[var(--ink-1)]">{boyut.baslik}</span>
                        <span className="tabular-nums text-[var(--ink-2)]">
                          %{boyut.skor.toFixed(0)} · {boyut.bant}
                        </span>
                      </div>
                      <div className="mt-1.5">
                        <OlcuCubugu yuzde={boyut.skor} etiket={`${boyut.baslik} skoru`} ince />
                      </div>
                      <p className="mt-1.5 text-xs text-[var(--ink-3)]">{boyut.rehber}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-1 border-t border-[var(--line-1)] pt-3">
                  {cerceve.kaynaklar.map((kaynak) => (
                    <a
                      key={kaynak}
                      href={kaynak}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-[11px] text-[var(--ink-3)] underline decoration-[var(--line-2)] underline-offset-2 hover:text-[var(--accent)]"
                    >
                      {kaynak}
                    </a>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </Bolum>

      {/* Yol haritası */}
      <Bolum baslik="Yol haritası" altBaslik="En düşük boyutlardan türetilen somut adımlar">
        <div className="grid gap-4 md:grid-cols-3">
          <PlanKarti baslik="İlk 30 gün" maddeler={rapor.aksiyonPlani.otuzGun} vurgulu />
          <PlanKarti baslik="60-90 gün" maddeler={rapor.aksiyonPlani.ceyrek} />
          <PlanKarti baslik="0-6 ay" maddeler={rapor.aksiyonPlani.yariYil} />
        </div>
      </Bolum>

      {/* Yöntem */}
      <Bolum baslik="Yöntem ve sınırlar" altBaslik="Sınırını yazan rapor, yazmayandan güvenilirdir">
        <Kart yumusak className="p-5">
          <ul className="space-y-2 text-sm leading-relaxed text-[var(--ink-2)]">
            {rapor.yontemNotu.map((not) => (
              <li key={not} className="flex gap-2">
                <span aria-hidden="true" className="text-[var(--ink-3)]">
                  —
                </span>
                <span>{not}</span>
              </li>
            ))}
          </ul>
        </Kart>
      </Bolum>

      {/* Aksiyonlar */}
      <div className="no-print mt-10 border-t border-[var(--line-1)] pt-6">
        {hata && (
          <p
            role="alert"
            className="mb-4 rounded-[var(--radius-field)] border border-[var(--critical)] bg-[var(--critical-soft)] px-4 py-3 text-sm text-[var(--critical)]"
          >
            {hata}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <Buton onClick={pdfIndirTikla} disabled={pdfYukleniyor} varyant="koyu">
            {pdfYukleniyor ? "PDF hazırlanıyor…" : "PDF indir"}
          </Buton>
          <Buton onClick={docxIndirTikla} disabled={docxYukleniyor} varyant="ikincil">
            {docxYukleniyor ? "DOCX hazırlanıyor…" : "DOCX indir"}
          </Buton>
          <Buton varyant="sessiz" onClick={() => window.print()}>
            Yazdır
          </Buton>
          <Link
            href="/olcum"
            className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
          >
            Yeniden ölç
          </Link>
        </div>
      </div>
    </div>
  );
}

function Bolum({
  baslik,
  altBaslik,
  children,
}: {
  baslik: string;
  altBaslik: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--ink-1)]">{baslik}</h2>
      <p className="mb-4 mt-1 text-sm text-[var(--ink-3)]">{altBaslik}</p>
      {children}
    </section>
  );
}

function Kunye({ baslik, deger }: { baslik: string; deger: string }) {
  return (
    <div className="rounded-[var(--radius-field)] border border-[var(--line-1)] px-3 py-2">
      <dt className="text-[11px] text-[var(--ink-3)]">{baslik}</dt>
      <dd className="text-sm font-semibold tabular-nums text-[var(--ink-1)]">{deger}</dd>
    </div>
  );
}

function PlanKarti({
  baslik,
  maddeler,
  vurgulu = false,
}: {
  baslik: string;
  maddeler: string[];
  vurgulu?: boolean;
}) {
  if (!maddeler.length) return null;
  return (
    <Kart
      className={`p-5 ${vurgulu ? "border-[var(--accent-line)] bg-[var(--accent-soft)]" : ""}`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.14em] ${
          vurgulu ? "text-[var(--accent-ink)]" : "text-[var(--ink-3)]"
        }`}
      >
        {baslik}
      </p>
      <ol className="mt-3 space-y-3">
        {maddeler.map((madde, i) => (
          <li key={madde} className="flex gap-2.5 text-sm leading-relaxed text-[var(--ink-2)]">
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] text-[11px] font-bold text-[var(--ink-3)]"
            >
              {i + 1}
            </span>
            <span>{madde}</span>
          </li>
        ))}
      </ol>
    </Kart>
  );
}
