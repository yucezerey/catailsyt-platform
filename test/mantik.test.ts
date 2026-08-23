import { soruSetiSec, PAKET_ADETLERI } from "../lib/sorular";
import { raporUret } from "../lib/rapor";
import { bosOturum, type Oturum } from "../lib/oturum";
import { farkSkoru } from "../lib/skorlama";

let hata = 0;
const dogru = (kosul: boolean, ad: string) => {
  console.log(`${kosul ? "GEÇTİ" : "KALDI"}  ${ad}`);
  if (!kosul) hata++;
};

// 1. Paket adetleri tutuyor mu
for (const mod of ["individual", "corporate"] as const) {
  for (const paket of ["hizli", "tam", "derin"] as const) {
    const set = soruSetiSec(mod, paket, 1);
    dogru(
      set.length === PAKET_ADETLERI[mod][paket],
      `${mod}/${paket}: ${set.length} soru (beklenen ${PAKET_ADETLERI[mod][paket]})`,
    );
    dogru(new Set(set.map((s) => s.id)).size === set.length, `${mod}/${paket}: tekrar eden soru yok`);
    dogru(set.every((s) => s.mode === mod), `${mod}/${paket}: mod sızıntısı yok`);
  }
}

// 2. Havuz rotasyonu — ikinci turda aynı sorular gelmemeli
const tur1 = soruSetiSec("individual", "tam", 1).map((s) => s.id);
const tur2 = soruSetiSec("individual", "tam", 2).map((s) => s.id);
const ortak = tur1.filter((id) => tur2.includes(id)).length;
dogru(ortak < tur1.length, `Rotasyon çalışıyor: ${ortak}/${tur1.length} soru tekrar etti`);

// 3. Determinizm — aynı tur aynı seti vermeli
const tekrar = soruSetiSec("individual", "tam", 1).map((s) => s.id);
dogru(JSON.stringify(tur1) === JSON.stringify(tekrar), "Aynı tur deterministik");

// 4. Tam puan senaryosu: her soruda son seçenek (en yüksek)
const sorular = soruSetiSec("individual", "tam", 1);
const tamOturum: Oturum = {
  ...bosOturum("individual", "tam", 1),
  soruIdleri: sorular.map((s) => s.id),
  cevaplar: Object.fromEntries(sorular.map((s) => [s.id, s.options.length - 1])),
  ozDegerlendirme: { OZ1: 4, OZ2: 4, OZ3: 4 },
  bitis: Date.now() + 480000,
};
const tamRapor = raporUret(tamOturum);
dogru(Math.round(tamRapor.genelSkor) === 100, `Tam puan = %${tamRapor.genelSkor.toFixed(1)}`);
dogru(tamRapor.bant.etiket === "Stratejik olgunluk", `Bant: ${tamRapor.bant.etiket}`);
dogru(tamRapor.fark?.profil === "kalibre-yetkin", `Profil: ${tamRapor.fark?.profil}`);
dogru(tamRapor.cerceveler.length > 0, `Çerçeve sayısı: ${tamRapor.cerceveler.length}`);
dogru(
  tamRapor.cerceveler.every((c) => c.genel > 99),
  "Tam puanda tüm çerçeveler %100'e yakın",
);

// 5. Sıfır puan senaryosu
const sifirOturum: Oturum = {
  ...tamOturum,
  cevaplar: Object.fromEntries(sorular.map((s) => [s.id, 0])),
  ozDegerlendirme: { OZ1: 4, OZ2: 4, OZ3: 4 },
};
const sifirRapor = raporUret(sifirOturum);
dogru(sifirRapor.genelSkor === 0, `Sıfır puan = %${sifirRapor.genelSkor}`);
dogru(sifirRapor.fark?.profil === "asiri-guven", `Aşırı güven tespiti: ${sifirRapor.fark?.profil}`);
dogru(sifirRapor.fark?.risk === "yuksek", "Aşırı güven yüksek risk işaretli");

// 6. Yetersiz güven
const yetersiz = farkSkoru({ OZ1: 0, OZ2: 0, OZ3: 0 }, 85);
dogru(yetersiz?.profil === "yetersiz-guven", `Yetersiz güven: ${yetersiz?.profil}`);

// 7. Kalibre acemi
const acemi = farkSkoru({ OZ1: 1, OZ2: 1, OZ3: 1 }, 28);
dogru(acemi?.profil === "kalibre-acemi", `Kalibre acemi: ${acemi?.profil} (öznel %${acemi?.oznel})`);

// 8. Öz-değerlendirme yoksa fark skoru null
dogru(farkSkoru({}, 50) === null, "Öz-değerlendirme yoksa fark skoru üretilmiyor");

// 9. Aksiyon planında boş madde olmamalı (eski hata)
const tumMaddeler = [
  ...sifirRapor.aksiyonPlani.otuzGun,
  ...sifirRapor.aksiyonPlani.ceyrek,
  ...sifirRapor.aksiyonPlani.yariYil,
];
dogru(tumMaddeler.length > 0, `Aksiyon maddesi üretildi: ${tumMaddeler.length}`);
dogru(tumMaddeler.every((m) => m.trim().length > 10), "Boş veya kırık aksiyon maddesi yok");

// 10. Kısmi cevap — cevaplanmayan sıfır sayılmalı
const yariOturum: Oturum = {
  ...tamOturum,
  cevaplar: Object.fromEntries(
    sorular.slice(0, Math.floor(sorular.length / 2)).map((s) => [s.id, s.options.length - 1]),
  ),
};
const yariRapor = raporUret(yariOturum);
dogru(
  yariRapor.genelSkor > 40 && yariRapor.genelSkor < 60,
  `Yarım cevap skoru makul: %${yariRapor.genelSkor.toFixed(1)}`,
);
dogru(
  yariRapor.yontemNotu.some((n) => n.includes("Yanıtlanmayan")),
  "Eksik cevap uyarısı yöntem notuna düştü",
);

// 11. Bölüm skorları toplamı tutarlı
dogru(
  tamRapor.bolumler.every((b) => b.yuzde >= 0 && b.yuzde <= 100),
  "Tüm bölüm yüzdeleri 0-100 aralığında",
);

// 12. Rotasyon kalitesi — alt sınıra ne kadar yakın
{
  const a = soruSetiSec("individual", "tam", 1).map((s) => s.id);
  const b = soruSetiSec("individual", "tam", 2).map((s) => s.id);
  const c = soruSetiSec("individual", "tam", 3).map((s) => s.id);
  const havuz = 39;
  const altSinir = a.length * 2 - havuz;
  const ortakAB = a.filter((id) => b.includes(id)).length;
  const ortakAC = a.filter((id) => c.includes(id)).length;
  console.log(`T1-T2 örtüşme: ${ortakAB}/${a.length} (alt sınır ${altSinir})`);
  console.log(`T1-T3 örtüşme: ${ortakAC}/${a.length}`);
  dogru(ortakAB <= altSinir + 3, "İkinci tur örtüşmesi alt sınıra yakın");
}

console.log(`\n${hata === 0 ? "TÜM TESTLER GEÇTİ" : `${hata} TEST BAŞARISIZ`}`);
process.exit(hata === 0 ? 0 : 1);
