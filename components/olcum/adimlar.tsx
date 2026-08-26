"use client";

import type { QuestionMode } from "@/lib/sorular";
import {
  BAGLAM_ALANLARI,
  ISINDIRMA_SECENEKLERI,
  OZ_DEGERLENDIRME,
  OZ_OLCEK,
  PAKET_ADETLERI,
  PAKET_META,
  type SoruPaketi,
} from "@/lib/sorular";
import type { Baglam } from "@/lib/oturum";
import { Buton, Kart } from "@/components/ui/temel";

/* ---------------------------- Hazırlık + rıza ---------------------------- */

export function HazirlikAdimi({
  mod,
  paket,
  kurum,
  riza,
  gizlilikRizasi,
  onMod,
  onPaket,
  onKurum,
  onRiza,
  onGizlilik,
  onBasla,
}: {
  mod: QuestionMode;
  paket: SoruPaketi;
  kurum: string;
  riza: boolean;
  gizlilikRizasi: boolean;
  onMod: (mod: QuestionMode) => void;
  onPaket: (paket: SoruPaketi) => void;
  onKurum: (deger: string) => void;
  onRiza: (deger: boolean) => void;
  onGizlilik: (deger: boolean) => void;
  onBasla: () => void;
}) {
  const hazir = riza && gizlilikRizasi;

  return (
    <div className="cat-enter space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink-1)] md:text-3xl">
          Başlamadan önce
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-2)]">
          Bu ölçüm doğru-yanlış sınavı değil. Nerede olduğunu gösterir ve nereden başlayacağını
          söyler. Yarıda bırakırsan kaldığın yerden devam edersin.
        </p>
      </div>

      <fieldset className="border-0 p-0">
        <legend className="text-sm font-semibold text-[var(--ink-1)]">Hangi ölçümü yapıyorsun?</legend>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          <SecimKarti
            secili={mod === "individual"}
            baslik="Bireysel"
            aciklama="Kendi hazırlığını ölç"
            onSec={() => onMod("individual")}
            ad="mod"
          />
          <SecimKarti
            secili={mod === "corporate"}
            baslik="Kurumsal"
            aciklama="Kurumun yönetişim olgunluğunu ölç"
            onSec={() => onMod("corporate")}
            ad="mod"
          />
        </div>
      </fieldset>

      {mod === "corporate" && (
        <label className="block">
          <span className="text-sm font-semibold text-[var(--ink-1)]">Kurum adı</span>
          <span className="mt-1 block text-xs text-[var(--ink-3)]">
            Rapor kapağında görünür. Boş bırakabilirsin.
          </span>
          <input
            value={kurum}
            onChange={(e) => onKurum(e.target.value)}
            placeholder="Örnek Teknoloji A.Ş."
            className="mt-2 min-h-11 w-full rounded-[var(--radius-field)] border border-[var(--line-2)] bg-[var(--surface-0)] px-4 text-[15px] text-[var(--ink-1)] outline-none placeholder:text-[var(--ink-3)] focus-visible:border-[var(--accent)]"
          />
        </label>
      )}

      <fieldset className="border-0 p-0">
        <legend className="text-sm font-semibold text-[var(--ink-1)]">Ne kadar derine ineceğiz?</legend>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
          {(Object.keys(PAKET_META) as SoruPaketi[]).map((secenek) => (
            <SecimKarti
              key={secenek}
              secili={paket === secenek}
              baslik={PAKET_META[secenek].ad}
              aciklama={`${PAKET_ADETLERI[mod][secenek]} soru · ~${PAKET_META[secenek].dakika} dk`}
              alt={PAKET_META[secenek].aciklama}
              onSec={() => onPaket(secenek)}
              ad="paket"
            />
          ))}
        </div>
      </fieldset>

      <Kart yumusak className="p-5">
        <p className="text-sm font-semibold text-[var(--ink-1)]">Verilerin ne oluyor?</p>
        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[var(--ink-2)]">
          <li>Cevapların yalnızca bu tarayıcıda saklanır; sunucuya gönderilmez.</li>
          <li>Rapor bu cihazda üretilir. Kimseyle otomatik paylaşılmaz.</li>
          <li>Kurumsal kullanımda bireysel yanıtlar işverene ham hâlde gitmez.</li>
          <li>Tarayıcı verisini temizlersen ölçüm de silinir.</li>
        </ul>

        <div className="mt-4 space-y-3">
          <OnayKutusu
            secili={riza}
            onDegis={onRiza}
            metin="Bu ölçümün bir sertifikasyon değil, gelişim aracı olduğunu anladım."
          />
          <OnayKutusu
            secili={gizlilikRizasi}
            onDegis={onGizlilik}
            metin="Verilerimin bu tarayıcıda saklanmasını ve rapor üretiminde kullanılmasını kabul ediyorum."
          />
        </div>
      </Kart>

      <div className="flex flex-wrap items-center gap-3">
        <Buton boyut="lg" onClick={onBasla} disabled={!hazir}>
          Ölçüme başla
        </Buton>
        {!hazir && (
          <p className="text-xs text-[var(--ink-3)]">İki onayı da işaretlemen gerekiyor.</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Isındırma ------------------------------- */

export function IsindirmaAdimi({
  secili,
  onSec,
}: {
  secili: string | undefined;
  onSec: (deger: string) => void;
}) {
  return (
    <div className="cat-enter">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-3)]">
        Isınma sorusu · skora girmez
      </p>
      <h2 className="mt-3 text-xl font-semibold leading-snug text-[var(--ink-1)] md:text-2xl">
        Yapay zekâyı en çok hangi işinde kullanıyorsun?
      </h2>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {ISINDIRMA_SECENEKLERI.map((secenek) => (
          <SecimKarti
            key={secenek.deger}
            secili={secili === secenek.deger}
            baslik={secenek.etiket}
            aciklama={secenek.ipucu}
            onSec={() => onSec(secenek.deger)}
            ad="isindirma"
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Bağlam -------------------------------- */

export function BaglamAdimi({
  baglam,
  onDegis,
}: {
  baglam: Baglam;
  onDegis: (alan: keyof Baglam, deger: string) => void;
}) {
  return (
    <div className="cat-enter space-y-7 pb-20">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-3)]">
          Bağlam · skora girmez
        </p>
        <h2 className="mt-3 text-xl font-semibold leading-snug text-[var(--ink-1)] md:text-2xl">
          Seni nasıl konumlayalım?
        </h2>
        <p className="mt-2 text-sm text-[var(--ink-2)]">
          Bu dört cevap, karşılaştırma grubunu ve yorumun tonunu belirler.
        </p>
      </div>

      {BAGLAM_ALANLARI.map((alan) => (
        <fieldset key={alan.id} className="scroll-mb-40 border-0 p-0">
          <legend className="text-sm font-semibold text-[var(--ink-1)]">{alan.soru}</legend>
          <p className="mt-0.5 text-xs text-[var(--ink-3)]">{alan.yardim}</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {alan.secenekler.map((secenek) => {
              const aktif = baglam[alan.id] === secenek.deger;
              return (
                <label key={secenek.deger} className="cursor-pointer">
                  <input
                    type="radio"
                    name={alan.id}
                    value={secenek.deger}
                    checked={aktif}
                    onChange={() => onDegis(alan.id, secenek.deger)}
                    className="peer sr-only"
                  />
                  <span
                    className={`inline-flex min-h-10 items-center rounded-full border px-4 text-sm transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)] ${
                      aktif
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] font-medium text-[var(--accent-ink)]"
                        : "border-[var(--line-1)] text-[var(--ink-2)] hover:border-[var(--line-2)] hover:bg-[var(--surface-1)]"
                    }`}
                  >
                    {secenek.etiket}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

/* --------------------------- Öz-değerlendirme --------------------------- */

export function OzDegerlendirmeAdimi({
  cevaplar,
  onDegis,
}: {
  cevaplar: Record<string, number>;
  onDegis: (id: string, deger: number) => void;
}) {
  return (
    <div className="cat-enter space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-3)]">
          Son adım
        </p>
        <h2 className="mt-3 text-xl font-semibold leading-snug text-[var(--ink-1)] md:text-2xl">
          Şimdi kendine not ver
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-2)]">
          Bu üç soru en sonda soruluyor — başta sorulsaydı testteki cevaplarını etkilerdi. Verdiğin
          not ile ölçümün sonucu arasındaki fark, raporun en değerli bölümünü üretiyor.
        </p>
      </div>

      {OZ_DEGERLENDIRME.map((soru) => (
        <fieldset key={soru.id} className="border-0 p-0">
          <legend className="text-[15px] font-medium text-[var(--ink-1)]">{soru.soru}</legend>
          <div className="mt-3 flex items-center gap-2">
            {OZ_OLCEK.map((olcek) => {
              const aktif = cevaplar[soru.id] === olcek.deger;
              return (
                <label key={olcek.deger} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name={soru.id}
                    value={olcek.deger}
                    checked={aktif}
                    onChange={() => onDegis(soru.id, olcek.deger)}
                    className="peer sr-only"
                  />
                  <span
                    className={`flex min-h-12 items-center justify-center rounded-[var(--radius-field)] border text-sm font-semibold transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)] ${
                      aktif
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)]"
                        : "border-[var(--line-1)] text-[var(--ink-2)] hover:border-[var(--line-2)] hover:bg-[var(--surface-1)]"
                    }`}
                  >
                    {olcek.etiket}
                  </span>
                </label>
              );
            })}
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-[var(--ink-3)]">
            <span>{soru.dusukEtiket}</span>
            <span>{soru.yuksekEtiket}</span>
          </div>
        </fieldset>
      ))}
    </div>
  );
}

/* ------------------------------ Ortak parça ----------------------------- */

function SecimKarti({
  secili,
  baslik,
  aciklama,
  alt,
  onSec,
  ad,
}: {
  secili: boolean;
  baslik: string;
  aciklama: string;
  alt?: string;
  onSec: () => void;
  ad: string;
}) {
  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        name={ad}
        checked={secili}
        onChange={onSec}
        className="peer sr-only"
      />
      <span
        className={`flex min-h-16 flex-col justify-center rounded-[var(--radius-field)] border px-4 py-3 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)] ${
          secili
            ? "border-[var(--accent)] bg-[var(--accent-soft)]"
            : "border-[var(--line-1)] hover:border-[var(--line-2)] hover:bg-[var(--surface-1)]"
        }`}
      >
        <span
          className={`text-sm font-semibold ${secili ? "text-[var(--accent-ink)]" : "text-[var(--ink-1)]"}`}
        >
          {baslik}
        </span>
        <span className="mt-0.5 text-xs text-[var(--ink-3)]">{aciklama}</span>
        {alt && <span className="mt-1 text-[11px] text-[var(--ink-3)]">{alt}</span>}
      </span>
    </label>
  );
}

function OnayKutusu({
  secili,
  onDegis,
  metin,
}: {
  secili: boolean;
  onDegis: (deger: boolean) => void;
  metin: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={secili}
        onChange={(e) => onDegis(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border text-xs font-bold transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)] ${
          secili
            ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)]"
            : "border-[var(--line-2)]"
        }`}
      >
        {secili ? "✓" : ""}
      </span>
      <span className="text-xs leading-relaxed text-[var(--ink-2)]">{metin}</span>
    </label>
  );
}
