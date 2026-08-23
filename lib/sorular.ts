import type { QuestionItem, QuestionMode } from "./soru-bankasi";
import { QUESTION_BANK } from "./soru-bankasi";

export type { QuestionItem, QuestionMode };

/* ------------------------------------------------------------------
   Isındırma — plan §7.4 [2]
   Terk edişin %31'i ilk soruda. Bu soru skora girmez; akışı ısıtır.
   ------------------------------------------------------------------ */

export type IsindirmaSecenegi = {
  deger: string;
  etiket: string;
  ipucu: string;
};

export const ISINDIRMA_SECENEKLERI: IsindirmaSecenegi[] = [
  { deger: "yazma", etiket: "Yazma ve içerik", ipucu: "Metin, e-posta, rapor, sunum" },
  { deger: "analiz", etiket: "Analiz ve veri", ipucu: "Tablo, rakam, araştırma, özet" },
  { deger: "kod", etiket: "Yazılım ve teknik", ipucu: "Kod, otomasyon, entegrasyon" },
  { deger: "musteri", etiket: "Müşteri ve satış", ipucu: "İletişim, teklif, destek" },
  { deger: "karar", etiket: "Karar ve strateji", ipucu: "Seçenek değerlendirme, planlama" },
  { deger: "kullanmiyorum", etiket: "Henüz düzenli kullanmıyorum", ipucu: "Yeni başlıyorum" },
];

/* ------------------------------------------------------------------
   Bağlam — plan §7.4 [3]
   Benchmark grubunu ve soru seçimini belirler. Skora girmez.
   ------------------------------------------------------------------ */

export type BaglamAlani = {
  id: "rol" | "sektor" | "buyukluk" | "kidem";
  soru: string;
  yardim: string;
  secenekler: { deger: string; etiket: string }[];
};

export const BAGLAM_ALANLARI: BaglamAlani[] = [
  {
    id: "rol",
    soru: "Kurumdaki rolün hangisine yakın?",
    yardim: "Rolün, sana hangi soruların sorulacağını belirler.",
    secenekler: [
      { deger: "ust-yonetim", etiket: "Üst yönetim / C-level" },
      { deger: "yonetici", etiket: "Orta kademe yönetici" },
      { deger: "uzman", etiket: "Uzman / profesyonel" },
      { deger: "teknik", etiket: "Teknik ekip (yazılım, veri, IT)" },
      { deger: "girisimci", etiket: "Girişimci / bağımsız" },
      { deger: "ogrenci", etiket: "Öğrenci / kariyer başlangıcı" },
    ],
  },
  {
    id: "sektor",
    soru: "Hangi sektörde çalışıyorsun?",
    yardim: "Karşılaştırma grubunu belirler.",
    secenekler: [
      { deger: "teknoloji", etiket: "Teknoloji / yazılım" },
      { deger: "perakende", etiket: "Perakende / e-ticaret" },
      { deger: "finans", etiket: "Finans / sigorta" },
      { deger: "uretim", etiket: "Üretim / sanayi" },
      { deger: "saglik", etiket: "Sağlık" },
      { deger: "hizmet", etiket: "Profesyonel hizmetler" },
      { deger: "kamu", etiket: "Kamu / eğitim" },
      { deger: "diger", etiket: "Diğer" },
    ],
  },
  {
    id: "buyukluk",
    soru: "Kurumun büyüklüğü nedir?",
    yardim: "Olgunluk beklentisi ölçekle değişir.",
    secenekler: [
      { deger: "1-10", etiket: "1-10 kişi" },
      { deger: "11-50", etiket: "11-50 kişi" },
      { deger: "51-250", etiket: "51-250 kişi" },
      { deger: "251-1000", etiket: "251-1.000 kişi" },
      { deger: "1000+", etiket: "1.000+ kişi" },
    ],
  },
  {
    id: "kidem",
    soru: "Yapay zekâ araçlarını ne zamandır kullanıyorsun?",
    yardim: "Kıdem, skorunu değil yorumunu etkiler.",
    secenekler: [
      { deger: "yeni", etiket: "3 aydan az" },
      { deger: "orta", etiket: "3-12 ay" },
      { deger: "deneyimli", etiket: "1-2 yıl" },
      { deger: "ileri", etiket: "2 yıldan fazla" },
    ],
  },
];

/* ------------------------------------------------------------------
   Öz-değerlendirme — plan §7.4 [5]
   EN SONDA sorulur. Önce sorulursa nesnel cevaplar beyana göre ayarlanır.
   Fark skorunun öznel bacağı buradan gelir.
   ------------------------------------------------------------------ */

export type OzSoru = {
  id: string;
  soru: string;
  dusukEtiket: string;
  yuksekEtiket: string;
};

export const OZ_DEGERLENDIRME: OzSoru[] = [
  {
    id: "OZ1",
    soru: "Yapay zekâ bilgini nasıl değerlendirirsin?",
    dusukEtiket: "Hiç bilmiyorum",
    yuksekEtiket: "Çok iyi biliyorum",
  },
  {
    id: "OZ2",
    soru: "Bir yapay zekâ çıktısının doğru olup olmadığını anlayabildiğine ne kadar güveniyorsun?",
    dusukEtiket: "Hiç güvenmiyorum",
    yuksekEtiket: "Tamamen güveniyorum",
  },
  {
    id: "OZ3",
    soru: "Yapay zekâyı işinde etkin kullandığını düşünüyor musun?",
    dusukEtiket: "Hiç etkin değilim",
    yuksekEtiket: "Çok etkin kullanıyorum",
  },
];

export const OZ_OLCEK = [
  { deger: 0, etiket: "1" },
  { deger: 1, etiket: "2" },
  { deger: 2, etiket: "3" },
  { deger: 3, etiket: "4" },
  { deger: 4, etiket: "5" },
];

/* ------------------------------------------------------------------
   Soru seti seçimi ve havuz rotasyonu — plan §6.2
   ------------------------------------------------------------------ */

export type SoruPaketi = "hizli" | "tam" | "derin";

export const PAKET_ADETLERI: Record<QuestionMode, Record<SoruPaketi, number>> = {
  individual: { hizli: 12, tam: 24, derin: 39 },
  corporate: { hizli: 10, tam: 22, derin: 34 },
};

export const PAKET_META: Record<
  SoruPaketi,
  { ad: string; aciklama: string; dakika: number }
> = {
  hizli: { ad: "Hızlı tarama", aciklama: "Seviyeni ve en zayıf iki boyutu görürsün", dakika: 4 },
  tam: { ad: "Tam değerlendirme", aciklama: "Fark skoru dahil detaylı rapor", dakika: 8 },
  derin: { ad: "Derin analiz", aciklama: "Soru bankasının tamamı, en yüksek çözünürlük", dakika: 14 },
};

/**
 * Dairesel kaydırma. Karıştırmak yerine kaydırmak, ikinci turda örtüşmeyi
 * matematiksel alt sınıra indirir — T0/T1 ölçümünde ezber etkisini en aza çeker.
 */
function kaydir<T>(dizi: T[], adim: number): T[] {
  if (dizi.length === 0) return dizi;
  const ofset = ((adim % dizi.length) + dizi.length) % dizi.length;
  return [...dizi.slice(ofset), ...dizi.slice(0, ofset)];
}

/**
 * Bölümler arası dengeli seçim. `tur` değeri değiştiğinde havuz döner,
 * böylece ikinci ölçümde aynı sorular gelmez ama aynı boyutlar ölçülür.
 */
export function soruSetiSec(
  mod: QuestionMode,
  paket: SoruPaketi,
  tur: number,
): QuestionItem[] {
  const havuz = QUESTION_BANK.filter((q) => q.mode === mod);
  const hedef = PAKET_ADETLERI[mod][paket];
  if (hedef >= havuz.length) return [...havuz];

  const bolumler = new Map<string, QuestionItem[]>();
  for (const soru of havuz) {
    const mevcut = bolumler.get(soru.section) ?? [];
    mevcut.push(soru);
    bolumler.set(soru.section, mevcut);
  }

  // Her bölüm, tur sayısı kadar kendi payı boyunca kaydırılır
  const sira = Array.from(bolumler.keys()).sort();
  const bolumBasinaPay = Math.max(1, Math.ceil(hedef / sira.length));
  const donmus = new Map<string, QuestionItem[]>();
  for (const bolum of sira) {
    donmus.set(bolum, kaydir(bolumler.get(bolum) ?? [], (tur - 1) * bolumBasinaPay));
  }

  const secilen: QuestionItem[] = [];
  let derinlik = 0;
  while (secilen.length < hedef) {
    let ilerledi = false;
    for (const bolum of sira) {
      const kova = donmus.get(bolum) ?? [];
      if (derinlik < kova.length) {
        secilen.push(kova[derinlik]);
        ilerledi = true;
        if (secilen.length >= hedef) break;
      }
    }
    if (!ilerledi) break;
    derinlik += 1;
  }

  // Bölüm sırasını koru — kullanıcı konu konu ilerlesin, zıplamasın
  return secilen.sort((a, b) => a.section.localeCompare(b.section));
}

export function tahminiDakika(soruSayisi: number) {
  // Ölçülmüş ortalama: bilgi maddesi ~18 sn, davranış maddesi ~12 sn
  return Math.max(2, Math.round((soruSayisi * 16) / 60));
}
