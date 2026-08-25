"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { QuestionMode } from "@/lib/sorular";
import {
  BAGLAM_ALANLARI,
  OZ_DEGERLENDIRME,
  PAKET_META,
  soruSetiSec,
  type SoruPaketi,
} from "@/lib/sorular";
import { MARKA } from "@/lib/marka";
import type { Baglam, Oturum, OturumAdimi } from "@/lib/oturum";
import { bosOturum } from "@/lib/oturum";
import { oturumKaydet, oturumOku, oturumSil, raporKaydet, gecmiseEkle } from "@/lib/depolama";
import { sorulariCoz, raporUret } from "@/lib/rapor";
import { Buton, Kart } from "@/components/ui/temel";
import { TemaAnahtari } from "@/components/ui/TemaAnahtari";
import { SoruKarti } from "./SoruKarti";
import { IlerlemeRayi, type RaySegmenti } from "./IlerlemeRayi";
import { KlavyeIpucu } from "./KlavyeIpucu";
import {
  BaglamAdimi,
  HazirlikAdimi,
  IsindirmaAdimi,
  OzDegerlendirmeAdimi,
} from "./adimlar";

const ADIM_ETIKETLERI: Record<OturumAdimi, string> = {
  hazirlik: "Hazırlık",
  isindirma: "Isınma",
  baglam: "Bağlam",
  sorular: "Değerlendirme",
  "oz-degerlendirme": "Öz-değerlendirme",
  tamamlandi: "Tamamlandı",
};

export function OlcumAkisi() {
  const router = useRouter();
  const [oturum, setOturum] = useState<Oturum>(() => bosOturum("individual", "tam", 1));
  const [gizlilikRizasi, setGizlilikRizasi] = useState(false);
  const [devamAdayi, setDevamAdayi] = useState<Oturum | null>(null);
  const [yuklendi, setYuklendi] = useState(false);
  const [otomatikIlerle, setOtomatikIlerle] = useState(true);
  const [bildirim, setBildirim] = useState("");

  // Render sırasında Date.now() çağrılmaz; ilk değer sıfır, adım geçişinde damgalanır.
  const soruBaslangici = useRef<number>(0);
  const ilerlemeZamanlayici = useRef<number | null>(null);

  /* --------------------------- Yükleme / devam --------------------------- */

  /* localStorage bir dış sistem; mount'ta bir kez okunur. Bu effect kasıtlı olarak
     durum yazar — sunucuda olmayan veriyi hidrasyondan sonra almanın tek yolu bu. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const kayitli = oturumOku();
    if (kayitli && kayitli.adim !== "hazirlik" && kayitli.adim !== "tamamlandi") {
      setDevamAdayi(kayitli);
    }
    setYuklendi(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!yuklendi) return;
    oturumKaydet(oturum);
  }, [oturum, yuklendi]);

  // Yarım bırakılan ölçümde sekme kapatma uyarısı
  useEffect(() => {
    const aktif = oturum.adim === "sorular" || oturum.adim === "oz-degerlendirme";
    if (!aktif) return;
    const uyar = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", uyar);
    return () => window.removeEventListener("beforeunload", uyar);
  }, [oturum.adim]);

  /* ------------------------------- Türevler ------------------------------ */

  const sorular = useMemo(() => sorulariCoz(oturum.soruIdleri), [oturum.soruIdleri]);
  const aktifSoru = sorular[oturum.konum];
  const cevaplananSayisi = Object.keys(oturum.cevaplar).length;

  const segmentler: RaySegmenti[] = useMemo(() => {
    const harita = new Map<string, RaySegmenti>();
    for (const soru of sorular) {
      const mevcut = harita.get(soru.section) ?? {
        bolum: soru.section,
        toplam: 0,
        cevaplanan: 0,
      };
      mevcut.toplam += 1;
      if (oturum.cevaplar[soru.id] !== undefined) mevcut.cevaplanan += 1;
      harita.set(soru.section, mevcut);
    }
    return [...harita.values()].sort((a, b) => a.bolum.localeCompare(b.bolum));
  }, [sorular, oturum.cevaplar]);

  const ilerlemeYuzdesi = useMemo(() => {
    if (oturum.adim === "hazirlik") return 0;
    if (oturum.adim === "isindirma") return 4;
    if (oturum.adim === "baglam") return 10;
    if (oturum.adim === "oz-degerlendirme") return 96;
    if (oturum.adim === "tamamlandi") return 100;
    if (!sorular.length) return 12;
    return 12 + (oturum.konum / sorular.length) * 82;
  }, [oturum.adim, oturum.konum, sorular.length]);

  const kalanDakika = useMemo(() => {
    if (oturum.adim !== "sorular" || !sorular.length) return null;
    const olculenler = Object.values(oturum.sureler).filter((s) => s > 800 && s < 120000);
    const ortalama = olculenler.length >= 3
      ? olculenler.reduce((a, b) => a + b, 0) / olculenler.length
      : 16000;
    const kalanSoru = sorular.length - oturum.konum;
    // Cömert tahmin: ilan edilen süreyi aşmak terk edişi ikiye katlıyor
    return Math.max(1, Math.ceil((kalanSoru * ortalama * 1.15) / 60000));
  }, [oturum.adim, oturum.konum, oturum.sureler, sorular.length]);

  /* ------------------------------ Eylemler ------------------------------- */

  const guncelle = useCallback((yama: Partial<Oturum>) => {
    setOturum((onceki) => ({ ...onceki, ...yama }));
  }, []);

  const olcumeBasla = useCallback(() => {
    const secilen = soruSetiSec(oturum.mod, oturum.paket, oturum.tur);
    soruBaslangici.current = Date.now();
    guncelle({
      riza: true,
      soruIdleri: secilen.map((s) => s.id),
      adim: "isindirma",
      konum: 0,
      baslangic: Date.now(),
    });
  }, [oturum.mod, oturum.paket, oturum.tur, guncelle]);

  const tamamla = useCallback(
    (sonOturum: Oturum) => {
      const bitmis: Oturum = { ...sonOturum, adim: "tamamlandi", bitis: Date.now() };
      const rapor = raporUret(bitmis);
      raporKaydet(bitmis);
      gecmiseEkle({
        id: bitmis.id,
        tarih: bitmis.bitis ?? Date.now(),
        mod: bitmis.mod,
        skor: rapor.genelSkor,
        seviye: rapor.bant.etiket,
      });
      oturumSil();
      router.push("/rapor");
    },
    [router],
  );

  const soruyaCevapVer = useCallback(
    (indeks: number) => {
      if (!aktifSoru) return;
      const simdi = Date.now();
      const gecen = soruBaslangici.current ? simdi - soruBaslangici.current : 0;
      soruBaslangici.current = simdi;
      setOturum((onceki) => ({
        ...onceki,
        cevaplar: { ...onceki.cevaplar, [aktifSoru.id]: indeks },
        sureler: { ...onceki.sureler, [aktifSoru.id]: gecen },
      }));
      setBildirim(`${indeks + 1}. seçenek işaretlendi`);
    },
    [aktifSoru],
  );

  const ileri = useCallback(() => {
    if (ilerlemeZamanlayici.current) {
      window.clearTimeout(ilerlemeZamanlayici.current);
      ilerlemeZamanlayici.current = null;
    }

    setOturum((onceki) => {
      if (onceki.adim === "isindirma") return { ...onceki, adim: "baglam" };
      if (onceki.adim === "baglam") {
        soruBaslangici.current = Date.now();
        return { ...onceki, adim: "sorular", konum: 0 };
      }
      if (onceki.adim === "sorular") {
        if (onceki.konum < onceki.soruIdleri.length - 1) {
          soruBaslangici.current = Date.now();
          return { ...onceki, konum: onceki.konum + 1 };
        }
        return { ...onceki, adim: "oz-degerlendirme" };
      }
      return onceki;
    });
  }, []);

  const geri = useCallback(() => {
    setOturum((onceki) => {
      if (onceki.adim === "baglam") return { ...onceki, adim: "isindirma" };
      if (onceki.adim === "sorular") {
        if (onceki.konum === 0) return { ...onceki, adim: "baglam" };
        soruBaslangici.current = Date.now();
        return { ...onceki, konum: onceki.konum - 1 };
      }
      if (onceki.adim === "oz-degerlendirme") {
        soruBaslangici.current = Date.now();
        return {
          ...onceki,
          adim: "sorular",
          konum: Math.max(0, onceki.soruIdleri.length - 1),
        };
      }
      return onceki;
    });
  }, []);

  /* ---------------------- Otomatik ilerleme (soru adımı) ---------------------- */

  useEffect(() => {
    if (!otomatikIlerle) return;
    if (oturum.adim !== "sorular" || !aktifSoru) return;
    if (oturum.cevaplar[aktifSoru.id] === undefined) return;
    if (oturum.konum >= sorular.length - 1) return;

    ilerlemeZamanlayici.current = window.setTimeout(() => ileri(), 420);
    return () => {
      if (ilerlemeZamanlayici.current) window.clearTimeout(ilerlemeZamanlayici.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oturum.cevaplar, oturum.konum, oturum.adim, otomatikIlerle]);

  /* ------------------------------- Klavye -------------------------------- */

  useEffect(() => {
    if (oturum.adim !== "sorular" || !aktifSoru) return;

    const dinle = (olay: KeyboardEvent) => {
      const hedef = olay.target as HTMLElement | null;
      if (hedef && ["INPUT", "TEXTAREA", "SELECT"].includes(hedef.tagName)) {
        if (hedef.getAttribute("type") !== "radio") return;
      }

      if (/^[1-9]$/.test(olay.key)) {
        const indeks = Number(olay.key) - 1;
        if (indeks < aktifSoru.options.length) {
          olay.preventDefault();
          soruyaCevapVer(indeks);
        }
        return;
      }

      if (olay.key === "Enter") {
        if (oturum.cevaplar[aktifSoru.id] !== undefined) {
          olay.preventDefault();
          ileri();
        }
        return;
      }

      if (olay.key === "ArrowLeft") {
        olay.preventDefault();
        geri();
      }
    };

    window.addEventListener("keydown", dinle);
    return () => window.removeEventListener("keydown", dinle);
  }, [oturum.adim, oturum.cevaplar, aktifSoru, soruyaCevapVer, ileri, geri]);

  /* ------------------------------- Görünüm -------------------------------- */

  if (devamAdayi) {
    const toplam = devamAdayi.soruIdleri.length;
    const cevaplanan = Object.keys(devamAdayi.cevaplar).length;
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-10">
        <Kart className="p-6">
          <h1 className="text-xl font-semibold text-[var(--ink-1)]">Yarım kalmış bir ölçüm var</h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-2)]">
            {new Date(devamAdayi.baslangic).toLocaleString("tr-TR")} tarihinde başlamışsın.
            {toplam > 0 && ` ${cevaplanan}/${toplam} soru cevaplanmış.`} Kaldığın yerden devam
            edebilirsin.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Buton
              onClick={() => {
                soruBaslangici.current = Date.now();
                setOturum(devamAdayi);
                setGizlilikRizasi(true);
                setDevamAdayi(null);
              }}
            >
              Devam et
            </Buton>
            <Buton
              varyant="ikincil"
              onClick={() => {
                oturumSil();
                setDevamAdayi(null);
              }}
            >
              Baştan başla
            </Buton>
          </div>
        </Kart>
      </main>
    );
  }

  const adimEtiketi = ADIM_ETIKETLERI[oturum.adim];
  const ozTamam = OZ_DEGERLENDIRME.every((s) => oturum.ozDegerlendirme[s.id] !== undefined);
  const baglamTamam = BAGLAM_ALANLARI.every((a) => Boolean(oturum.baglam[a.id]));

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-0)]">
      {/* Üst çubuk — odak modunda minimum */}
      <header className="sticky top-0 z-20 border-b border-[var(--line-1)] bg-[var(--surface-0)]/92 backdrop-blur">
        <div className="mx-auto w-full max-w-2xl px-5 py-3 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="group flex items-center gap-2.5"
              aria-label={`${MARKA.ad} ana sayfa`}
            >
              {/* Speaker Agency mikrofon amblemi */}
              <span
                className="flex size-7 items-center justify-center rounded-full"
                style={{ background: MARKA.ustMarka.renk }}
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" className="size-3.5 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2a4 4 0 0 0-4 4v5a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4Zm0 14a6 6 0 0 0 6-6h-2a4 4 0 0 1-8 0H6a6 6 0 0 0 6 6Zm-1 2v2h2v-2h-2Z" />
                </svg>
              </span>
              <span className="text-sm font-semibold tracking-tight text-[var(--ink-1)]">
                {MARKA.ad}
              </span>
            </Link>
            <div className="flex items-center gap-2">
              {oturum.adim === "sorular" && (
                <button
                  type="button"
                  onClick={() => setOtomatikIlerle((v) => !v)}
                  className="hidden min-h-9 items-center rounded-full border border-[var(--line-1)] px-3 text-xs text-[var(--ink-2)] transition-colors hover:bg-[var(--surface-2)] sm:inline-flex"
                  aria-pressed={otomatikIlerle}
                >
                  Otomatik ilerleme: {otomatikIlerle ? "açık" : "kapalı"}
                </button>
              )}
              <TemaAnahtari />
            </div>
          </div>

          {oturum.adim !== "hazirlik" && (
            <div className="mt-3">
              <IlerlemeRayi
                segmentler={oturum.adim === "sorular" ? segmentler : []}
                yuzde={ilerlemeYuzdesi}
                kalanDakika={kalanDakika}
                adimEtiketi={
                  oturum.adim === "sorular" && sorular.length
                    ? `Soru ${oturum.konum + 1} / ${sorular.length}`
                    : adimEtiketi
                }
              />
            </div>
          )}
        </div>
      </header>

      <main
        className={`mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-8 pb-40 md:px-8 md:py-12 ${
          oturum.adim === "sorular" || oturum.adim === "isindirma"
            ? "justify-center md:-mt-10"
            : ""
        }`}
      >
        <p className="sr-only" role="status" aria-live="polite">
          {bildirim}
        </p>

        {oturum.adim === "hazirlik" && (
          <HazirlikAdimi
            mod={oturum.mod}
            paket={oturum.paket}
            kurum={oturum.kurum}
            riza={oturum.riza}
            gizlilikRizasi={gizlilikRizasi}
            onMod={(mod: QuestionMode) => guncelle({ mod, soruIdleri: [] })}
            onPaket={(paket: SoruPaketi) => guncelle({ paket, soruIdleri: [] })}
            onKurum={(kurum) => guncelle({ kurum })}
            onRiza={(riza) => guncelle({ riza })}
            onGizlilik={setGizlilikRizasi}
            onBasla={olcumeBasla}
          />
        )}

        {oturum.adim === "isindirma" && (
          <IsindirmaAdimi
            secili={oturum.isindirma}
            onSec={(deger) => guncelle({ isindirma: deger })}
          />
        )}

        {oturum.adim === "baglam" && (
          <BaglamAdimi
            baglam={oturum.baglam}
            onDegis={(alan: keyof Baglam, deger: string) =>
              setOturum((onceki) => ({
                ...onceki,
                baglam: { ...onceki.baglam, [alan]: deger },
              }))
            }
          />
        )}

        {oturum.adim === "sorular" && aktifSoru && (
          <SoruKarti
            soru={aktifSoru}
            secili={oturum.cevaplar[aktifSoru.id]}
            onSec={soruyaCevapVer}
            sira={oturum.konum + 1}
            toplam={sorular.length}
          />
        )}

        {oturum.adim === "oz-degerlendirme" && (
          <OzDegerlendirmeAdimi
            cevaplar={oturum.ozDegerlendirme}
            onDegis={(id, deger) =>
              setOturum((onceki) => ({
                ...onceki,
                ozDegerlendirme: { ...onceki.ozDegerlendirme, [id]: deger },
              }))
            }
          />
        )}
      </main>

      {/* Alt aksiyon çubuğu — mobilde sabit, güvenli alan korumalı */}
      {oturum.adim !== "hazirlik" && (
        <div
          className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--line-1)] bg-[var(--surface-0)]/95 backdrop-blur"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-5 py-3 md:px-8">
            <Buton varyant="sessiz" onClick={geri} disabled={oturum.adim === "isindirma"}>
              Geri
            </Buton>

            {oturum.adim === "sorular" && aktifSoru && (
              <KlavyeIpucu secenekSayisi={aktifSoru.options.length} />
            )}

            {oturum.adim === "oz-degerlendirme" ? (
              <Buton onClick={() => tamamla(oturum)} disabled={!ozTamam}>
                Raporu oluştur
              </Buton>
            ) : (
              <Buton
                onClick={ileri}
                disabled={
                  (oturum.adim === "isindirma" && !oturum.isindirma) ||
                  (oturum.adim === "baglam" && !baglamTamam) ||
                  (oturum.adim === "sorular" &&
                    Boolean(aktifSoru) &&
                    oturum.cevaplar[aktifSoru!.id] === undefined)
                }
              >
                {oturum.adim === "sorular" && oturum.konum === sorular.length - 1
                  ? "Son adım"
                  : "İleri"}
              </Buton>
            )}
          </div>
        </div>
      )}

      {oturum.adim === "hazirlik" && (
        <footer className="mx-auto w-full max-w-2xl px-5 pb-10 text-xs text-[var(--ink-3)] md:px-8">
          {PAKET_META[oturum.paket].ad} · yaklaşık {PAKET_META[oturum.paket].dakika} dakika ·{" "}
          {cevaplananSayisi > 0 ? `${cevaplananSayisi} cevap kayıtlı` : "kayıt gerekmez"}
        </footer>
      )}
    </div>
  );
}
