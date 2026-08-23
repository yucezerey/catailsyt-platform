import { MARKA } from "../marka";
import type { Rapor } from "../rapor";
import { dosyaAdi } from "../rapor";

export async function docxIndir(rapor: Rapor) {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    Table,
    TableRow,
    TableCell,
    AlignmentType,
    ShadingType,
  } = await import("docx");

  const VURGU = MARKA.pdf.accentHex;
  const YUMUSAK = MARKA.pdf.softHex;

  const baslikHucresi = (metin: string) =>
    new TableCell({
      shading: { type: ShadingType.CLEAR, fill: VURGU },
      children: [
        new Paragraph({
          children: [new TextRun({ text: metin, bold: true, color: "FFFFFF" })],
          alignment: AlignmentType.LEFT,
        }),
      ],
    });

  const satirlar = [
    new TableRow({
      children: [baslikHucresi("Boyut"), baslikHucresi("Yanıtlanan"), baslikHucresi("Skor")],
    }),
  ];

  rapor.bolumler.forEach((bolum, i) => {
    const dolgu = i % 2 === 1 ? YUMUSAK : "FFFFFF";
    satirlar.push(
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: dolgu },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `${bolum.bolum}: ${bolum.baslik}`, bold: true }),
                  new TextRun({ text: ` (${bolum.alan})`, color: "777777" }),
                ],
              }),
            ],
          }),
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: dolgu },
            children: [new Paragraph(`${bolum.cevaplanan}/${bolum.toplam}`)],
          }),
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: dolgu },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `%${bolum.yuzde.toFixed(1)}`, color: VURGU, bold: true }),
                ],
              }),
            ],
          }),
        ],
      }),
    );
  });

  const altBaslik = (metin: string) =>
    new Paragraph({
      children: [new TextRun({ text: metin, bold: true, color: VURGU, size: 26 })],
      spacing: { before: 240, after: 120 },
    });

  const maddeler = (liste: string[]) =>
    liste.map((item) => new Paragraph({ text: item, bullet: { level: 0 } }));

  const cerceveBloklari = rapor.cerceveler.flatMap((cerceve) => [
    new Paragraph({
      text: `${cerceve.ad} — %${cerceve.genel.toFixed(1)} (${cerceve.durum})`,
      heading: HeadingLevel.HEADING_3,
    }),
    new Paragraph({ text: cerceve.amac }),
    ...cerceve.boyutlar.map(
      (boyut) =>
        new Paragraph({
          text: `${boyut.baslik}: %${boyut.skor.toFixed(1)} (${boyut.bant}) — ${boyut.rehber}`,
          bullet: { level: 1 },
        }),
    ),
    ...cerceve.kaynaklar.map(
      (kaynak) =>
        new Paragraph({
          children: [new TextRun({ text: `Kaynak: ${kaynak}`, size: 16, color: "888888" })],
        }),
    ),
  ]);

  const farkBloklari = rapor.fark
    ? [
        altBaslik("Fark Skoru — Algı ile Ölçüm Arasındaki Açıklık"),
        new Paragraph({
          children: [
            new TextRun({
              text: `Kendini gördüğün yer: %${rapor.fark.oznel.toFixed(0)} · Ölçümün gösterdiği: %${rapor.fark.nesnel.toFixed(0)} · Fark: ${rapor.fark.fark > 0 ? "+" : ""}${rapor.fark.fark.toFixed(0)} puan`,
              bold: true,
            }),
          ],
        }),
        new Paragraph({
          children: [new TextRun({ text: `Profil: ${rapor.fark.baslik}`, bold: true, color: VURGU })],
        }),
        new Paragraph({ text: rapor.fark.yorum }),
        new Paragraph({
          children: [new TextRun({ text: `Ne yapmalı: ${rapor.fark.aksiyon}`, bold: true })],
        }),
      ]
    : [];

  const belge = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: `${MARKA.ad} — Yapay Zekâ Hazırlık Raporu`,
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({ text: `Tarih: ${rapor.uretimTarihi}` }),
          new Paragraph({ text: `Profil: ${rapor.modEtiketi} · ${rapor.paketEtiketi}` }),
          ...(rapor.mod === "corporate"
            ? [new Paragraph({ text: `Kurum: ${rapor.kurum || "Belirtilmedi"}` })]
            : []),
          ...(rapor.baglamOzeti.length
            ? [
                new Paragraph({
                  text: rapor.baglamOzeti.map((b) => `${b.etiket}: ${b.deger}`).join(" · "),
                }),
              ]
            : []),
          new Paragraph({
            text: `Yanıtlanan: ${rapor.cevaplananSayisi}/${rapor.soruSayisi} · Süre: ${rapor.gecenSureDk} dk`,
            spacing: { after: 160 },
          }),

          altBaslik("Genel Skor"),
          new Paragraph({
            children: [
              new TextRun({
                text: `%${rapor.genelSkor.toFixed(1)} — ${rapor.bant.etiket}`,
                bold: true,
                size: 36,
                color: VURGU,
              }),
            ],
          }),
          new Paragraph({ text: rapor.bant.anlam }),
          new Paragraph({
            children: [new TextRun({ text: `Öncelik: ${rapor.bant.oncelik}`, bold: true })],
            spacing: { after: 160 },
          }),

          ...farkBloklari,

          altBaslik("Boyut Bazlı Performans"),
          new Table({ rows: satirlar }),
          new Paragraph({ text: " ", spacing: { after: 160 } }),

          altBaslik("Küresel Çerçeve Uyumu"),
          ...cerceveBloklari,

          altBaslik("Güçlü Yanların"),
          ...maddeler(rapor.gucluAlanlar.map((b) => `${b.baslik} — %${b.yuzde.toFixed(1)}`)),

          altBaslik("Gelişim Alanların"),
          ...maddeler(rapor.zayifAlanlar.map((b) => `${b.baslik} — %${b.yuzde.toFixed(1)}`)),

          altBaslik("İlk 30 Gün"),
          ...maddeler(rapor.aksiyonPlani.otuzGun),
          altBaslik("60-90 Gün"),
          ...maddeler(rapor.aksiyonPlani.ceyrek),
          altBaslik("0-6 Ay"),
          ...maddeler(rapor.aksiyonPlani.yariYil),

          altBaslik("Yöntem ve Sınırlar"),
          ...maddeler(rapor.yontemNotu),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(belge);
  const url = URL.createObjectURL(blob);
  const bag = document.createElement("a");
  bag.href = url;
  bag.download = dosyaAdi(rapor, "docx");
  bag.click();
  URL.revokeObjectURL(url);
}
