export const MARKA = {
  ad: "CatAIlyst",
  tamAd: "CatAIlyst — Yapay Zekâ Hazırlık Platformu",
  aciklama:
    "Yapay zekâ hazırlığını kendini nasıl gördüğüne değil, gerçekte ne bildiğine ve ne yaptığına bakarak ölçen değerlendirme platformu.",
  vaat: "8 dakikada ölç, küresel çerçevelerle karşılaştır, aksiyona dönüşen rapor al.",
  /** Speaker Agency — ana marka */
  ustMarka: {
    ad: "speaker agency",
    slogan: "Future. Made. Today.",
    url: "https://speakeragency.com",
    logo: "/brand/speaker-agency-logo.png",
    renk: "#BF1538",
  },
  /** PDF/DOCX gibi CSS erişimi olmayan çıktılar için sabit palet */
  pdf: {
    accent: [191, 21, 56] as [number, number, number],
    accentHex: "BF1538",
    dark: [17, 17, 17] as [number, number, number],
    gray: [102, 102, 102] as [number, number, number],
    soft: [253, 229, 238] as [number, number, number],
    softHex: "FFF4F7",
  },
} as const;
