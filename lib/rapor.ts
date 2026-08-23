import { QUESTION_BANK } from "./soru-bankasi";
import type { QuestionItem, QuestionMode } from "./sorular";
import { BAGLAM_ALANLARI, ISINDIRMA_SECENEKLERI, PAKET_META } from "./sorular";
import type { Oturum } from "./oturum";
import { veriKalitesi } from "./oturum";
import type { BolumSkoru, CerceveSonucu, FarkSkoru, SeviyeBandi } from "./skorlama";
import {
  BOLUM_META,
  BOLUM_ONERILERI,
  bantBul,
  bolumSkorlari,
  cerceveSonuclari,
  farkSkoru,
  sinirla,
} from "./skorlama";

export type Rapor = {
  id: string;
  uretimTarihi: string;
  uretimZamani: number;
  mod: QuestionMode;
  modEtiketi: string;
  paketEtiketi: string;
  kurum: string;
  soruSayisi: number;
  cevaplananSayisi: number;
  genelSkor: number;
  bant: SeviyeBandi;
  bolumler: BolumSkoru[];
  cerceveler: CerceveSonucu[];
  fark: FarkSkoru | null;
  gucluAlanlar: BolumSkoru[];
  zayifAlanlar: BolumSkoru[];
  aksiyonPlani: { otuzGun: string[]; ceyrek: string[]; yariYil: string[] };
  baglamOzeti: { etiket: string; deger: string }[];
  isindirmaEtiketi: string | null;
  gecenSureDk: number;
  veriKalitesi: { guvenilir: boolean; hizliOran: number };
  yontemNotu: string[];
};

function benzersiz(liste: string[]) {
  return [...new Set(liste.map((s) => s.trim()).filter(Boolean))];
}

export function sorulariCoz(soruIdleri: string[]): QuestionItem[] {
  const harita = new Map(QUESTION_BANK.map((q) => [q.id, q]));
  return soruIdleri.map((id) => harita.get(id)).filter((q): q is QuestionItem => Boolean(q));
}

export function raporUret(oturum: Oturum): Rapor {
  const sorular = sorulariCoz(oturum.soruIdleri);
  const bolumler = bolumSkorlari(sorular, oturum.cevaplar);

  const toplamPuan = bolumler.reduce((acc, b) => acc + b.puan, 0);
  const maksPuan = bolumler.reduce((acc, b) => acc + b.maks, 0);
  const genelSkor = maksPuan ? sinirla((toplamPuan / maksPuan) * 100) : 0;

  const bant = bantBul(genelSkor);
  const cerceveler = cerceveSonuclari(oturum.mod, bolumler);
  const fark = farkSkoru(oturum.ozDegerlendirme, genelSkor);

  const artan = [...bolumler].sort((a, b) => a.yuzde - b.yuzde);
  const zayifAlanlar = artan.slice(0, 3);
  const gucluAlanlar = [...bolumler].sort((a, b) => b.yuzde - a.yuzde).slice(0, 2);

  const otuzGun: string[] = [];
  const ceyrek: string[] = [];
  const yariYil: string[] = [];

  for (const bolum of artan.slice(0, 2)) {
    const oneri = BOLUM_ONERILERI[bolum.bolum];
    if (!oneri) continue;
    otuzGun.push(...oneri.acil);
    ceyrek.push(...oneri.ceyrek);
  }
  for (const bolum of artan) {
    const oneri = BOLUM_ONERILERI[bolum.bolum];
    if (!oneri) continue;
    yariYil.push(...oneri.surdur);
  }

  const baglamOzeti = BAGLAM_ALANLARI.map((alan) => {
    const secilen = oturum.baglam[alan.id];
    const secenek = alan.secenekler.find((s) => s.deger === secilen);
    return secenek ? { etiket: alanBasligi(alan.id), deger: secenek.etiket } : null;
  }).filter((x): x is { etiket: string; deger: string } => Boolean(x));

  const isindirma = ISINDIRMA_SECENEKLERI.find((s) => s.deger === oturum.isindirma);
  const bitis = oturum.bitis ?? Date.now();
  const kalite = veriKalitesi(oturum);

  const yontemNotu = [
    "Her madde 0-4 aralığında puanlandı; bölüm puanı, bölümün maksimum puanına bölünerek yüzdeye çevrildi.",
    "Genel skor, tüm maddelerin toplam puanının toplam maksimuma oranıdır — bölüm ortalaması değil, madde ağırlıklıdır.",
    "Çerçeve skorları, ilgili bölümlerin madde sayısıyla ağırlıklandırılmış ortalamasıdır.",
    "Bu ölçüm bir sertifikasyon değildir. Öz-bildirim maddeleri kişinin beyanına dayanır, doğrulanmaz.",
    "Sonuç, ölçüm anındaki cevapları yansıtır. Doğru-yanlış değil, olgunluk seviyesi gösterir.",
  ];

  if (!kalite.guvenilir) {
    yontemNotu.push(
      "Uyarı: maddelerin önemli bir kısmı iki saniyenin altında yanıtlandı. Bu, sonucun güvenilirliğini düşürür.",
    );
  }
  if (oturum.cevaplar && sorular.length > Object.keys(oturum.cevaplar).length) {
    yontemNotu.push("Yanıtlanmayan maddeler sıfır puan sayıldı; bu genel skoru aşağı çeker.");
  }

  return {
    id: oturum.id,
    uretimTarihi: new Date(bitis).toLocaleString("tr-TR"),
    uretimZamani: bitis,
    mod: oturum.mod,
    modEtiketi: oturum.mod === "corporate" ? "Kurumsal" : "Bireysel",
    paketEtiketi: PAKET_META[oturum.paket].ad,
    kurum: oturum.kurum,
    soruSayisi: sorular.length,
    cevaplananSayisi: sorular.filter((q) => oturum.cevaplar[q.id] !== undefined).length,
    genelSkor,
    bant,
    bolumler,
    cerceveler,
    fark,
    gucluAlanlar,
    zayifAlanlar,
    aksiyonPlani: {
      otuzGun: benzersiz(otuzGun).slice(0, 5),
      ceyrek: benzersiz(ceyrek).slice(0, 5),
      yariYil: benzersiz(yariYil).slice(0, 5),
    },
    baglamOzeti,
    isindirmaEtiketi: isindirma ? isindirma.etiket : null,
    gecenSureDk: Math.max(1, Math.round((bitis - oturum.baslangic) / 60000)),
    veriKalitesi: kalite,
    yontemNotu,
  };
}

function alanBasligi(id: string) {
  switch (id) {
    case "rol":
      return "Rol";
    case "sektor":
      return "Sektör";
    case "buyukluk":
      return "Kurum büyüklüğü";
    case "kidem":
      return "Kullanım kıdemi";
    default:
      return id;
  }
}

export function bolumKisaAd(bolum: string) {
  return BOLUM_META[bolum]?.kisa ?? bolum;
}

const TURKCE_HARITA: Record<string, string> = {
  ç: "c", Ç: "C", ğ: "g", Ğ: "G", ı: "i", İ: "I",
  ö: "o", Ö: "O", ş: "s", Ş: "S", ü: "u", Ü: "U",
};

/** Türkçe harfleri koruyarak dosya adına çevirir; "A.Ş." → "A-S" */
export function dosyaGuvenliAd(metin: string) {
  return metin
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (harf) => TURKCE_HARITA[harf] ?? harf)
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function dosyaAdi(rapor: Rapor, uzanti: string) {
  const ad =
    rapor.mod === "corporate" && rapor.kurum ? dosyaGuvenliAd(rapor.kurum) : "bireysel";
  const tarih = new Date(rapor.uretimZamani).toISOString().slice(0, 10);
  return `catailyst-${rapor.mod}-${ad}-${tarih}.${uzanti}`;
}
