"use client";

import { useMemo, useRef, useState } from "react";
import type { QuestionItem, QuestionMode } from "./lib/questionBank";
import { QUESTION_BANK } from "./lib/questionBank";

type AnswerMap = Record<string, number>;

type QuestionPreset = "compact" | "standard" | "full";

type ReportSection = {
  section: string;
  sectionTitle: string;
  points: number;
  max: number;
  percentage: number;
  answered: number;
  total: number;
};

type FrameworkDimension = {
  title: string;
  sectionIds: string[];
  guidance: string;
};

type FrameworkDefinition = {
  name: string;
  purpose: string;
  sources: string[];
  dimensions: FrameworkDimension[];
};

type FrameworkResult = {
  name: string;
  purpose: string;
  sources: string[];
  dimensions: Array<{
    title: string;
    score: number;
    guidance: string;
  }>;
  overall: number;
  status: string;
};

type ReportPayload = {
  generatedAt: string;
  mode: QuestionMode;
  organizationName: string;
  questionCount: number;
  answeredCount: number;
  overallScore: number;
  level: string;
  sections: ReportSection[];
  frameworks: FrameworkResult[];
  strengths: string[];
  gaps: string[];
  actionPlan: {
    immediate: string[];
    quarter: string[];
    roadmap: string[];
  };
};

const SECTION_META: Record<string, { title: string; area: string }> = {
  B1: { title: "B1 · Kavrayış ve Model Mantığı", area: "Yetkinlik" },
  B2: { title: "B2 · Günlük Uygulama Alışkanlığı", area: "Verimlilik" },
  B3: { title: "B3 · Doğrulama ve Eleştirel Düşünce", area: "Güvenilirlik" },
  B4: { title: "B4 · Risk, Gizlilik ve Etik", area: "Risk" },
  B5: { title: "B5 · Bilinç ve Algı", area: "Yapısal Olgunluk" },
  B6: { title: "B6 · Değişim & Etki Kipi", area: "Kullanım Etkinliği" },
  K1: { title: "K1 · Strateji ve Sahiplik", area: "Kurumsal Yönetişim" },
  K2: { title: "K2 · Veri ve Sahiplik", area: "Kurumsal Yönetişim" },
  K3: { title: "K3 · Altyapı ve Entegrasyon", area: "Operasyon" },
  K4: { title: "K4 · Politika ve Uyum", area: "Yönetişim" },
  K5: { title: "K5 · Yetenek ve Kapasite", area: "Kapasite" },
  K6: { title: "K6 · Değişim Yönetimi", area: "Kültür" },
  K7: { title: "K7 · Ölçüm ve Ölçekleme", area: "Büyüme" },
};

const PRESET_COUNTS: Record<QuestionMode, Record<QuestionPreset, number>> = {
  individual: { compact: 12, standard: 24, full: 39 },
  corporate: { compact: 10, standard: 22, full: 34 },
};

const SECTION_RECOMMENDATIONS: Record<string, { critical: string[]; improve: string[]; sustain: string[] }> = {
  B1: {
    critical: [
      "AI çıktılarını otomatik doğru kabul etme alışkanlığını azaltın; her kritik sonuç için iki kaynak karşılaştırması kuralını devreye alın.",
      "Temel kavram odaklı 30 dakikalık mini bir kurulum eğitimi (hallüsinasyon, context window, prompt mantığı) planlayın.",
    ],
    improve: [
      "Sık kullanılan senaryolarda görev başı kontrol listesi hazırlayın; prompt, doğrulama, kaynak kontrol adımları bir arada olsun.",
    ],
    sustain: ["Yeni model ve araç güncellemelerini ekip içinde 15 dakikalık haftalık bullet ile paylaşın."],
  },
  B2: {
    critical: [
      "AI etkileşimini ölçülebilir hale getirin: kullanım sıklığı, kalite kontrol oranı ve yeniden çalıştırma sayısını haftalık loga alın.",
      "İş akışı için en az iki örnek istem şablonu standardı çıkarın; dağınık kullanımın etkisini düşürür.",
    ],
    improve: ["Pilot iş akışlarına hedefli metrik (zaman, doğruluk, revizyon oranı) ekleyin."],
    sustain: ["Takım içinde başarılı prompt örneklerini bir mini kütüphane olarak yayımlayın."],
  },
  B3: {
    critical: [
      "Rapor, analiz ve raporlanan rakamlar için kaynak zinciri zorunluluğu getirin; kaynağı olmadan paylaşım durdurulsun.",
      "" ,
    ],
    improve: ["Sahte güveni azaltmak için kritik karar öncesi en az tekil bir bağımsız doğrulama adımı zorunlu olsun."],
    sustain: ["Yanlış pozitif/riskli sonuçları düzenli olarak sınıflandırıp ortak ders notu halinde arşivleyin."],
  },
  B4: {
    critical: [
      "Kurumsal belgelerde anonimleştirme ve erişim sınırı olmadan AI kullanımını durdurun.",
      "Hassas veri (özellikle sözleşme, müşteri veya sağlık bilgisi) için onay akışını zorunlu hale getirin.",
    ],
    improve: ["AI tedarikçisi seçimi için güvenlik ve kullanım koşulları inceleme listesi oluşturun."],
    sustain: ["Farklı paydaşlarla AI kararlarına itiraz/inceleme sürecini tek bir süreç halinde yönetin."],
  },
  B5: {
    critical: [
      "Yapay zekânın ne kadarını iş zekası gibi, ne kadarını karar destek aracı gibi gördüğünüzü ekiple net paylaşın.",
      "Bilgi eksikliği hissi yüksek kullanıcılar için görev-özel mini öğrenme akışı başlatın.",
    ],
    improve: ["Mühim iş kararlarında AI önerisini doğrudan onaylamayın; kullanıcı kararını zorunlu edin."],
    sustain: ["Tekrarlanan yanlış inanışları (model üstün mü, her zaman doğru mu vb.) tersine çeviren içeriği güncelleyin."],
  },
  B6: {
    critical: [
      "Ölçülebilir etki metriği olmayan kullanım kalıplarını filtreleyin; metin üretime girerken hedef ve başarı ölçütü yazılmalı.",
      "Sorun çözüm ve destek kanallarını tek bir etki odaklı dokümana taşıyın.",
    ],
    improve: ["AI ile yapılan işlerde zaman-maliyet-hata iyileşme oranını aylık raporlayın."],
    sustain: ["Takım içi paylaşım ve öğrenme saatlerini düzenli takvimleyin."],
  },
  K1: {
    critical: [
      "AI vizyonunu doğrudan gelir/operasyon hedefiyle eşleyen bir dokümana geçirin; sahip rol ve sorumluluklarını yazın.",
      "Kurumsal AI hedefini KPI'larla ilişkilendirmeyen ekipler için 30 günlük kapanış planı oluşturun.",
    ],
    improve: ["Kurum içi AI karar akışını board-okuryazarlık seviyesinde özetleyen çerçeve notu yayınlayın."],
    sustain: ["Üst yönetim sponsorlu bir aylık ilerleme kontrolü uygulayın."],
  },
  K2: {
    critical: [
      "Veri sahipliği belirsizse ilk müdahale: data owner ve data steward atamasıyla başlayın.",
      "Kullanıma girecek her veri akışı için kullanım amacı, saklama süresi ve silme kuralını yazın.",
    ],
    improve: ["Veri kalite ve etiket standartlarını tek bir iç checklist ile sabitleyin."],
    sustain: ["Departmanlar arası veri erişimini role dayalı ve izlenebilir kılın."],
  },
  K3: {
    critical: [
      "AI entegrasyonunda API anahtar yönetimi, loglama ve erişim haklarını standartlaştırın.",
      "Pilot çözümlerde teknik borç birikmeden önce yük deneyi (load) ve failover testi yapın.",
    ],
    improve: ["Çıktıların kaydı, metin-versiyonlama ve tekrar etme mekanizmasını kurun."],
    sustain: ["SLA ve güvenlik sınırlarını düzenli olarak ölçün; metrikleri takvimde görünür kılın."],
  },
  K4: {
    critical: [
      "Politika, tedarikçi denetimi ve olay prosedürü olmadan AI kullanımını genişletmeyin.",
      "AI üretim olaylarını (yanlış cevap, gizlilik sızıntısı, etik şikayet) olay müdahale akışına bağlayın.",
    ],
    improve: ["AI sistem envanteri ve risk sınıflandırmasını aylık güncelleyin."],
    sustain: ["Regülasyon takibini (KVKK, AI Act, sektörel yükümlülükler) takvimde otomatize edin."],
  },
  K5: {
    critical: [
      "Yetenek planı olmayan ekiplerde kullanım artışı hızlanır ama kalite düşer; KPI bazlı eğitim haritası çıkarın.",
      "Yetkinlik seviyesine göre rol tabanlı eğitim paketi atayın (satış, hukuk, operasyon vb.).",
    ],
    improve: ["Çapraz mentor/şampiyon modeli kurarak bilgiye erişim bariyerini düşürün."],
    sustain: ["Şirket içi AI beceri anketini altı aylık dönemde güncelleyin."],
  },
  K6: {
    critical: [
      "Değişim planı yoksa direnç, teknoloji kabulünü yavaşlatır; güvenli bir plan (iletişim + kapasite) açın.",
      "AI ile iş kaybı gibi algıları açıklığa kavuşturmak için lider iletişimi standartlaştırın.",
    ],
    improve: ["Geribildirim kanalını anonim ve düzenli hale getirin."],
    sustain: ["Eğitim-uygulama arası öğrenme döngüsünü iki haftada bir değerlendirin."],
  },
  K7: {
    critical: [
      "Pilotlar çıktı vermediğinde devam ettirilen projeleri kesintisiz büyütmeyin; başarı kriterleri önceden belirleyin.",
      "Toparlanmış KPI'lar olmadan kurumsal yatırımın sürdürülebilirliği düşer; ölçüm çerçevesini netleştirin.",
    ],
    improve: ["Yıl sonunda değil aylık etki haritası üretin: hangi proje, hangi süreç, hangi kazanç."],
    sustain: ["Üretime alınmış sistemlerin periyodik kalite geri bildirimini kurum standart haline getirin."],
  },
};

const FRAMEWORK_LIBRARY: Record<QuestionMode, FrameworkDefinition[]> = {
  individual: [
    {
      name: "NIST AI RMF 1.0",
      purpose: "Govern-Map-Measure-Manage mantığıyla güvenli ve sorumlu kullanım alışkanlığı",
      sources: [
        "https://www.nist.gov/itl/ai-risk-management-framework",
        "https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf",
      ],
      dimensions: [
        {
          title: "Govern",
          sectionIds: ["B1", "B5", "B6"],
          guidance:
            "Kullanıcı karar sorumluluğu, doğrulama ve güvenlik davranışlarının kişisel düzeyde benimsenmesi.",
        },
        {
          title: "Map",
          sectionIds: ["B1", "B2"],
          guidance: "AI kullanım senaryolarının niyet ve sınırlarını netleştiren farkındalık.",
        },
        {
          title: "Measure",
          sectionIds: ["B3", "B4", "B6"],
          guidance: "Doğruluk, kaynağın güvenilirliği ve sonuç kalitesi için ölçüm disiplini.",
        },
        {
          title: "Manage",
          sectionIds: ["B3", "B4", "B6"],
          guidance: "Hataları kapatan, düzeltmeyi tekrar eden bir kullanım alıştırması.",
        },
      ],
    },
    {
      name: "OECD AI Tavsiyeleri",
      purpose: "Kapsayıcı ve açıklanabilir AI kullanımı için davranış standardı",
      sources: [
        "https://www.oecd.ai/en/principles/",
        "https://legalinstruments.oecd.org/en/instruments/oecd-legal-0449",
      ],
      dimensions: [
        {
          title: "Güven + şeffaflık",
          sectionIds: ["B1", "B3", "B4"],
          guidance: "Yorum ve sonuçlarda doğruluk ile şeffaflığın korunması.",
        },
        {
          title: "Sorumluluk",
          sectionIds: ["B4", "B5", "B6"],
          guidance: "AI kullanıcısının karar sahibi kimlik ve hesap verebilirlik rolünü netleştirmesi.",
        },
      ],
    },
    {
      name: "McKinsey AI Güvenilirlik Referansı",
      purpose: "Kullanıcı düzeyinde güven ve kurumsal uyum sinyalini ölçmek",
      sources: [
        "https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/tech-forward/insights-on-responsible-ai-from-the-global-ai-trust-maturity-survey",
      ],
      dimensions: [
        {
          title: "Stratejik kullanım",
          sectionIds: ["B1", "B2"],
          guidance: "Kullanıcı hedefini iş hedefiyle bağlama yetkinliği.",
        },
        {
          title: "Operasyonel disiplin",
          sectionIds: ["B3", "B6"],
          guidance: "Kontrolsüz deneme yerine sistematik uygulama düzeni.",
        },
      ],
    },
  ],
  corporate: [
    {
      name: "NIST AI RMF 1.0",
      purpose: "Kurumsal yönetişim ve güvenli kullanım için yapı kurma",
      sources: [
        "https://www.nist.gov/itl/ai-risk-management-framework",
        "https://www.nist.gov/itl/ai-risk-management-framework",
      ],
      dimensions: [
        {
          title: "Govern",
          sectionIds: ["K1", "K4", "K6"],
          guidance: "Sahiplik, politika, yetki ve olay yönetimi çerçevesini kurumsallaştırma.",
        },
        {
          title: "Map",
          sectionIds: ["K2", "K3", "K4"],
          guidance: "Veri ve sistem risklerinin iş bağlamında doğru haritasını çıkarma.",
        },
        {
          title: "Measure",
          sectionIds: ["K3", "K7"],
          guidance: "AI kullanımının teknik kalitesi ve güvenilirliğini ölçülebilir hale getirme.",
        },
        {
          title: "Manage",
          sectionIds: ["K4", "K6", "K7"],
          guidance: "Bulunan riskleri azaltan düzeltici ve iyileştirici süreçlerin işletilmesi.",
        },
      ],
    },
    {
      name: "ISO/IEC 42001",
      purpose: "Sürdürülebilir bir AI Yönetim Sistemi disiplini yaratma",
      sources: [
        "https://www.iso.org/standard/42001",
        "https://www.bsigroup.com/en-US/products-and-services/standards/iso-42001-ai-management-system/",
      ],
      dimensions: [
        {
          title: "Politika ve çerçeve",
          sectionIds: ["K1", "K4"],
          guidance: "Süreç, rol ve amaçların standartlara bağlanması.",
        },
        {
          title: "Risk ve uyum",
          sectionIds: ["K2", "K4", "K7"],
          guidance: "Risk kaydı, gözlem, kayıt ve denetim gerekliliklerinin kurulumu.",
        },
        {
          title: "Süreklilik",
          sectionIds: ["K5", "K6", "K7"],
          guidance: "Yetenek + ölçüm döngüsünün sürekli iyileştirmeyle çalışması.",
        },
      ],
    },
    {
      name: "OECD AI Principles",
      purpose: "Küresel ilkelerle güven, şeffaflık ve hesap verebilirlik uyumunu değerlendirme",
      sources: [
        "https://legalinstruments.oecd.org/en/instruments/oecd-legal-0449",
        "https://oecd.ai/en/principles/",
      ],
      dimensions: [
        {
          title: "İnsan merkezli ve adil kullanım",
          sectionIds: ["K2", "K4", "K5"],
          guidance: "Veri sahipliği ve model kullanımı taraflılığa karşı güvenceye alınmalı.",
        },
        {
          title: "Şeffaflık ve açıklanabilirlik",
          sectionIds: ["K1", "K4", "K7"],
          guidance: "Neden- nasıl karar verildiği yönetişimde açıkça tanımlanmalı.",
        },
      ],
    },
    {
      name: "EU AI Act (uygunluk odaklı)",
      purpose: "Yüksek risk ve yükümlülük farkındalığı ile regülasyon okuması",
      sources: [
        "https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems",
      ],
      dimensions: [
        {
          title: "Uyum ve şeffaflık",
          sectionIds: ["K4", "K7"],
          guidance: "Kullanıcı ve düzenleyiciye karşı bilgi verme, etki ve kullanım bilgisi akışı.",
        },
        {
          title: "Risk kontrolü ve loglama",
          sectionIds: ["K3", "K4", "K7"],
          guidance: "Log, belge ve olay kayıtları regülatörle konuşulabilir seviyeye taşınsın.",
        },
      ],
    },
    {
      name: "McKinsey AI Trust Maturity",
      purpose: "Kurum olgunluğunu, strateji-risk-veri-operasyon ekseninde konumlama",
      sources: [
        "https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/tech-forward/insights-on-responsible-ai-from-the-global-ai-trust-maturity-survey",
      ],
      dimensions: [
        {
          title: "Strateji ve sahiplenme",
          sectionIds: ["K1", "K2"],
          guidance: "Yapısal karar sahipliği ile hızlı ve güvenilir uygulama dengesi.",
        },
        {
          title: "Operasyon modeli",
          sectionIds: ["K3", "K5", "K6", "K7"],
          guidance: "Çalıştırma, öğrenme ve ölçüm döngüsünün olgun bir modeli.",
        },
      ],
    },
  ],
};

const STATUS_BY_SCORE = [
  { max: 100, label: "İleri", status: "Kurumsal uygulanabilirlik yüksek" },
  { max: 80, label: "İyi", status: "Yapısal ilerleme var" },
  { max: 60, label: "Orta", status: "Temel bloklar oturmuş, ölçekleme için çalışılmalı" },
  { max: 40, label: "Gelişim", status: "Risk kontrolü ve ölçümde ciddi geliştirme gerekiyor" },
  { max: 0, label: "Başlangıç", status: "Tüm bloklar yeniden yapılandırılmalı" },
];

const LEVEL_BY_PERCENT = [
  { max: 85, label: "İleri Olgunluk" },
  { max: 70, label: "Olgunlukta" },
  { max: 50, label: "Gelişen" },
  { max: 30, label: "Temel" },
  { max: -1, label: "Başlangıç" },
];

function levelFromPercent(percent: number) {
  for (const item of LEVEL_BY_PERCENT) {
    if (percent >= item.max) return item.label;
  }
  return "Başlangıç";
}

function statusFromScore(percent: number) {
  for (const item of STATUS_BY_SCORE) {
    if (percent >= item.max) return { label: item.label, status: item.status };
  }
  return { label: "Başlangıç", status: "Yeniden çerçeveleme gerekiyor" };
}

function clamp01(value: number) {
  return Math.max(0, Math.min(100, value));
}

function optionToScore(question: QuestionItem, index: number) {
  const optionCount = question.options.length;
  if (Number.isNaN(index) || index < 0 || index >= optionCount) return 0;
  const raw = question.reverse ? optionCount - 1 - index : index;
  return (raw / (optionCount - 1)) * 4;
}

function computeSections(questions: QuestionItem[], answers: AnswerMap) {
  const buckets: Record<string, ReportSection> = {};

  for (const q of questions) {
    if (!buckets[q.section]) {
      const meta = SECTION_META[q.section] ?? { title: q.section, area: "Diğer" };
      buckets[q.section] = {
        section: q.section,
        sectionTitle: `${meta.title} (${meta.area})`,
        points: 0,
        max: 0,
        percentage: 0,
        answered: 0,
        total: 0,
      };
    }

    const bucket = buckets[q.section];
    bucket.max += 4;
    bucket.total += 1;

    if (answers[q.id] === undefined) continue;

    bucket.answered += 1;
    bucket.points += optionToScore(q, answers[q.id]);
  }

  return Object.values(buckets)
    .map((item) => ({
      ...item,
      percentage: item.max ? (item.points / item.max) * 100 : 0,
    }))
    .sort((a, b) => {
      const aSection = a.section;
      const bSection = b.section;
      return aSection.localeCompare(bSection);
    });
}

function computeFrameworkResults(mode: QuestionMode, sections: ReportSection[]) {
  const defs = FRAMEWORK_LIBRARY[mode];

  return defs.map((framework) => {
    const dimScores = framework.dimensions.map((dim) => {
      const related = sections.filter((section) => dim.sectionIds.includes(section.section));
      const score =
        related.length === 0
          ? 0
          : related.reduce((acc, item) => {
              const weight = item.total ? item.total : 1;
              return acc + item.percentage * weight;
            }, 0) /
            related.reduce((acc, item) => acc + (item.total || 0), 0);

      return {
        title: dim.title,
        score: clamp01(Number.isNaN(score) ? 0 : score),
        guidance: dim.guidance,
      };
    });

    const overall =
      dimScores.length === 0
        ? 0
        : dimScores.reduce((acc, current) => acc + current.score, 0) / dimScores.length;

    const status = statusFromScore(overall);

    return {
      name: framework.name,
      purpose: framework.purpose,
      sources: framework.sources,
      dimensions: dimScores,
      overall,
      status: `${status.label} — ${status.status}`,
    };
  });
}

function buildPresetLabel(mode: QuestionMode, preset: QuestionPreset) {
  const count = PRESET_COUNTS[mode][preset];
  if (preset === "compact") return `${count} soru`;
  if (preset === "standard") return `${count} soru`;
  return `${count} soru (tam banko)`;
}

function pickQuestionSet(mode: QuestionMode, preset: QuestionPreset, attempt: number) {
  const source = QUESTION_BANK.filter((q) => q.mode === mode);
  const target = PRESET_COUNTS[mode][preset];
  if (target >= source.length) return source;

  // Round-robin by section to prevent tek başlıkta yoğunlaşma.
  const bySection = new Map<string, QuestionItem[]>();
  for (const question of source) {
    const existing = bySection.get(question.section) ?? [];
    existing.push(question);
    bySection.set(question.section, existing);
  }

  const sectionOrder = Array.from(bySection.keys()).sort();
  const selected: QuestionItem[] = [];

  let depth = 0;
  while (selected.length < target) {
    let moved = false;
    for (const section of sectionOrder) {
      const bucket = bySection.get(section) ?? [];
      if (depth < bucket.length) {
        selected.push(bucket[depth]);
        moved = true;
        if (selected.length >= target) break;
      }
    }
    if (!moved) break;
    depth += 1;
  }

  // Fallback: deterministic pseudo-random mix with attempt index.
  const fallback = [...selected];
  const extra = source.filter((q) => !fallback.some((selectedItem) => selectedItem.id === q.id));
  for (const q of extra) {
    if (fallback.length >= target) break;
    const insertion = (attempt % (fallback.length + 1)) + 1;
    fallback.splice(insertion, 0, q);
  }

  return fallback.slice(0, target);
}

function uniq(strings: string[]) {
  return [...new Set(strings.map((value) => value.trim()).filter(Boolean))];
}

function buildReport(mode: QuestionMode, company: string, questions: QuestionItem[], answers: AnswerMap): ReportPayload {
  const sections = computeSections(questions, answers);
  const totalPoints = sections.reduce((acc, item) => acc + item.points, 0);
  const maxPoints = sections.reduce((acc, item) => acc + item.max, 0);
  const overallScore = maxPoints ? clamp01((totalPoints / maxPoints) * 100) : 0;
  const level = levelFromPercent(overallScore);

  const frameworks = computeFrameworkResults(mode, sections);

  const byScoreAsc = [...sections].sort((a, b) => a.percentage - b.percentage);
  const byScoreDesc = [...sections].sort((a, b) => b.percentage - a.percentage);

  const gapAreas = byScoreAsc.slice(0, 3).map((item) => `${item.section}: ${item.sectionTitle}`);
  const strongAreas = byScoreDesc.slice(0, 2).map((item) => `${item.section}: ${item.sectionTitle}`);

  const immediate: string[] = [];
  const quarter: string[] = [];
  const roadmap: string[] = [];

  for (const section of byScoreAsc.slice(0, 2)) {
    const rec = SECTION_RECOMMENDATIONS[section.section];
    if (!rec) continue;
    immediate.push(...rec.critical);
    quarter.push(...rec.improve);
  }

  for (const section of byScoreAsc) {
    const rec = SECTION_RECOMMENDATIONS[section.section];
    if (!rec) continue;
    roadmap.push(...rec.sustain);
  }

  const actionPlan = {
    immediate: uniq(immediate).slice(0, 6),
    quarter: uniq(quarter).slice(0, 6),
    roadmap: uniq(roadmap).slice(0, 6),
  };

  return {
    generatedAt: new Date().toLocaleString("tr-TR"),
    mode,
    organizationName: company,
    questionCount: questions.length,
    answeredCount: questions.filter((q) => answers[q.id] !== undefined).length,
    overallScore,
    level,
    sections,
    frameworks,
    strengths: uniq(strongAreas),
    gaps: uniq(gapAreas),
    actionPlan,
  };
}

export default function Home() {
  const [mode, setMode] = useState<QuestionMode>("individual");
  const [pack, setPack] = useState<QuestionPreset>("standard");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [position, setPosition] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [company, setCompany] = useState("");
  const [activeQuestions, setActiveQuestions] = useState<QuestionItem[]>([]);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const assessmentRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const progress = activeQuestions.length ? (Object.keys(answers).length / activeQuestions.length) * 100 : 0;
  const current = activeQuestions[position];

  const report = useMemo(
    () => (done ? buildReport(mode, company, activeQuestions, answers) : null),
    [done, mode, company, activeQuestions, answers],
  );

  const sectionStats = useMemo(() => {
    const sections = computeSections(activeQuestions, answers);
    return sections;
  }, [activeQuestions, answers]);

  const frameworkStats = useMemo(() => {
    if (!activeQuestions.length) return [];
    return computeFrameworkResults(mode, sectionStats);
  }, [activeQuestions, sectionStats, mode]);

  const overallScore = useMemo(() => {
    const totalPoints = sectionStats.reduce((acc, section) => acc + section.points, 0);
    const maxPoints = sectionStats.reduce((acc, section) => acc + section.max, 0);
    return maxPoints ? clamp01((totalPoints / maxPoints) * 100) : 0;
  }, [sectionStats]);

  const overallStatus = statusFromScore(overallScore);

  const start = () => {
    setAttempt((value) => value + 1);
    setStarted(true);
    setDone(false);
    setPosition(0);
    setAnswers({});
    setActiveQuestions(pickQuestionSet(mode, pack, attempt + 1));
    setTimeout(() => {
      assessmentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const chooseMode = (nextMode: QuestionMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setStarted(false);
    setDone(false);
    setPosition(0);
    setAnswers({});
    setActiveQuestions([]);
    setPack("standard");
  };

  const selectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const next = () => {
    if (!current) return;
    if (position < activeQuestions.length - 1) {
      setPosition((prev) => prev + 1);
      return;
    }

    setDone(true);
    setTimeout(() => {
      reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const prev = () => {
    if (position > 0) setPosition((prev) => prev - 1);
  };

  const reset = () => {
    setStarted(false);
    setDone(false);
    setPosition(0);
    setAnswers({});
    setActiveQuestions([]);
  };

  const downloadPdf = async () => {
    if (!report) return;
    setIsExportingPdf(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "p" });
      const marginLeft = 14;
      const maxWidth = 182;
      let y = 18;

      const addLine = (text: string, fontSize = 10, bold = false) => {
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxWidth);
        for (const line of lines) {
          if (y >= 285) {
            doc.addPage();
            y = 18;
          }
          doc.text(line, marginLeft, y);
          y += 6;
        }
      };

      addLine("CatAIlsyt: AI Okur-Yazarlık ve Uyum Raporu", 14, true);
      addLine(`Tarih: ${report.generatedAt}`);
      addLine(`Profil: ${report.mode === "corporate" ? "Kurumsal" : "Bireysel"}`);
      if (report.mode === "corporate") {
        addLine(`Kurum: ${report.organizationName || "Belirtilmedi"}`);
      }
      addLine(`Soru sayısı: ${report.answeredCount}/${report.questionCount}`);
      addLine(`Genel skor: %${report.overallScore.toFixed(1)} (${report.level})`, 11, true);
      y += 4;

      addLine("Bölüm skoru", 11, true);
      for (const section of report.sections) {
        addLine(
          `${section.section} ${section.sectionTitle}: %${section.percentage.toFixed(1)} (${section.answered}/${section.total})`,
          10,
        );
      }
      y += 4;

      addLine("Global çerçeve eşleşmesi", 11, true);
      for (const framework of report.frameworks) {
        addLine(`\n${framework.name} — %${framework.overall.toFixed(1)} (${framework.status})`, 10, true);
        for (const dim of framework.dimensions) {
          addLine(`• ${dim.title}: %${dim.score.toFixed(1)} — ${dim.guidance}`, 9);
        }
        for (const source of framework.sources) {
          addLine(`- ${source}`, 8);
        }
      }

      addLine("\nGüçlü nokta (3)", 11, true);
      for (const item of report.strengths) addLine(`- ${item}`, 9);
      addLine("\nİyileştirme alanları (3)", 11, true);
      for (const item of report.gaps) addLine(`- ${item}`, 9);

      addLine("\nEylem Planı", 11, true);
      addLine("30 gün:", 10, true);
      for (const item of report.actionPlan.immediate) addLine(`- ${item}`, 9);
      addLine("60-90 gün:", 10, true);
      for (const item of report.actionPlan.quarter) addLine(`- ${item}`, 9);
      addLine("0-6 ay:", 10, true);
      for (const item of report.actionPlan.roadmap) addLine(`- ${item}`, 9);

      const safeName = report.mode === "corporate" && report.organizationName ? report.organizationName.replace(/[^a-zA-Z0-9-_]/g, "-") : "bireysel";
      const now = new Date().toISOString().slice(0, 10);
      doc.save(`catailsyt-${report.mode}-${safeName}-${now}.pdf`);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const downloadDocx = async () => {
    if (!report) return;
    setIsExportingDocx(true);
    try {
      const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        HeadingLevel,
        Table,
        TableRow,
        TableCell,
        WidthType,
        AlignmentType,
      } = await import("docx");

      const rows = [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 45, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ text: "Bölüm", alignment: AlignmentType.LEFT })],
            }),
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ text: "Yanıtlanan", alignment: AlignmentType.LEFT })],
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ text: "Skor", alignment: AlignmentType.LEFT })],
            }),
          ],
        }),
      ];

      for (const section of report.sections) {
        rows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph(`${section.section}: ${section.sectionTitle}`)],
              }),
              new TableCell({
                children: [new Paragraph(`${section.answered}/${section.total}`)],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: `%${section.percentage.toFixed(1)}` })] })],
              }),
            ],
          }),
        );
      }

      const frameworkParagraphs = frameworkStats.map((framework) => [
        new Paragraph({
          text: `${framework.name} — %${framework.overall.toFixed(1)} (${framework.status})`,
          heading: HeadingLevel.HEADING_3,
        }),
        ...framework.dimensions.map(
          (dim) =>
            new Paragraph({
              text: `${dim.title}: %${dim.score.toFixed(1)} — ${dim.guidance}`,
              bullet: { level: 1 },
            }),
        ),
        new Paragraph({
          text: framework.sources.map((source) => `• ${source}`).join("\n"),
        }),
      ]).flat();

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: "CatAIlsyt: AI Okur-Yazarlık ve Uyum Raporu",
                heading: HeadingLevel.TITLE,
              }),
              new Paragraph({ text: `Tarih: ${report.generatedAt}` }),
              new Paragraph({ text: `Profil: ${report.mode === "corporate" ? "Kurumsal" : "Bireysel"}` }),
              report.mode === "corporate"
                ? new Paragraph({ text: `Kurum: ${report.organizationName || "Belirtilmedi"}` })
                : new Paragraph({ text: "Kurum bilgisi girilmedi" }),
              new Paragraph({
                text: `Soru sayısı: ${report.answeredCount}/${report.questionCount} — Genel skor: %${report.overallScore.toFixed(1)} (${report.level})`,
                spacing: { after: 240 },
              }),
              new Paragraph({
                text: "Bölüm Performansları",
                heading: HeadingLevel.HEADING_2,
              }),
              new Table({ rows }),
              new Paragraph({ text: " ", spacing: { after: 200 } }),
              new Paragraph({
                text: "Global Çerçeve Uyumları",
                heading: HeadingLevel.HEADING_2,
              }),
              ...frameworkParagraphs,
              new Paragraph({
                text: "Güçlü Noktalar",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 120 },
              }),
              ...report.strengths.map((item) => new Paragraph({ text: `• ${item}`, bullet: { level: 0 } })),
              new Paragraph({
                text: "Dikkat Alanları",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 120 },
              }),
              ...report.gaps.map((item) => new Paragraph({ text: `• ${item}`, bullet: { level: 0 } })),
              new Paragraph({
                text: "30 Gün",
                heading: HeadingLevel.HEADING_2,
              }),
              ...report.actionPlan.immediate.map((item) => new Paragraph({ text: `• ${item}`, bullet: { level: 0 } })),
              new Paragraph({
                text: "60-90 Gün",
                heading: HeadingLevel.HEADING_2,
              }),
              ...report.actionPlan.quarter.map((item) => new Paragraph({ text: `• ${item}`, bullet: { level: 0 } })),
              new Paragraph({
                text: "0-6 Ay",
                heading: HeadingLevel.HEADING_2,
              }),
              ...report.actionPlan.roadmap.map((item) => new Paragraph({ text: `• ${item}`, bullet: { level: 0 } })),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const safeName = report.mode === "corporate" && report.organizationName ? report.organizationName.replace(/[^a-zA-Z0-9-_]/g, "-") : "bireysel";
      const now = new Date().toISOString().slice(0, 10);
      anchor.href = url;
      anchor.download = `catailsyt-${report.mode}-${safeName}-${now}.docx`;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExportingDocx(false);
    }
  };


  return (
    <div className="min-h-screen bg-white text-[#101010]">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 lg:px-8">
        <header className="rounded-[28px] border border-[#fde5ee] bg-white p-8 shadow-sm">
          <p className="inline-flex rounded-full bg-[#fff0f3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#9c1938]">
            CatAIlsyt | AI Readiness Platform
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-[#111] md:text-5xl">
            Soru sayısı artırıldı — güvenilirlik için ayrıntılı, global çerçeveli rapor
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#4b4b4b] md:text-lg">
            Bireysel ve kurumsal modlarda, Apple tarzı beyaz-zemin arayüzde; NIST AI RMF, ISO/IEC 42001, OECD ve EU AI Act
            referanslarıyla puanlama yapar. Sonuçlar PDF ve DOCX olarak indirilir.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="rounded-full bg-[#b91737] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a20f31]"
              onClick={() => {
                setMode((prev) => prev);
                if (!started) {
                  setActiveQuestions(pickQuestionSet(mode, pack, attempt));
                }
                start();
              }}
            >
              Testi Başlat
            </button>
            <a href="#features" className="rounded-full border border-[#ffc5d4] px-5 py-3 text-sm font-semibold text-[#7c1936]">
              Çıktı formatlarını gör
            </a>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]" ref={assessmentRef}>
          <article className="rounded-[28px] border border-[#fed9e4] bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">CatAIlsyt Ölçüm Motoru</h2>
                <p className="mt-1 text-xs text-[#6a6a6a]">Mod ve soru paketi seçin</p>
              </div>
              <div className="text-xs font-semibold text-[#7c1834]">
                {mode === "corporate" ? "Kurumsal" : "Bireysel"}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => chooseMode("individual")}
                className={`rounded-full border px-4 py-2 text-sm ${
                  mode === "individual"
                    ? "border-[#b91737] bg-[#fff0f3] text-[#8c1734]"
                    : "border-[#f0cad6] text-[#7c1d34]"
                }`}
              >
                Bireysel Katılımcı
              </button>
              <button
                onClick={() => chooseMode("corporate")}
                className={`rounded-full border px-4 py-2 text-sm ${
                  mode === "corporate"
                    ? "border-[#b91737] bg-[#fff0f3] text-[#8c1734]"
                    : "border-[#f0cad6] text-[#7c1d34]"
                }`}
              >
                Kurumsal
              </button>
            </div>

            {mode === "corporate" && (
              <label className="mt-4 block text-sm text-[#4a4a4a]">
                Kurum adı
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="Örn: Örnek Teknoloji"
                  className="mt-1 w-full rounded-xl border border-[#ffd5df] px-4 py-2 outline-none ring-[#b91737]/30 focus:ring-2"
                />
              </label>
            )}

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {(Object.keys(PRESET_COUNTS[mode]) as QuestionPreset[]).map((option) => {
                const label = buildPresetLabel(mode, option);
                return (
                  <button
                    key={option}
                    onClick={() => setPack(option)}
                    className={`rounded-xl border px-3 py-2 text-left text-sm ${
                      pack === option
                        ? "border-[#b91737] bg-[#fff0f3] text-[#8b1938]"
                        : "border-[#f1ccd7] text-[#6f6f6f]"
                    }`}
                  >
                    <p className="font-semibold">{label}</p>
                    <p className="text-[12px] text-[#7a7a7a]">
                      {option === "compact"
                        ? "Hızlı seans"
                        : option === "standard"
                          ? "Detaylı seans"
                          : "Soru bankasının tamamı"}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 h-2 rounded-full bg-[#ffe7ee]">
              <div className="h-2 rounded-full bg-[#b91737] transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-[#666]">İlerleme: {Math.round(progress)}%</p>

            {!started && (
              <>
                <button
                  onClick={() => {
                    setActiveQuestions(pickQuestionSet(mode, pack, attempt));
                    start();
                  }}
                  className="mt-5 rounded-full bg-[#111] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Teste Başla
                </button>
              </>
            )}

            {started && current && !done && (
              <div className="mt-4 space-y-4">
                <p className="text-sm text-[#a13f53]">
                  Soru {position + 1} / {activeQuestions.length}
                </p>
                <h3 className="text-xl font-semibold text-[#111]">{current.prompt}</h3>
                <p className="text-xs text-[#6b6b6b]">Bölüm: {SECTION_META[current.section]?.title ?? current.section}</p>

                <div className="space-y-2">
                  {current.options.map((option, index) => {
                    const active = answers[current.id] === index;
                    return (
                      <button
                        key={`${current.id}-${index}`}
                        onClick={() => selectAnswer(current.id, index)}
                        className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                          active ? "border-[#b91737] bg-[#fff0f3] text-[#6f1128]" : "border-[#f3c7d5] text-[#4e4e4e] hover:bg-[#fff7fa]"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={prev}
                    disabled={position === 0}
                    className="rounded-full border border-[#f2bfd0] px-5 py-2 text-sm text-[#6f6f6f] disabled:opacity-40"
                  >
                    Geri
                  </button>
                  <button
                    onClick={next}
                    disabled={answers[current.id] === undefined}
                    className="rounded-full bg-[#b91737] px-5 py-2 text-sm font-semibold text-white disabled:bg-[#cf9fac]"
                  >
                    {position === activeQuestions.length - 1 ? "Sonuçları Oluştur" : "İleri"}
                  </button>
                </div>
              </div>
            )}

            {done && report && (
              <div className="space-y-4" ref={reportRef}>
                <div className="rounded-2xl border border-[#f4d0de] bg-[#fff8fb] p-4">
                  <h3 className="text-2xl font-semibold">{mode === "corporate" ? company || "Kurumsal" : "Bireysel"} Rapor</h3>
                  <p className="mt-1 text-sm text-[#6d6d6d]">{report.questionCount} soru tamamlandı.</p>
                  <p className="mt-2 text-4xl font-bold text-[#b91737]">%{report.overallScore.toFixed(1)}</p>
                  <p className="mt-1 text-sm text-[#6d6d6d]">Seviye: {report.level}</p>
                  <p className="mt-2 text-sm text-[#555]">{overallStatus.label} — {overallStatus.status}</p>
                </div>

                <div className="space-y-2">
                  {sectionStats.map((bucket) => (
                    <div key={bucket.section} className="rounded-xl border border-[#f4d2df] p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>{bucket.section}: {bucket.sectionTitle}</span>
                        <strong className="text-[#b91737]">%{bucket.percentage.toFixed(1)}</strong>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-[#ffe4ec]">
                        <div className="h-2 rounded-full bg-[#b91737]" style={{ width: `${bucket.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-[#f2d4df] bg-[#fff8fb] p-4">
                  <h4 className="font-semibold">Global Çerçeve Haritası</h4>
                  <div className="mt-3 space-y-2">
                    {frameworkStats.map((framework) => (
                      <div key={framework.name} className="rounded-lg border border-[#eed3df] bg-white p-3">
                        <p className="text-sm font-semibold text-[#6f1a34]">{framework.name}</p>
                        <p className="text-xs text-[#666]">Genel: %{framework.overall.toFixed(1)} — {framework.status}</p>
                        <div className="mt-2 space-y-2">
                          {framework.dimensions.map((dim) => (
                            <p key={dim.title} className="text-xs text-[#4a4a4a]">
                              {dim.title}: %{dim.score.toFixed(1)}
                            </p>
                          ))}
                        </div>
                        <p className="mt-2 text-[11px] text-[#737373]">
                          {framework.sources.join(" | ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[#f1d8e2] bg-[#fff8fb] p-4">
                  <h4 className="font-semibold">Harekete Geçirilebilir Çıktılar</h4>

                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs font-semibold text-[#5f102a]">30 gün</p>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-[#444]">
                        {report.actionPlan.immediate.slice(0, 4).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs font-semibold text-[#5f102a]">60–90 gün</p>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-[#444]">
                        {report.actionPlan.quarter.slice(0, 4).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs font-semibold text-[#5f102a]">0–6 ay</p>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-[#444]">
                        {report.actionPlan.roadmap.slice(0, 4).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={downloadPdf}
                    disabled={isExportingPdf}
                    className="rounded-full bg-[#111] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    {isExportingPdf ? "PDF hazırlanıyor..." : "PDF indir"}
                  </button>
                  <button
                    onClick={downloadDocx}
                    disabled={isExportingDocx}
                    className="rounded-full border border-[#f3c0d1] px-5 py-2.5 text-sm font-semibold text-[#6f2136] disabled:opacity-40"
                  >
                    {isExportingDocx ? "DOCX hazırlanıyor..." : "DOCX indir"}
                  </button>
                  <button
                    onClick={reset}
                    className="rounded-full bg-[#f0f0f0] px-5 py-2.5 text-sm font-semibold text-[#3f3f3f]"
                  >
                    Tekrar Başlat
                  </button>
                </div>
              </div>
            )}
          </article>

          <section id="features" className="rounded-[28px] border border-[#fde5ee] bg-white p-6 space-y-3">
            <h2 className="text-lg font-semibold">Neler eklendi</h2>
            <ul className="space-y-3 text-sm text-[#555]">
              <li className="rounded-xl border border-[#ffd9e2] bg-[#fff8fb] p-3">Bireysel banko: 39 soru, kurumsal banko: 34 soru (esnek paketleme).</li>
              <li className="rounded-xl border border-[#ffd9e2] bg-[#fff8fb] p-3">Çerçeve eşleşmesi: NIST AI RMF, ISO/IEC 42001, OECD AI Principles, EU AI Act, McKinsey Trust Model.</li>
              <li className="rounded-xl border border-[#ffd9e2] bg-[#fff8fb] p-3">Bölüm bazlı skor, güçlü/dikkat alanları ve 30-90 gün + 0-6 ay yol haritası.</li>
              <li className="rounded-xl border border-[#ffd9e2] bg-[#fff8fb] p-3">PDF/DOCX çıktı: aynı rapor standardı; bir sunumda direkt kullanılabilir.</li>
            </ul>

            <p className="rounded-xl border border-[#ffd4df] bg-[#fff0f5] p-3 text-xs text-[#5a5a5a]">
              Not: Bu sürümde metrikler, kullanım anındaki cevaplara dayanır. Kurumsal kararlar için atıf olarak bir uyum danışmanı ile birlikte
              çerçeve skorlarını tamamlamanızı öneririz.
            </p>
          </section>
        </section>
      </main>
    </div>
  );
}
