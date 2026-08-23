import type { QuestionMode, SoruPaketi } from "./sorular";
import type { CevapHaritasi } from "./skorlama";

export type OturumAdimi =
  | "hazirlik"
  | "isindirma"
  | "baglam"
  | "sorular"
  | "oz-degerlendirme"
  | "tamamlandi";

export type Baglam = {
  rol?: string;
  sektor?: string;
  buyukluk?: string;
  kidem?: string;
};

export type Oturum = {
  surum: 2;
  id: string;
  mod: QuestionMode;
  paket: SoruPaketi;
  tur: number;
  kurum: string;
  riza: boolean;
  isindirma?: string;
  baglam: Baglam;
  soruIdleri: string[];
  cevaplar: CevapHaritasi;
  /** Madde başına yanıt süresi — veri kalitesi sinyali (plan §10) */
  sureler: Record<string, number>;
  ozDegerlendirme: CevapHaritasi;
  adim: OturumAdimi;
  konum: number;
  baslangic: number;
  bitis?: number;
};

export function yeniOturumId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}

export function bosOturum(mod: QuestionMode, paket: SoruPaketi, tur: number): Oturum {
  return {
    surum: 2,
    id: yeniOturumId(),
    mod,
    paket,
    tur,
    kurum: "",
    riza: false,
    baglam: {},
    soruIdleri: [],
    cevaplar: {},
    sureler: {},
    ozDegerlendirme: {},
    adim: "hazirlik",
    konum: 0,
    baslangic: Date.now(),
  };
}

/** Düz çizgi çekme sinyali: maddelerin çoğu 2 saniyenin altında yanıtlandıysa */
export function veriKalitesi(oturum: Oturum) {
  const sureler = Object.values(oturum.sureler);
  if (sureler.length < 5) return { guvenilir: true, hizliOran: 0 };
  const hizli = sureler.filter((s) => s < 2000).length;
  const oran = hizli / sureler.length;
  return { guvenilir: oran < 0.4, hizliOran: oran };
}
