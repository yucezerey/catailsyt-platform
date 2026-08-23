"use client";

import { useMemo, useState } from "react";

type Option = {
  text: string;
  score: number;
};

type Question = {
  id: string;
  mode: "individual" | "corporate";
  area: string;
  title: string;
  prompt: string;
  options: Option[];
};

type Mode = "individual" | "corporate";

type AnswerMap = Record<string, number>;

type ScoreBucket = {
  area: string;
  points: number;
  max: number;
  percentage: number;
};

const QUESTIONS: Question[] = [
  {
    id: "i01",
    mode: "individual",
    area: "B1 Kavrayış",
    title: "Yapay zeka çıktısında güven",
    prompt: "Bir metin AI tarafından üretildiğinde en doğru başlangıç adımı hangisidir?",
    options: [
      { text: "Anlamına bakmadan paylaşırım.", score: 0 },
      { text: "Görsel olarak iyi görünüyorsa kabul ederim.", score: 1 },
      { text: "Önce kaynağı ve sayısal tutarlılığı doğrularım.", score: 3 },
      {
        text: "Çelişki varsa insan kararına göre tekrar test eder, gerekirse kaynak alıntıları ile kapatırım.",
        score: 4,
      },
    ],
  },
  {
    id: "i02",
    mode: "individual",
    area: "B1 Kavrayış",
    title: "Temel kavram",
    prompt: '"Hallüsinasyon" terimi neyi anlatır?',
    options: [
      { text: "Modelin hızlı çalışmasını.", score: 0 },
      { text: "Veri kaybını.", score: 1 },
      { text: "Doğrulama olmadan ikna edici yanlış içerik üretimini.", score: 4 },
      { text: "Arayüz hatasını.", score: 0 },
    ],
  },
  {
    id: "i03",
    mode: "individual",
    area: "B2 Uygulama",
    title: "Prompt düzeni",
    prompt: "Tek seferde karmaşık istek yerine parçalara ayırmanın avantajı nedir?",
    options: [
      {
        text: "Aynı işi daha yavaş yapar ama kalite garantisi azalır.",
        score: 0,
      },
      {
        text: "Çıkarttığı kontrol değiştirilemez.",
        score: 1,
      },
      {
        text: "Tekrarlanabilir bir süreç yerine geçer ve çıktıyı yönetilebilir kılar.",
        score: 4,
      },
      {
        text: "Sadece token maliyetini arttırır, kalite artmaz.",
        score: 2,
      },
    ],
  },
  {
    id: "i04",
    mode: "individual",
    area: "B3 Eleştiri",
    title: "Doğrulama",
    prompt: "Rapor için AI yanıtı aldığınızda hangi davranış doğrudur?",
    options: [
      { text: "Kaynaksız veriyi doğrudan birime yüklerim.", score: 0 },
      { text: "Sadece önemli kısımları hızlıca kontrol ederim.", score: 2 },
      { text: "Çapraz kontrol olmadan rapora eklerim.", score: 0 },
      {
        text: "Kritik ifadeler için en az iki farklı kanıtla doğrularım.",
        score: 4,
      },
    ],
  },
  {
    id: "i05",
    mode: "individual",
    area: "B3 Eleştiri",
    title: "Yanıltıcı güven",
    prompt: "Aşağıdakilerden hangisi en riskli varsayımdır?",
    options: [
      { text: "Akıcı metin kalite güvencedir.", score: 0 },
      { text: "AI çıktısını insan denetimi olmadan kararlılık sağlar.", score: 0 },
      {
        text: "Tüm sonuçların iş hedefiyle eşleştirilmesi gerekir.",
        score: 3,
      },
      {
        text: "Rutin olarak format ve dil doğrulaması yapmak zaman kazandırır.",
        score: 2,
      },
    ],
  },
  {
    id: "i06",
    mode: "individual",
    area: "B4 Risk",
    title: "Gizlilik",
    prompt: "Kurumsal bir dosyayı AI aracıyla paylaşmadan önce hangi kural önceliklidir?",
    options: [
      { text: "İşe yaramazsa atlarız.", score: 0 },
      { text: "İlgili ekibin onayı ve saklama politikasını kontrol ederim.", score: 3 },
      { text: "Özetlenmesi riskini azaltır, paylaşım sorun olmaz.", score: 1 },
      {
        text: "Mümkünse anonimleştirme ve erişim sınırlarıyla işlem yaparım.",
        score: 4,
      },
    ],
  },
  {
    id: "i07",
    mode: "individual",
    area: "B4 Risk",
    title: "KVKK uygulaması",
    prompt: "Katılımcının ne için ne kadar veri verdiği net değilse ilk adımınız ne olur?",
    options: [
      { text: "Hiçbir işlem yapmadan toplayıp analiz ederim.", score: 0 },
      { text: "Reddetmek yerine anonimleştiririm, sorun kalmaz.", score: 1 },
      {
        text: "Amaç, saklama ve silme kriterleri belirgin olmayınca ölçümü durdururum.",
        score: 4,
      },
      { text: "Sadece şirket verisini toplarım; kişi verisi ayırmaya gerek yoktur.", score: 0 },
    ],
  },
  {
    id: "i08",
    mode: "corporate",
    area: "K1 Strateji",
    title: "Kurumsal hedef",
    prompt: "Yapay zeka kullanımının iş hedefiyle ilişkisi konusunda durum nedir?",
    options: [
      { text: "Hiç ilişki kurulmamış.", score: 0 },
      { text: "Planlı ama ölçüm eksik.", score: 2 },
      { text: "Birim bazında hedefler var, ölçüt farklı.", score: 3 },
      { text: "Strateji, KPI ve bütçe bağlamında netleşmiş.", score: 4 },
    ],
  },
  {
    id: "i09",
    mode: "corporate",
    area: "K2 Yönetim",
    title: "Sahiplenme",
    prompt: "Üst yönetim, güvenli kullanım ve sorumluluk açısından ne kadar net?",
    options: [
      { text: "Hiçbir çerçeve yok.", score: 0 },
      { text: "Sözlü bir anlayış var.", score: 1 },
      { text: "Sahip rol ve karar kriterleri tanımlı.", score: 3 },
      {
        text: "KPI, sorumluluk zinciri ve revizyon mekanizması kurulmuş.",
        score: 4,
      },
    ],
  },
  {
    id: "i10",
    mode: "corporate",
    area: "K3 Veri",
    title: "Veri yönetişimi",
    prompt: "Kurumdaki kritik veri sahipliği nasıl olmalıdır?",
    options: [
      { text: "Belirsiz; birikim olarak kalır.", score: 0 },
      {
        text: "Veri sadece teknoloji ekibinin işidir.",
        score: 1,
      },
      {
        text: "Sahiplik, erişim ve kalite metrikleriyle birlikte tanımlanmalıdır.",
        score: 4,
      },
      { text: "Mümkün olduğunca kapalı tutulursa yeterlidir.", score: 0 },
    ],
  },
  {
    id: "i11",
    mode: "corporate",
    area: "K5 Etki",
    title: "Pilot başarı",
    prompt: "Pilotun başarı göstergesi için en doğru yaklaşım hangisi?",
    options: [
      { text: "Bitişte genel bir izlenim ile yetinmek.", score: 0 },
      { text: "Sadece kullanıcı memnuniyetine bakmak.", score: 1 },
      {
        text: "Önceki ölçüm ile sonrası karşılaştırıp zaman ve kalite kazanımı izlemek.",
        score: 4,
      },
      { text: "Yöneticinin sevdiklerine göre karar vermek.", score: 0 },
    ],
  },
];

const TITLE_BY_AREA: Record<string, string> = {
  "B1 Kavrayış": "Kavramsal hazırbulma",
  "B2 Uygulama": "Pratik uygulama",
  "B3 Eleştiri": "Eleştirel düşünme",
  "B4 Risk": "Risk kontrolü",
  "K1 Strateji": "Stratejik sahiplenme",
  "K2 Yönetim": "Yönetim çerçevesi",
  "K3 Veri": "Veri yönetişimi",
  "K5 Etki": "Kazanım takibi",
};

const NOTE_BY_MILESTONE: Record<number, string> = {
  0: "Temel eğitim başlangıcı. Kuruma özel bir 2 saatlik yönlendirme önerilir.",
  20: "Başlangıç seviyesindesiniz. Ölçüm ve doğrulama eksik.",
  40: "Orta seviyedesiniz. Kurum çerçevesi ile birlikte hızlanır.",
  60: "İyi düzeyde bir temel var. Kurumsal entegrasyon ile hızlanır.",
  80: "Olgunluk yüksek. Toplu ölçüm ve raporlaşma ile ölçeklenebilirlik artar.",
  100: "İleri seviye. Referans vaka üretimi için hazır durumda görünüyorsunuz.",
};

function scoreBuckets(questions: Question[], answers: AnswerMap): ScoreBucket[] {
  const totals: Record<string, ScoreBucket> = {};

  for (const q of questions) {
    if (!totals[q.area]) {
      totals[q.area] = { area: q.area, points: 0, max: 0, percentage: 0 };
    }

    totals[q.area].max += 4;
    const ans = answers[q.id];
    if (ans === undefined) continue;
    totals[q.area].points += q.options[ans]?.score ?? 0;
  }

  return Object.values(totals)
    .map((item) => ({
      ...item,
      percentage: item.max ? (item.points / item.max) * 100 : 0,
    }))
    .sort((a, b) => a.area.localeCompare(b.area));
}

function nearestMilestone(score: number) {
  if (score >= 90) return 100;
  if (score >= 75) return 80;
  if (score >= 55) return 60;
  if (score >= 35) return 40;
  if (score >= 15) return 20;
  return 0;
}

function levelFrom(score: number) {
  if (score >= 85) return "İleri";
  if (score >= 70) return "İlerleme";
  if (score >= 50) return "Orta";
  if (score >= 30) return "Başlangıç";
  return "Çok Başlangıç";
}

function formatPercent(value: number) {
  return `${Math.round(Math.max(0, Math.min(100, value)))}%`;
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("individual");
  const [started, setStarted] = useState(false);
  const [position, setPosition] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [done, setDone] = useState(false);
  const [company, setCompany] = useState("");

  const questions = useMemo(() => QUESTIONS.filter((q) => q.mode === mode), [mode]);
  const current = questions[position];

  const currentAnswer = useMemo(() => {
    if (!current) return undefined;
    return answers[current.id];
  }, [answers, current]);

  const answeredCount = useMemo(
    () => questions.filter((q) => answers[q.id] !== undefined).length,
    [answers, questions],
  );

  const buckets = useMemo(() => scoreBuckets(questions, answers), [questions, answers]);

  const overall = useMemo(() => {
    const total = buckets.reduce((acc, item) => acc + item.percentage, 0);
    const avg = buckets.length ? total / buckets.length : 0;
    const rounded = Math.round(avg);
    return {
      score: rounded,
      level: levelFrom(rounded),
      note: NOTE_BY_MILESTONE[nearestMilestone(rounded)],
    };
  }, [buckets]);

  const progress = questions.length ? (answeredCount / questions.length) * 100 : 0;

  const goMode = (nextMode: Mode) => {
    setMode(nextMode);
    setStarted(false);
    setDone(false);
    setPosition(0);
    setAnswers({});
  };

  const start = () => {
    setStarted(true);
    setDone(false);
    setAnswers({});
    setPosition(0);
  };

  const selectAnswer = (id: string, index: number) => {
    setAnswers((prev) => ({ ...prev, [id]: index }));
  };

  const next = () => {
    if (!current) return;
    if (position < questions.length - 1) {
      setPosition((p) => p + 1);
    } else {
      setDone(true);
    }
  };

  const prev = () => {
    if (position > 0) setPosition((p) => p - 1);
  };

  const reset = () => {
    setAnswers({});
    setDone(false);
    setStarted(false);
    setPosition(0);
  };

  return (
    <div className="min-h-screen bg-white text-[#111]">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 lg:px-8">
        <header className="rounded-[28px] border border-[#ffe0e8] bg-white p-8 shadow-sm">
          <p className="inline-flex rounded-full bg-[#fff0f3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#9c1938]">
            CatAIlsyt | AI Readiness Platform
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-[#111] md:text-5xl">
            Apple estetiğinde, beyaz fonda, sade ve ölçülebilir bir değerlendirme deneyimi
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#4c4c4c] md:text-lg">
            Bireysel ya da kurumsal modda hemen test açın. Sonuçlar hızlı puan ve katman analizine döner.
            Tasarımda kırmızı vurgu rengi: #B91737.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                start();
                document.getElementById("assessment")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full bg-[#b91737] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a00f31]"
            >
              Hemen Başla
            </button>
            <a
              className="rounded-full border border-[#ffc3d1] px-5 py-3 text-sm font-semibold text-[#7c1d34] transition hover:bg-[#fff0f3]"
              href="#features"
            >
              Özellikleri gör
            </a>
          </div>
        </header>

        <section id="assessment" className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[28px] border border-[#fde4ea] bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">CatAIlsyt Testi</h2>
              <div className="text-xs text-[#5f5f5f]">{mode === "individual" ? "Bireysel" : "Kurumsal"} mod</div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => goMode("individual")}
                className={`rounded-full border px-4 py-2 text-sm ${
                  mode === "individual"
                    ? "border-[#b91737] bg-[#fff0f3] text-[#8c1734]"
                    : "border-[#f0cad6] text-[#7c1d34]"
                }`}
              >
                Bireysel Katılımcı
              </button>
              <button
                onClick={() => goMode("corporate")}
                className={`rounded-full border px-4 py-2 text-sm ${
                  mode === "corporate"
                    ? "border-[#b91737] bg-[#fff0f3] text-[#8c1734]"
                    : "border-[#f0cad6] text-[#7c1d34]"
                }`}
              >
                Kurum / Eğitim
              </button>
            </div>

            {mode === "corporate" && (
              <label className="mt-4 block text-sm">
                <span className="mb-1 block text-[#5a5a5a]">Kurum adı</span>
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="Örn: Örnek Teknoloji"
                  className="w-full rounded-xl border border-[#ffcedb] px-4 py-2 outline-none ring-[#b91737]/30 focus:ring-2"
                />
              </label>
            )}

            <div className="mt-6 h-2 rounded-full bg-[#ffe4eb]">
              <div className="h-2 rounded-full bg-[#b91737]" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-[#666]">İlerleme: {Math.round(progress)}%</p>

            {!started && !done && (
              <button
                onClick={start}
                className="mt-5 rounded-full bg-[#111] px-5 py-3 text-sm font-semibold text-white"
              >
                Teste Başla
              </button>
            )}

            {started && current && !done && (
              <>
                <p className="mt-5 text-sm uppercase tracking-[0.14em] text-[#a13f53]">{current.area}</p>
                <h3 className="mt-1 text-xl font-semibold text-[#141414]">{current.title}</h3>
                <p className="mt-2 text-sm text-[#4b4b4b]">{current.prompt}</p>

                <div className="mt-4 space-y-2">
                  {current.options.map((option, idx) => {
                    const active = answers[current.id] === idx;
                    return (
                      <button
                        key={current.id + idx}
                        onClick={() => selectAnswer(current.id, idx)}
                        className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                          active
                            ? "border-[#b91737] bg-[#fff0f3] text-[#6f1128]"
                            : "border-[#f4c8d5] text-[#555] hover:bg-[#fff6f8]"
                        }`}
                      >
                        {option.text}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <button
                    onClick={prev}
                    disabled={position === 0}
                    className="rounded-full border border-[#f3b7ca] px-5 py-2 text-sm disabled:opacity-40"
                  >
                    Geri
                  </button>
                  <button
                    onClick={next}
                    disabled={currentAnswer === undefined}
                    className="rounded-full bg-[#b91737] px-5 py-2 text-sm font-semibold text-white disabled:bg-[#d9a0b2]"
                  >
                    {position === questions.length - 1 ? "Sonuçları Gör" : "Devam Et"}
                  </button>
                </div>
              </>
            )}

            {done && (
              <div className="mt-6 space-y-4">
                <h3 className="text-2xl font-semibold">
                  {mode === "corporate" ? company || "Kurumsal" : "Bireysel"} hazırbulma sonucu
                </h3>

                <div className="rounded-2xl border border-[#f4ccdc] bg-[#fff8fb] p-4">
                  <p className="text-sm text-[#7a1b34]">Genel skor</p>
                  <p className="mt-1 text-4xl font-bold text-[#b91737]">{formatPercent(overall.score)}</p>
                  <p className="mt-1 text-sm text-[#555]">Seviye: {overall.level}</p>
                  <p className="mt-2 text-sm text-[#444]">{overall.note}</p>
                </div>

                <div className="space-y-2">
                  {buckets.map((bucket) => (
                    <div key={bucket.area} className="rounded-xl border border-[#f7d3de] p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>{TITLE_BY_AREA[bucket.area] ?? bucket.area}</span>
                        <strong className="text-[#b91737]">{formatPercent(bucket.percentage)}</strong>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-[#ffe4ec]">
                        <div
                          className="h-2 rounded-full bg-[#b91737]"
                          style={{ width: `${bucket.percentage}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-[#666]">
                        Ham puan: {bucket.points}/{bucket.max}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={reset}
                  className="rounded-full bg-[#111] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Tekrar Başlat
                </button>
              </div>
            )}
          </article>

          <section id="features" className="rounded-[28px] border border-[#fde5ee] bg-white p-6">
            <h2 className="text-lg font-semibold">Çıktı hedefi</h2>
            <p className="mt-2 text-sm text-[#555]">
              Bu sürüm, beyaz-temelli Apple UX/UI dili için prototiptir: geniş boşluk, az gölge, kırmızı odak ve
              okunur kontrast.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-[#555]">
              <li className="rounded-xl border border-[#ffd9e2] bg-[#fff8fb] p-3">
                Bireysel katılımcı sonuçları (anlık puan + seviye)
              </li>
              <li className="rounded-xl border border-[#ffd9e2] bg-[#fff8fb] p-3">
                Kurumsal modda kurum başlığı ve hedef odaklı sonuç kartı
              </li>
              <li className="rounded-xl border border-[#ffd9e2] bg-[#fff8fb] p-3">
                Geliştirmeye hazır sade API-ready frontend yapısı
              </li>
              <li className="rounded-xl border border-[#ffd9e2] bg-[#fff8fb] p-3">
                Sonuçlarda kırmızı vurgu ile hızlı okunur metrik akışı
              </li>
            </ul>
          </section>
        </section>
      </main>
    </div>
  );
}
