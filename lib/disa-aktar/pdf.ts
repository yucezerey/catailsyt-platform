import { MARKA } from "../marka";
import type { Rapor } from "../rapor";
import { dosyaAdi } from "../rapor";

let fontOnbellegi: { normal: string; bold: string } | null = null;

async function fontlariYukle() {
  if (fontOnbellegi) return fontOnbellegi;

  const oku = async (url: string) => {
    const cevap = await fetch(url);
    if (!cevap.ok) throw new Error(`Font yüklenemedi: ${url}`);
    const tampon = await cevap.arrayBuffer();
    const baytlar = new Uint8Array(tampon);
    let ikili = "";
    const parca = 8192;
    for (let i = 0; i < baytlar.length; i += parca) {
      ikili += String.fromCharCode(...baytlar.subarray(i, i + parca));
    }
    return btoa(ikili);
  };

  const [normal, bold] = await Promise.all([
    oku("/fonts/DejaVuSans.ttf"),
    oku("/fonts/DejaVuSans-Bold.ttf"),
  ]);

  fontOnbellegi = { normal, bold };
  return fontOnbellegi;
}

export async function pdfIndir(rapor: Rapor) {
  const { jsPDF } = await import("jspdf");
  const belge = new jsPDF({ unit: "mm", format: "a4", orientation: "p" });
  const fontlar = await fontlariYukle();

  belge.addFileToVFS("DejaVuSans.ttf", fontlar.normal);
  belge.addFileToVFS("DejaVuSans-Bold.ttf", fontlar.bold);
  belge.addFont("DejaVuSans.ttf", "DejaVu", "normal");
  belge.addFont("DejaVuSans-Bold.ttf", "DejaVu", "bold");

  const { accent: VURGU, dark: KOYU, gray: GRI, soft: YUMUSAK } = MARKA.pdf;
  const kenar = 16;
  const sayfaGenisligi = 210;
  const maksGenislik = sayfaGenisligi - kenar * 2;
  let y = 24;
  let sayfa = 1;

  const sayfaKontrol = (gereken: number) => {
    if (y + gereken > 283) {
      belge.addPage();
      sayfa += 1;
      belge.setFont("DejaVu", "normal");
      belge.setFontSize(8);
      belge.setTextColor(150, 150, 150);
      belge.text(`${MARKA.ad} — Yapay Zekâ Hazırlık Raporu`, kenar, 10);
      belge.text(`Sayfa ${sayfa}`, sayfaGenisligi - kenar, 10, { align: "right" });
      y = 24;
    }
  };

  const baslik = (metin: string) => {
    sayfaKontrol(18);
    belge.setFillColor(...YUMUSAK);
    belge.roundedRect(kenar, y, maksGenislik, 10, 2, 2, "F");
    belge.setFillColor(...VURGU);
    belge.rect(kenar, y, 2.5, 10, "F");
    belge.setFont("DejaVu", "bold");
    belge.setFontSize(12);
    belge.setTextColor(...KOYU);
    belge.text(metin, kenar + 6, y + 7);
    y += 15;
  };

  const paragraf = (
    metin: string,
    boyut = 10,
    renk: [number, number, number] = GRI,
    kalin = false,
    girinti = 0,
  ) => {
    belge.setFont("DejaVu", kalin ? "bold" : "normal");
    belge.setFontSize(boyut);
    belge.setTextColor(...renk);
    const satirlar = belge.splitTextToSize(metin, maksGenislik - girinti);
    for (const satir of satirlar) {
      sayfaKontrol(6);
      belge.text(satir, kenar + girinti, y);
      y += boyut * 0.5 + 1.2;
    }
  };

  const madde = (metin: string, boyut = 9.5, renk: [number, number, number] = [68, 68, 68]) => {
    belge.setFont("DejaVu", "normal");
    belge.setFontSize(boyut);
    belge.setTextColor(...renk);
    const satirlar = belge.splitTextToSize(metin, maksGenislik - 6);
    satirlar.forEach((satir: string, i: number) => {
      sayfaKontrol(6);
      if (i === 0) {
        belge.setFillColor(...VURGU);
        belge.circle(kenar + 1.5, y - 1.4, 0.8, "F");
      }
      belge.text(satir, kenar + 5, y);
      y += boyut * 0.5 + 1;
    });
  };

  // --- Kapak ---
  belge.setFillColor(...VURGU);
  belge.rect(0, 0, sayfaGenisligi, 46, "F");
  belge.setTextColor(255, 255, 255);
  belge.setFont("DejaVu", "bold");
  belge.setFontSize(9);
  belge.text(MARKA.ad, kenar, 12);
  belge.setFontSize(22);
  belge.text("Yapay Zekâ Hazırlık Raporu", kenar, 26);
  belge.setFont("DejaVu", "normal");
  belge.setFontSize(11);
  belge.text(
    rapor.mod === "corporate" ? rapor.kurum || "Kurumsal değerlendirme" : "Bireysel değerlendirme",
    kenar,
    36,
  );

  y = 58;
  belge.setFont("DejaVu", "normal");
  belge.setFontSize(9);
  belge.setTextColor(...GRI);
  belge.text(`Tarih: ${rapor.uretimTarihi}`, kenar, y);
  belge.text(`Profil: ${rapor.modEtiketi} · ${rapor.paketEtiketi}`, kenar, y + 5);
  belge.text(
    `Yanıtlanan: ${rapor.cevaplananSayisi}/${rapor.soruSayisi} · Süre: ${rapor.gecenSureDk} dk`,
    kenar,
    y + 10,
  );
  y += 18;

  if (rapor.baglamOzeti.length) {
    belge.setFontSize(8.5);
    belge.text(
      rapor.baglamOzeti.map((b) => `${b.etiket}: ${b.deger}`).join("  ·  "),
      kenar,
      y,
    );
    y += 8;
  }

  // --- Skor kutusu ---
  sayfaKontrol(34);
  belge.setFillColor(...YUMUSAK);
  belge.roundedRect(kenar, y, maksGenislik, 30, 4, 4, "F");
  belge.setFont("DejaVu", "bold");
  belge.setFontSize(9);
  belge.setTextColor(...GRI);
  belge.text("GENEL HAZIRLIK SKORU", kenar + 8, y + 8);
  belge.setFontSize(26);
  belge.setTextColor(...VURGU);
  belge.text(`%${rapor.genelSkor.toFixed(1)}`, kenar + 8, y + 23);
  belge.setFontSize(12);
  belge.setTextColor(...KOYU);
  belge.text(rapor.bant.etiket, kenar + 55, y + 13);
  belge.setFont("DejaVu", "normal");
  belge.setFontSize(9);
  belge.setTextColor(...GRI);
  belge.splitTextToSize(rapor.bant.anlam, maksGenislik - 60).forEach((satir: string, i: number) => {
    belge.text(satir, kenar + 55, y + 19 + i * 4.4);
  });
  y += 38;

  paragraf(`Öncelik: ${rapor.bant.oncelik}`, 9.5, VURGU, true);
  y += 3;

  // --- Fark skoru ---
  if (rapor.fark) {
    baslik("Fark Skoru — Algı ile Ölçüm Arasındaki Açıklık");
    paragraf(
      `Kendini gördüğün yer: %${rapor.fark.oznel.toFixed(0)}   ·   Ölçümün gösterdiği: %${rapor.fark.nesnel.toFixed(0)}   ·   Fark: ${rapor.fark.fark > 0 ? "+" : ""}${rapor.fark.fark.toFixed(0)} puan`,
      10,
      KOYU,
      true,
    );
    paragraf(`Profil: ${rapor.fark.baslik}`, 10, VURGU, true);
    paragraf(rapor.fark.yorum, 9.5, [80, 80, 80]);
    paragraf(`Ne yapmalı: ${rapor.fark.aksiyon}`, 9.5, KOYU, true);
    y += 3;
  }

  // --- Bölümler ---
  baslik("Boyut Bazlı Performans");
  for (const bolum of rapor.bolumler) {
    sayfaKontrol(20);
    belge.setFont("DejaVu", "bold");
    belge.setFontSize(9.5);
    belge.setTextColor(...KOYU);
    belge.text(`${bolum.bolum}: ${bolum.baslik}`, kenar, y);
    belge.setFont("DejaVu", "normal");
    belge.setTextColor(...VURGU);
    belge.text(`%${bolum.yuzde.toFixed(1)}`, sayfaGenisligi - kenar, y, { align: "right" });
    y += 5;
    belge.setFillColor(...YUMUSAK);
    belge.roundedRect(kenar, y, maksGenislik, 3.5, 1.75, 1.75, "F");
    belge.setFillColor(...VURGU);
    belge.roundedRect(kenar, y, (maksGenislik * bolum.yuzde) / 100, 3.5, 1.75, 1.75, "F");
    y += 7;
    belge.setFontSize(8);
    belge.setTextColor(...GRI);
    belge.text(`${bolum.alan} · Yanıtlanan: ${bolum.cevaplanan}/${bolum.toplam}`, kenar + 1, y);
    y += 6;
  }
  y += 2;

  // --- Çerçeveler ---
  baslik("Küresel Çerçeve Uyumu");
  for (const cerceve of rapor.cerceveler) {
    sayfaKontrol(22);
    belge.setFillColor(...VURGU);
    belge.roundedRect(kenar, y, maksGenislik, 10, 2, 2, "F");
    belge.setFont("DejaVu", "bold");
    belge.setFontSize(11);
    belge.setTextColor(255, 255, 255);
    belge.text(`${cerceve.ad} — %${cerceve.genel.toFixed(1)}`, kenar + 5, y + 7);
    y += 14;
    paragraf(cerceve.amac, 9, [80, 80, 80]);
    for (const boyut of cerceve.boyutlar) {
      madde(`${boyut.baslik} (%${boyut.skor.toFixed(1)}, ${boyut.bant}): ${boyut.rehber}`);
    }
    belge.setFontSize(7.5);
    belge.setTextColor(150, 150, 150);
    for (const kaynak of cerceve.kaynaklar) {
      belge.splitTextToSize(`Kaynak: ${kaynak}`, maksGenislik).forEach((satir: string) => {
        sayfaKontrol(5);
        belge.text(satir, kenar, y);
        y += 4.2;
      });
    }
    y += 3;
  }

  baslik("Güçlü Yanların");
  for (const bolum of rapor.gucluAlanlar) {
    madde(`${bolum.baslik} — %${bolum.yuzde.toFixed(1)}`);
  }
  y += 2;

  baslik("Gelişim Alanların");
  for (const bolum of rapor.zayifAlanlar) {
    madde(`${bolum.baslik} — %${bolum.yuzde.toFixed(1)}`);
  }
  y += 2;

  baslik("Yol Haritası");
  const planlar = [
    { etiket: "İLK 30 GÜN", maddeler: rapor.aksiyonPlani.otuzGun },
    { etiket: "60-90 GÜN", maddeler: rapor.aksiyonPlani.ceyrek },
    { etiket: "0-6 AY", maddeler: rapor.aksiyonPlani.yariYil },
  ];
  for (const plan of planlar) {
    if (!plan.maddeler.length) continue;
    sayfaKontrol(12);
    belge.setFont("DejaVu", "bold");
    belge.setFontSize(10);
    belge.setTextColor(...VURGU);
    belge.text(plan.etiket, kenar, y);
    y += 5;
    belge.setFont("DejaVu", "normal");
    belge.setFontSize(9);
    belge.setTextColor(...KOYU);
    plan.maddeler.forEach((item, i) => {
      sayfaKontrol(6);
      belge.text(`${i + 1}.`, kenar + 1, y);
      belge.splitTextToSize(item, maksGenislik - 8).forEach((satir: string) => {
        sayfaKontrol(5);
        belge.text(satir, kenar + 7, y);
        y += 4.5;
      });
      y += 1;
    });
    y += 3;
  }

  baslik("Yöntem ve Sınırlar");
  for (const not of rapor.yontemNotu) {
    madde(not, 8.5, [110, 110, 110]);
  }

  belge.save(dosyaAdi(rapor, "pdf"));
}
