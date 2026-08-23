import type { Oturum } from "./oturum";

const ANAHTAR = "catailyst:oturum:v2";
const RAPOR_ANAHTARI = "catailyst:rapor:v2";

function guvenliYaz(anahtar: string, deger: unknown) {
  try {
    window.localStorage.setItem(anahtar, JSON.stringify(deger));
  } catch {
    // Gizli sekme veya dolu depolama — sessizce geç, akış bozulmasın
  }
}

function guvenliOku<T>(anahtar: string): T | null {
  try {
    const ham = window.localStorage.getItem(anahtar);
    return ham ? (JSON.parse(ham) as T) : null;
  } catch {
    return null;
  }
}

export function oturumKaydet(oturum: Oturum) {
  guvenliYaz(ANAHTAR, oturum);
}

export function oturumOku(): Oturum | null {
  const oturum = guvenliOku<Oturum>(ANAHTAR);
  if (!oturum || oturum.surum !== 2) return null;
  // 7 günden eski yarım oturumu geri yükleme
  if (Date.now() - oturum.baslangic > 7 * 24 * 60 * 60 * 1000) return null;
  return oturum;
}

export function oturumSil() {
  try {
    window.localStorage.removeItem(ANAHTAR);
  } catch {
    // yoksay
  }
}

export function raporKaydet(oturum: Oturum) {
  guvenliYaz(RAPOR_ANAHTARI, oturum);
}

export function raporOku(): Oturum | null {
  const oturum = guvenliOku<Oturum>(RAPOR_ANAHTARI);
  return oturum && oturum.surum === 2 ? oturum : null;
}

/** Geçmiş ölçümler — T0/T1 karşılaştırması için */
const GECMIS_ANAHTARI = "catailyst:gecmis:v2";

export type GecmisKayit = {
  id: string;
  tarih: number;
  mod: string;
  skor: number;
  seviye: string;
};

export function gecmiseEkle(kayit: GecmisKayit) {
  const mevcut = guvenliOku<GecmisKayit[]>(GECMIS_ANAHTARI) ?? [];
  const guncel = [...mevcut.filter((k) => k.id !== kayit.id), kayit].slice(-10);
  guvenliYaz(GECMIS_ANAHTARI, guncel);
}

export function gecmisOku(): GecmisKayit[] {
  return guvenliOku<GecmisKayit[]>(GECMIS_ANAHTARI) ?? [];
}
