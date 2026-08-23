import Link from "next/link";
import { MARKA } from "@/lib/marka";
import { QUESTION_BANK } from "@/lib/soru-bankasi";
import { Buton, Etiket, Kart } from "@/components/ui/temel";
import { TemaAnahtari } from "@/components/ui/TemaAnahtari";
import { RadarGrafik } from "@/components/rapor/RadarGrafik";

const SORU_SAYISI = QUESTION_BANK.length;

/** Hero'daki örnek çıktı — gerçek bir rapordan alınmış tipik bir profil */
const ORNEK_RADAR = [
  { etiket: "Kavrayış", deger: 72 },
  { etiket: "Uygulama", deger: 58 },
  { etiket: "Eleştirel", deger: 41 },
  { etiket: "Etik ve risk", deger: 63 },
  { etiket: "Öz-yeterlik", deger: 55 },
  { etiket: "Yerleşiklik", deger: 47 },
];

const KANIT = [
  {
    rakam: "%5",
    metin: "Yapay zekâdan ciddi finansal kazanç sağlayan şirket oranı",
    kaynak: "BCG, Widening AI Value Gap, 2025 — 1.250+ firma",
  },
  {
    rakam: "%32",
    metin: "Yapay zekânın etkisini ölçmek için tanımlı süreci olan kurum",
    kaynak: "Cisco AI Readiness Index 2025 — 8.039 lider, 30 pazar",
  },
  {
    rakam: "2.30",
    metin: "Türkiye'nin yapay zekâ olgunluğu (5'lik ölçekte)",
    kaynak: "Digitopia DAIMI 2026 — 551 kurum",
  },
];

const ADIMLAR = [
  {
    baslik: "Bağlamını al",
    metin: "Rol, sektör, büyüklük ve kullanım kıdemin karşılaştırma grubunu belirler.",
  },
  {
    baslik: "Bilgini ölç",
    metin:
      "Beyana değil, cevaba bakan maddeler. Kavrayış, uygulama, doğrulama, etik, yerleşiklik.",
  },
  {
    baslik: "Kendine not ver",
    metin: "Üç soru, en sonda. Başta sorulsaydı testteki cevaplarını etkilerdi.",
  },
  {
    baslik: "Farkı gör",
    metin: "Kendini gördüğün yer ile ölçümün gösterdiği yer arasındaki açıklık raporun merkezinde.",
  },
];

const CERCEVELER = [
  { ad: "NIST AI RMF 1.0", not: "Govern · Map · Measure · Manage" },
  { ad: "ISO/IEC 42001", not: "Yapay zekâ yönetim sistemi" },
  { ad: "OECD AI İlkeleri", not: "Şeffaflık ve hesap verebilirlik" },
  { ad: "EU AI Act", not: "Madde 4 okuryazarlık yükümlülüğü" },
  { ad: "McKinsey Trust Maturity", not: "Strateji · risk · veri · operasyon" },
];

const SSS = [
  {
    soru: "Cevaplarım nereye gidiyor?",
    cevap:
      "Hiçbir yere. Ölçüm tamamen tarayıcında çalışır; cevapların sunucuya gönderilmez, rapor senin cihazında üretilir. Tarayıcı verini temizlersen ölçüm de silinir.",
  },
  {
    soru: "Bu bir sertifika mı?",
    cevap:
      "Değil. Bu bir gelişim aracı. Nerede olduğunu gösterir, nereden başlayacağını söyler. Raporun sonunda yöntemin sınırları açıkça yazılıdır.",
  },
  {
    soru: "Ne kadar sürüyor?",
    cevap:
      "Tam değerlendirme sekiz dakika. Hızlı tarama dört, derin analiz on dört. Yarıda bırakırsan kaldığın yerden devam edersin.",
  },
  {
    soru: "Kurumsal mod ne işe yarıyor?",
    cevap:
      "Bireysel mod kişinin bilgisini ve alışkanlığını ölçer. Kurumsal mod strateji, veri sahipliği, altyapı, politika, yetenek, değişim ve ölçüm boyutlarında kurumun yönetişim olgunluğunu ölçer.",
  },
];

export default function AnaSayfa() {
  return (
    <div className="min-h-screen bg-[var(--surface-0)]">
      <header className="border-b border-[var(--line-1)]">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <span className="text-sm font-semibold tracking-tight text-[var(--ink-1)]">
            {MARKA.ad}
          </span>
          <div className="flex items-center gap-3">
            <TemaAnahtari />
            <Link href="/olcum" className="hidden sm:block">
              <Buton boyut="sm">Ölçüme başla</Buton>
            </Link>
          </div>
        </div>
      </header>

      <main id="icerik" className="mx-auto w-full max-w-5xl px-5 md:px-8">
        {/* Hero */}
        <section className="grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
          <Etiket ton="vurgu">Yapay zekâ hazırlık ölçümü</Etiket>
          <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-[var(--ink-1)] md:text-6xl">
            Ne bildiğini sanıyorsun, gerçekte ne biliyorsun?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--ink-2)]">
            Piyasadaki yapay zekâ hazırlık araçlarının neredeyse tamamı sana{" "}
            <em>&ldquo;ne kadar iyi biliyorsun&rdquo;</em> diye soruyor ve cevabını skor sayıyor.
            Ölçtükleri şey yetkinlik değil, özgüven.
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--ink-2)]">
            {MARKA.ad} ikisini birden ölçer ve aradaki farkı gösterir. {MARKA.vaat}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/olcum">
              <Buton boyut="lg">Ölçüme başla</Buton>
            </Link>
            <span className="text-sm text-[var(--ink-3)]">
              Kayıt yok · {SORU_SAYISI} maddelik banka · 8 dakika
            </span>
          </div>
          </div>

          <div className="hidden lg:block" aria-hidden="true">
          <Kart className="p-6 shadow-[var(--shadow-md)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-3)]">
              Örnek çıktı
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-bold tabular-nums text-[var(--accent)]">%56</span>
              <span className="text-sm text-[var(--ink-2)]">Gelişen olgunluk</span>
            </div>
            <div className="mt-4">
              <RadarGrafik eksenler={ORNEK_RADAR} />
            </div>
            <div className="mt-4 rounded-[var(--radius-field)] bg-[var(--accent-soft)] px-4 py-3">
              <p className="text-xs font-semibold text-[var(--accent-ink)]">Fark skoru: +18</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--accent-ink)]">
                Kendini %74 gördün, ölçüm %56 dedi. Profil: aşırı güven.
              </p>
            </div>
          </Kart>
          </div>
        </section>

        {/* Ayrışma */}
        <section className="border-t border-[var(--line-1)] py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink-1)] md:text-3xl">
                &ldquo;Biliyorum&rdquo; hissi, ne bildiğini öngörmüyor
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-2)]">
                Würzburg Üniversitesi 2025&apos;te 514 kişiyle bir çalışma yaptı. Nesnel bilgi
                testiyle öznel öz-değerlendirme ölçeği arasındaki korelasyonu ölçtüler.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-2)]">
                Sonuç istatistiksel olarak sıfır. Aynı bulgu bağımsız çalışmalarda tekrarlanıyor.
                Literatürde adı var: bilme hissi.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-2)]">
                Bunun pratik sonucu şu: kendini yetkin gören ama ölçümde düşük çıkan bir çalışan,
                kurum için acemiden daha risklidir. Hatayı fark etmez, eğitimi gereksiz görür.
                Hiçbir mevcut araç bu ayrımı yapmıyor.
              </p>
            </div>

            <Kart className="border-[var(--accent-line)] bg-[var(--accent-soft)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-ink)]">
                Korelasyon
              </p>
              <p className="mt-2 font-mono text-4xl font-bold text-[var(--accent)]">r = .02</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--accent-ink)]">
                Öznel öz-değerlendirme ile nesnel bilgi testi arasında. 514 katılımcı, p = .586.
              </p>
              <p className="mt-4 text-xs text-[var(--ink-3)]">
                Kaynak: AICOS çalışması, Würzburg Üniversitesi, 2025
              </p>
            </Kart>
          </div>
        </section>

        {/* Kanıt */}
        <section className="border-t border-[var(--line-1)] py-14">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink-1)] md:text-3xl">
            Herkes kullanıyor, çok azı değer üretiyor, neredeyse kimse ölçmüyor
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {KANIT.map((oge) => (
              <Kart key={oge.rakam} yumusak className="p-5">
                <p className="text-3xl font-bold tabular-nums text-[var(--accent)]">{oge.rakam}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-2)]">{oge.metin}</p>
                <p className="mt-3 text-xs text-[var(--ink-3)]">{oge.kaynak}</p>
              </Kart>
            ))}
          </div>
        </section>

        {/* Nasıl çalışır */}
        <section className="border-t border-[var(--line-1)] py-14">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink-1)] md:text-3xl">
            Nasıl çalışıyor
          </h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-2">
            {ADIMLAR.map((adim, i) => (
              <li key={adim.baslik} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent-ink)]"
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-[var(--ink-1)]">{adim.baslik}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--ink-2)]">{adim.metin}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Rapor */}
        <section className="border-t border-[var(--line-1)] py-14">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink-1)] md:text-3xl">
                Raporda ne var
              </h2>
              <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-[var(--ink-2)]">
                {[
                  "Genel skor, seviye ve tek cümlelik teşhis",
                  "Boyut radarı — hangi alanda güçlüsün, nerede açık var",
                  "Fark skoru ve profil yorumu",
                  "Küresel çerçeve karşılığı: NIST, ISO, OECD, EU AI Act",
                  "30 gün, 60-90 gün ve 0-6 ay için somut yol haritası",
                  "Yöntem notu ve sınırlar — neyin ölçülmediği dahil",
                  "PDF ve DOCX indirme, doğrudan sunuma girecek düzen",
                ].map((madde) => (
                  <li key={madde} className="flex gap-2.5">
                    <span aria-hidden="true" className="text-[var(--accent)]">
                      —
                    </span>
                    <span>{madde}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink-1)] md:text-3xl">
                Hangi çerçevelere dayanıyor
              </h2>
              <div className="mt-6 space-y-2.5">
                {CERCEVELER.map((cerceve) => (
                  <Kart key={cerceve.ad} className="flex items-center justify-between gap-3 p-4">
                    <span className="text-sm font-medium text-[var(--ink-1)]">{cerceve.ad}</span>
                    <span className="text-xs text-[var(--ink-3)]">{cerceve.not}</span>
                  </Kart>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SSS */}
        <section className="border-t border-[var(--line-1)] py-14">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink-1)] md:text-3xl">
            Sık sorulanlar
          </h2>
          <div className="mt-6 space-y-2.5">
            {SSS.map((oge) => (
              <details
                key={oge.soru}
                className="group rounded-[var(--radius-card)] border border-[var(--line-1)] bg-[var(--surface-0)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-[15px] font-medium text-[var(--ink-1)]">
                  {oge.soru}
                  <span
                    aria-hidden="true"
                    className="text-[var(--ink-3)] transition-transform group-open:rotate-180"
                  >
                    ▾
                  </span>
                </summary>
                <p className="border-t border-[var(--line-1)] p-4 text-sm leading-relaxed text-[var(--ink-2)]">
                  {oge.cevap}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Son çağrı */}
        <section className="border-t border-[var(--line-1)] py-16">
          <Kart className="border-[var(--accent-line)] bg-[var(--accent-soft)] p-8 md:p-10">
            <h2 className="max-w-2xl text-balance text-2xl font-semibold tracking-tight text-[var(--ink-1)] md:text-3xl">
              Sekiz dakika sonra nerede olduğunu ve nereden başlayacağını bileceksin
            </h2>
            <div className="mt-7">
              <Link href="/olcum">
                <Buton boyut="lg">Ölçüme başla</Buton>
              </Link>
            </div>
          </Kart>
        </section>
      </main>

      <footer className="border-t border-[var(--line-1)]">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-xs text-[var(--ink-3)] md:px-8">
          <span>
            {MARKA.ad} — {MARKA.aciklama}
          </span>
          <span>Cevaplar tarayıcında kalır, sunucuya gönderilmez.</span>
        </div>
      </footer>
    </div>
  );
}
