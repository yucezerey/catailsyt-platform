import type { QuestionItem, QuestionMode } from "./soru-bankasi";

export type CevapHaritasi = Record<string, number>;

export type BolumSkoru = {
  bolum: string;
  baslik: string;
  alan: string;
  puan: number;
  maks: number;
  yuzde: number;
  cevaplanan: number;
  toplam: number;
};

export type SeviyeBandi = {
  min: number;
  etiket: string;
  anlam: string;
  oncelik: string;
};

export type CerceveBoyutu = {
  baslik: string;
  bolumler: string[];
  rehber: string;
};

export type CerceveTanimi = {
  ad: string;
  amac: string;
  kaynaklar: string[];
  boyutlar: CerceveBoyutu[];
};

export type CerceveSonucu = {
  ad: string;
  amac: string;
  kaynaklar: string[];
  boyutlar: Array<{
    baslik: string;
    skor: number;
    rehber: string;
    bant: string;
    anlam: string;
  }>;
  genel: number;
  durum: string;
};

export type FarkProfili =
  | "asiri-guven"
  | "yetersiz-guven"
  | "kalibre-yetkin"
  | "kalibre-acemi";

export type FarkSkoru = {
  oznel: number;
  nesnel: number;
  fark: number;
  profil: FarkProfili;
  baslik: string;
  yorum: string;
  aksiyon: string;
  risk: "yuksek" | "orta" | "dusuk";
};

export const BOLUM_META: Record<string, { baslik: string; alan: string; kisa: string }> = {
  B1: { baslik: "Kavrayış ve model mantığı", alan: "Yetkinlik", kisa: "Kavrayış" },
  B2: { baslik: "Günlük uygulama alışkanlığı", alan: "Verimlilik", kisa: "Uygulama" },
  B3: { baslik: "Doğrulama ve eleştirel düşünce", alan: "Güvenilirlik", kisa: "Eleştirel değerlendirme" },
  B4: { baslik: "Risk, gizlilik ve etik", alan: "Risk", kisa: "Etik ve risk" },
  B5: { baslik: "Bilinç ve algı", alan: "Yapısal olgunluk", kisa: "Öz-yeterlik" },
  B6: { baslik: "Değişim ve etki kipi", alan: "Kullanım etkinliği", kisa: "Yerleşiklik" },
  K1: { baslik: "Strateji ve sahiplik", alan: "Yönetişim", kisa: "Strateji" },
  K2: { baslik: "Veri ve sahiplik", alan: "Yönetişim", kisa: "Veri" },
  K3: { baslik: "Altyapı ve entegrasyon", alan: "Operasyon", kisa: "Altyapı" },
  K4: { baslik: "Politika ve uyum", alan: "Yönetişim", kisa: "Politika" },
  K5: { baslik: "Yetenek ve kapasite", alan: "Kapasite", kisa: "Yetenek" },
  K6: { baslik: "Değişim yönetimi", alan: "Kültür", kisa: "Değişim" },
  K7: { baslik: "Ölçüm ve ölçekleme", alan: "Büyüme", kisa: "Ölçüm" },
};

export const SEVIYE_BANTLARI: SeviyeBandi[] = [
  {
    min: 85,
    etiket: "Stratejik olgunluk",
    anlam:
      "Güvenlik ve sorumluluk refleksleri yerleşmiş. Ölçeklenebilir bir kullanım davranışı için hazırsın.",
    oncelik: "Seviyeyi koru, ölçüm sıklığını artırarak sapmaları erken yakala.",
  },
  {
    min: 70,
    etiket: "Olgunluk aşaması",
    anlam: "Temel çerçeve oturmuş; sıra uygulama disiplinini standartlaştırmakta.",
    oncelik: "Doğrulama ve onay zincirlerini tek forma bağla, sorumluluk alanlarını netleştir.",
  },
  {
    min: 50,
    etiket: "Gelişen olgunluk",
    anlam:
      "Kullanım iyi niyetli ama süreç boşlukları var; karar kalitesi kişiden kişiye değişiyor.",
    oncelik: "Her akışa doğrulama adımı ekle, kritik kararlarda ikinci kaynak zorunlu olsun.",
  },
  {
    min: 30,
    etiket: "Temel kurulum",
    anlam: "Günlük kullanım var ama risk, denetim ve kayıt alışkanlığı zayıf.",
    oncelik: "Üç şeyle başla: sahiplik, kaynak doğrulama, olay protokolü.",
  },
  {
    min: 0,
    etiket: "Başlangıç",
    anlam: "Çerçeve henüz davranış düzeyinde görünmüyor.",
    oncelik: "Mini çerçeveyle başla: hedef belirle, hedefe göre eğitim planla.",
  },
];

const DURUM_ESIKLERI = [
  { min: 80, etiket: "İleri", durum: "kurumsal uygulanabilirlik yüksek" },
  { min: 60, etiket: "İyi", durum: "yapısal ilerleme var" },
  { min: 40, etiket: "Orta", durum: "temel bloklar oturmuş, ölçekleme için çalışılmalı" },
  { min: 20, etiket: "Gelişim", durum: "risk kontrolü ve ölçümde ciddi geliştirme gerekiyor" },
  { min: 0, etiket: "Başlangıç", durum: "tüm bloklar yeniden yapılandırılmalı" },
];

export const BOLUM_ONERILERI: Record<
  string,
  { acil: string[]; ceyrek: string[]; surdur: string[] }
> = {
  B1: {
    acil: [
      "Yapay zekâ çıktısını otomatik doğru kabul etme alışkanlığını kır: kritik her sonuç için iki kaynak karşılaştırması kuralı koy.",
      "Temel kavramları kapsayan 30 dakikalık bir kurulum eğitimi planla — halüsinasyon, bağlam penceresi, istem mantığı.",
    ],
    ceyrek: [
      "Sık kullandığın senaryolar için görev başı kontrol listesi hazırla: istem, doğrulama, kaynak kontrolü aynı yerde dursun.",
    ],
    surdur: ["Yeni model ve araç güncellemelerini ekiple haftalık 15 dakikalık bir notta paylaş."],
  },
  B2: {
    acil: [
      "Kullanımını ölçülebilir hale getir: sıklık, kalite kontrol oranı ve yeniden çalıştırma sayısını haftalık kaydet.",
      "İş akışın için en az iki örnek istem şablonu standardı çıkar; dağınık kullanımın etkisini düşürür.",
    ],
    ceyrek: ["Pilot iş akışlarına hedefli metrik ekle: zaman, doğruluk, revizyon oranı."],
    surdur: ["Başarılı istem örneklerini takım içinde küçük bir kütüphane olarak yayımla."],
  },
  B3: {
    acil: [
      "Rapor ve analizlerdeki rakamlar için kaynak zinciri zorunluluğu getir; kaynağı olmayan çıktı paylaşıma girmesin.",
      "Kritik karar öncesi en az bir bağımsız doğrulama adımını zorunlu kıl.",
    ],
    ceyrek: [
      "Yanlış çıkan sonuçları sınıflandırıp ortak bir ders notunda topla; aynı hata iki kez tekrarlanmasın.",
    ],
    surdur: ["Riskli sonuç örneklerini düzenli aralıklarla gözden geçirip arşive ekle."],
  },
  B4: {
    acil: [
      "Anonimleştirme ve erişim sınırı olmadan kurumsal belgeleri yapay zekâya verme.",
      "Hassas veri için — sözleşme, müşteri, sağlık bilgisi — onay akışını zorunlu hale getir.",
    ],
    ceyrek: ["Tedarikçi seçimi için güvenlik ve kullanım koşulları inceleme listesi oluştur."],
    surdur: ["Yapay zekâ kararlarına itiraz ve inceleme sürecini tek bir akışta yönet."],
  },
  B5: {
    acil: [
      "Yapay zekâyı ne kadar karar verici, ne kadar karar destek aracı gördüğünü ekiple açıkça konuş.",
      "Bilgi eksikliği hissi yüksekse göreve özel bir mini öğrenme akışı başlat.",
    ],
    ceyrek: ["Önemli kararlarda yapay zekâ önerisini doğrudan onaylama; kendi kararını yazılı gerekçelendir."],
    surdur: ["Tekrar eden yanlış inanışları düzelten içeriği güncel tut."],
  },
  B6: {
    acil: [
      "Ölçülebilir etkisi olmayan kullanım kalıplarını ayıkla; her işe başlarken hedef ve başarı ölçütü yaz.",
      "Sorun çözüm ve destek kanallarını tek bir etki odaklı dokümanda topla.",
    ],
    ceyrek: ["Yapay zekâ ile yapılan işlerde zaman, maliyet ve hata iyileşmesini aylık raporla."],
    surdur: ["Takım içi paylaşım ve öğrenme saatlerini takvime sabitle."],
  },
  K1: {
    acil: [
      "Yapay zekâ vizyonunu gelir ve operasyon hedefiyle eşleyen bir dokümana geçir; sahip rolleri yaz.",
      "Kurumsal hedefi KPI'larla ilişkilendirmeyen ekipler için 30 günlük kapanış planı oluştur.",
    ],
    ceyrek: ["Kurum içi karar akışını yönetim kurulu okuryazarlığı seviyesinde özetleyen bir çerçeve notu yayımla."],
    surdur: ["Üst yönetim sponsorluğunda aylık ilerleme kontrolü uygula."],
  },
  K2: {
    acil: [
      "Veri sahipliği belirsizse ilk adım net: data owner ve data steward ataması yap.",
      "Kullanıma girecek her veri akışı için amaç, saklama süresi ve silme kuralını yaz.",
    ],
    ceyrek: ["Veri kalite ve etiket standartlarını tek bir iç kontrol listesinde sabitle."],
    surdur: ["Departmanlar arası veri erişimini role dayalı ve izlenebilir kıl."],
  },
  K3: {
    acil: [
      "Entegrasyonda API anahtar yönetimi, kayıt tutma ve erişim haklarını standartlaştır.",
      "Pilot çözümlerde teknik borç birikmeden yük ve devretme testi yap.",
    ],
    ceyrek: ["Çıktı kaydı, sürümleme ve tekrar üretme mekanizmasını kur."],
    surdur: ["Hizmet seviyesi ve güvenlik sınırlarını düzenli ölç, metrikleri takvimde görünür kıl."],
  },
  K4: {
    acil: [
      "Politika, tedarikçi denetimi ve olay prosedürü olmadan kullanımı genişletme.",
      "Yanlış cevap, gizlilik sızıntısı ve etik şikayeti olay müdahale akışına bağla.",
    ],
    ceyrek: ["Sistem envanteri ve risk sınıflandırmasını aylık güncelle."],
    surdur: ["Regülasyon takibini takvimde otomatikleştir: KVKK, AI Act, sektörel yükümlülükler."],
  },
  K5: {
    acil: [
      "Yetenek planı olmayan ekipte kullanım artar ama kalite düşer; KPI bazlı eğitim haritası çıkar.",
      "Yetkinlik seviyesine göre rol tabanlı eğitim paketi ata — satış, hukuk, operasyon ayrı ayrı.",
    ],
    ceyrek: ["Çapraz mentor ve şampiyon modeliyle bilgiye erişim bariyerini düşür."],
    surdur: ["Şirket içi beceri anketini altı ayda bir güncelle."],
  },
  K6: {
    acil: [
      "Değişim planı yoksa direnç teknoloji kabulünü yavaşlatır; iletişim ve kapasite planını birlikte aç.",
      "İş kaybı algısını açıklığa kavuşturmak için lider iletişimini standartlaştır.",
    ],
    ceyrek: ["Geri bildirim kanalını anonim ve düzenli hale getir."],
    surdur: ["Eğitim ile uygulama arasındaki öğrenme döngüsünü iki haftada bir değerlendir."],
  },
  K7: {
    acil: [
      "Çıktı vermeyen pilotları büyütme; başarı kriterlerini önceden belirle.",
      "Toparlanmış KPI olmadan yatırımın sürdürülebilirliği düşer; ölçüm çerçevesini netleştir.",
    ],
    ceyrek: ["Yıl sonunda değil aylık etki haritası üret: hangi proje, hangi süreç, hangi kazanç."],
    surdur: ["Üretime alınmış sistemlerin periyodik kalite geri bildirimini kurum standardı yap."],
  },
};

export const CERCEVE_KUTUPHANESI: Record<QuestionMode, CerceveTanimi[]> = {
  individual: [
    {
      ad: "NIST AI RMF 1.0",
      amac: "Govern-Map-Measure-Manage mantığıyla güvenli ve sorumlu kullanım alışkanlığı",
      kaynaklar: [
        "https://www.nist.gov/itl/ai-risk-management-framework",
        "https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf",
      ],
      boyutlar: [
        {
          baslik: "Govern",
          bolumler: ["B1", "B5", "B6"],
          rehber: "Karar sorumluluğu, doğrulama ve güvenlik davranışlarının kişisel düzeyde benimsenmesi.",
        },
        {
          baslik: "Map",
          bolumler: ["B1", "B2"],
          rehber: "Kullanım senaryolarının niyet ve sınırlarını netleştiren farkındalık.",
        },
        {
          baslik: "Measure",
          bolumler: ["B3", "B4", "B6"],
          rehber: "Doğruluk, kaynak güvenilirliği ve sonuç kalitesi için ölçüm disiplini.",
        },
        {
          baslik: "Manage",
          bolumler: ["B3", "B4", "B6"],
          rehber: "Hatayı kapatan, düzeltmeyi tekrar eden bir kullanım alışkanlığı.",
        },
      ],
    },
    {
      ad: "OECD AI İlkeleri",
      amac: "Kapsayıcı ve açıklanabilir kullanım için davranış standardı",
      kaynaklar: [
        "https://oecd.ai/en/principles",
        "https://legalinstruments.oecd.org/en/instruments/oecd-legal-0449",
      ],
      boyutlar: [
        {
          baslik: "Güven ve şeffaflık",
          bolumler: ["B1", "B3", "B4"],
          rehber: "Yorum ve sonuçlarda doğruluğun ve şeffaflığın korunması.",
        },
        {
          baslik: "Sorumluluk",
          bolumler: ["B4", "B5", "B6"],
          rehber: "Kullanıcının karar sahibi kimliğini ve hesap verebilirliğini netleştirmesi.",
        },
      ],
    },
    {
      ad: "McKinsey AI Trust Maturity",
      amac: "Kullanıcı düzeyinde güven ve kurumsal uyum sinyalini konumlamak",
      kaynaklar: [
        "https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/tech-forward/insights-on-responsible-ai-from-the-global-ai-trust-maturity-survey",
      ],
      boyutlar: [
        {
          baslik: "Stratejik kullanım",
          bolumler: ["B1", "B2"],
          rehber: "Kişisel hedefi iş hedefiyle bağlama yetkinliği.",
        },
        {
          baslik: "Operasyonel disiplin",
          bolumler: ["B3", "B6"],
          rehber: "Kontrolsüz deneme yerine sistematik uygulama düzeni.",
        },
      ],
    },
  ],
  corporate: [
    {
      ad: "NIST AI RMF 1.0",
      amac: "Kurumsal yönetişim ve güvenli kullanım için yapı kurma",
      kaynaklar: [
        "https://www.nist.gov/itl/ai-risk-management-framework",
        "https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf",
      ],
      boyutlar: [
        {
          baslik: "Govern",
          bolumler: ["K1", "K4", "K6"],
          rehber: "Sahiplik, politika, yetki ve olay yönetimi çerçevesini kurumsallaştırma.",
        },
        {
          baslik: "Map",
          bolumler: ["K2", "K3", "K4"],
          rehber: "Veri ve sistem risklerinin iş bağlamında doğru haritasını çıkarma.",
        },
        {
          baslik: "Measure",
          bolumler: ["K3", "K7"],
          rehber: "Kullanımın teknik kalitesini ve güvenilirliğini ölçülebilir kılma.",
        },
        {
          baslik: "Manage",
          bolumler: ["K4", "K6", "K7"],
          rehber: "Bulunan riskleri azaltan düzeltici süreçlerin işletilmesi.",
        },
      ],
    },
    {
      ad: "ISO/IEC 42001",
      amac: "Sürdürülebilir bir yapay zekâ yönetim sistemi disiplini",
      kaynaklar: [
        "https://www.iso.org/standard/42001",
        "https://www.bsigroup.com/en-US/products-and-services/standards/iso-42001-ai-management-system/",
      ],
      boyutlar: [
        {
          baslik: "Politika ve çerçeve",
          bolumler: ["K1", "K4"],
          rehber: "Süreç, rol ve amaçların standartlara bağlanması.",
        },
        {
          baslik: "Risk ve uyum",
          bolumler: ["K2", "K4", "K7"],
          rehber: "Risk kaydı, gözlem ve denetim gerekliliklerinin kurulumu.",
        },
        {
          baslik: "Süreklilik",
          bolumler: ["K5", "K6", "K7"],
          rehber: "Yetenek ve ölçüm döngüsünün sürekli iyileştirmeyle çalışması.",
        },
      ],
    },
    {
      ad: "OECD AI İlkeleri",
      amac: "Küresel ilkelerle güven, şeffaflık ve hesap verebilirlik uyumu",
      kaynaklar: [
        "https://legalinstruments.oecd.org/en/instruments/oecd-legal-0449",
        "https://oecd.ai/en/principles",
      ],
      boyutlar: [
        {
          baslik: "İnsan merkezli kullanım",
          bolumler: ["K2", "K4", "K5"],
          rehber: "Veri sahipliği ve model kullanımı taraflılığa karşı güvenceye alınmalı.",
        },
        {
          baslik: "Şeffaflık ve açıklanabilirlik",
          bolumler: ["K1", "K4", "K7"],
          rehber: "Kararın nedeni ve yöntemi yönetişimde açıkça tanımlanmalı.",
        },
      ],
    },
    {
      ad: "EU AI Act",
      amac: "Yüksek risk ve yükümlülük farkındalığıyla regülasyon okuması",
      kaynaklar: [
        "https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems",
      ],
      boyutlar: [
        {
          baslik: "Uyum ve şeffaflık",
          bolumler: ["K4", "K7"],
          rehber: "Kullanıcıya ve düzenleyiciye bilgi verme, etki ve kullanım bilgisi akışı.",
        },
        {
          baslik: "Risk kontrolü ve kayıt",
          bolumler: ["K3", "K4", "K7"],
          rehber: "Kayıt, belge ve olay dosyaları düzenleyiciyle konuşulabilir seviyeye taşınsın.",
        },
      ],
    },
    {
      ad: "McKinsey AI Trust Maturity",
      amac: "Kurum olgunluğunu strateji-risk-veri-operasyon ekseninde konumlama",
      kaynaklar: [
        "https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/tech-forward/insights-on-responsible-ai-from-the-global-ai-trust-maturity-survey",
      ],
      boyutlar: [
        {
          baslik: "Strateji ve sahiplenme",
          bolumler: ["K1", "K2"],
          rehber: "Yapısal karar sahipliği ile hızlı uygulama arasındaki denge.",
        },
        {
          baslik: "Operasyon modeli",
          bolumler: ["K3", "K5", "K6", "K7"],
          rehber: "Çalıştırma, öğrenme ve ölçüm döngüsünün olgunluğu.",
        },
      ],
    },
  ],
};

export function sinirla(deger: number) {
  return Math.max(0, Math.min(100, deger));
}

export function secenekPuani(soru: QuestionItem, indeks: number) {
  const adet = soru.options.length;
  if (Number.isNaN(indeks) || indeks < 0 || indeks >= adet) return 0;
  const ham = soru.reverse ? adet - 1 - indeks : indeks;
  return (ham / (adet - 1)) * 4;
}

export function bolumSkorlari(sorular: QuestionItem[], cevaplar: CevapHaritasi): BolumSkoru[] {
  const kovalar: Record<string, BolumSkoru> = {};

  for (const soru of sorular) {
    if (!kovalar[soru.section]) {
      const meta = BOLUM_META[soru.section] ?? {
        baslik: soru.section,
        alan: "Diğer",
        kisa: soru.section,
      };
      kovalar[soru.section] = {
        bolum: soru.section,
        baslik: meta.baslik,
        alan: meta.alan,
        puan: 0,
        maks: 0,
        yuzde: 0,
        cevaplanan: 0,
        toplam: 0,
      };
    }

    const kova = kovalar[soru.section];
    kova.maks += 4;
    kova.toplam += 1;

    if (cevaplar[soru.id] === undefined) continue;
    kova.cevaplanan += 1;
    kova.puan += secenekPuani(soru, cevaplar[soru.id]);
  }

  return Object.values(kovalar)
    .map((kova) => ({ ...kova, yuzde: kova.maks ? (kova.puan / kova.maks) * 100 : 0 }))
    .sort((a, b) => a.bolum.localeCompare(b.bolum));
}

export function bantBul(yuzde: number): SeviyeBandi {
  return SEVIYE_BANTLARI.find((b) => yuzde >= b.min) ?? SEVIYE_BANTLARI[SEVIYE_BANTLARI.length - 1];
}

export function durumBul(yuzde: number) {
  return DURUM_ESIKLERI.find((d) => yuzde >= d.min) ?? DURUM_ESIKLERI[DURUM_ESIKLERI.length - 1];
}

export function cerceveSonuclari(mod: QuestionMode, bolumler: BolumSkoru[]): CerceveSonucu[] {
  return CERCEVE_KUTUPHANESI[mod].map((cerceve) => {
    const boyutlar = cerceve.boyutlar.map((boyut) => {
      const ilgili = bolumler.filter((b) => boyut.bolumler.includes(b.bolum));
      const agirlikToplami = ilgili.reduce((acc, b) => acc + (b.toplam || 0), 0);
      const ham =
        agirlikToplami === 0
          ? 0
          : ilgili.reduce((acc, b) => acc + b.yuzde * (b.toplam || 1), 0) / agirlikToplami;
      const skor = sinirla(Number.isNaN(ham) ? 0 : ham);
      const bant = bantBul(skor);

      return {
        baslik: boyut.baslik,
        skor,
        rehber: boyut.rehber,
        bant: bant.etiket,
        anlam: bant.anlam,
      };
    });

    const genel = boyutlar.length
      ? boyutlar.reduce((acc, b) => acc + b.skor, 0) / boyutlar.length
      : 0;
    const durum = durumBul(genel);

    return {
      ad: cerceve.ad,
      amac: cerceve.amac,
      kaynaklar: cerceve.kaynaklar,
      boyutlar,
      genel,
      durum: `${durum.etiket} — ${durum.durum}`,
    };
  });
}

/* ------------------------------------------------------------------
   Fark skoru — ürünün ayrışma noktası (plan §2)
   Würzburg 2025: öznel algı ile nesnel bilgi arasındaki korelasyon r = .02
   Yani "biliyorum" hissi, gerçekte ne bildiğini öngörmüyor.
   ------------------------------------------------------------------ */

const KALIBRASYON_ESIGI = 12;
const YETKINLIK_ESIGI = 60;

export function farkSkoru(oznelCevaplar: CevapHaritasi, nesnelYuzde: number): FarkSkoru | null {
  const degerler = Object.values(oznelCevaplar).filter((d) => typeof d === "number");
  if (degerler.length === 0) return null;

  const oznel = sinirla((degerler.reduce((a, b) => a + b, 0) / (degerler.length * 4)) * 100);
  const nesnel = sinirla(nesnelYuzde);
  const fark = oznel - nesnel;

  if (fark > KALIBRASYON_ESIGI) {
    return {
      oznel,
      nesnel,
      fark,
      profil: "asiri-guven",
      baslik: "Aşırı güven",
      yorum:
        "Kendini ölçümün gösterdiğinden daha yetkin görüyorsun. Kurum açısından en riskli profil bu: hatayı fark etmeyen kullanıcı, eğitimi de gereksiz görür.",
      aksiyon:
        "Önce farkındalık. En düşük iki boyutta somut bir hata örneği üzerinden çalış; doğrulama adımını zorunlu kıl.",
      risk: "yuksek",
    };
  }

  if (fark < -KALIBRASYON_ESIGI) {
    return {
      oznel,
      nesnel,
      fark,
      profil: "yetersiz-guven",
      baslik: "Yetersiz güven",
      yorum:
        "Ölçüm, kendine verdiğin nottan yüksek çıktı. Bilgi var, cesaret eksik. Bu profil kurumda çoğu zaman görünmez kalır.",
      aksiyon:
        "Görünürlük ve sorumluluk al. Bildiğini uygulamaya çevirecek bir pilot işi sahiplen.",
      risk: "orta",
    };
  }

  if (nesnel >= YETKINLIK_ESIGI) {
    return {
      oznel,
      nesnel,
      fark,
      profil: "kalibre-yetkin",
      baslik: "Kalibre yetkin",
      yorum:
        "Kendini gördüğün yer ile ölçümün gösterdiği yer örtüşüyor ve seviye yüksek. Çoğaltıcı profil.",
      aksiyon: "Mentor veya elçi rolü üstlen. Bildiğini standarda çevir, ekibe yay.",
      risk: "dusuk",
    };
  }

  return {
    oznel,
    nesnel,
    fark,
    profil: "kalibre-acemi",
    baslik: "Kalibre acemi",
    yorum:
      "Kendini gördüğün yer gerçekçi; seviye henüz düşük. Bu temiz bir başlangıç — öğrenme en hızlı buradan ilerler.",
    aksiyon: "Standart müfredat sende çalışır. En düşük boyuttan başla, sırayla ilerle.",
    risk: "dusuk",
  };
}
