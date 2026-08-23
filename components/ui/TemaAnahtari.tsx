"use client";

import { useEffect, useState } from "react";

type Tema = "sistem" | "light" | "dark";

const SIRA: Tema[] = ["sistem", "light", "dark"];
const ETIKET: Record<Tema, string> = {
  sistem: "Sistem teması",
  light: "Açık tema",
  dark: "Koyu tema",
};

export function TemaAnahtari() {
  const [tema, setTema] = useState<Tema>("sistem");
  const [hazir, setHazir] = useState(false);

  useEffect(() => {
    try {
      const kayitli = window.localStorage.getItem("catailyst:tema") as Tema | null;
      // localStorage bir dış sistem; ilk boyamada okunması hidrasyon için zorunlu.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (kayitli && SIRA.includes(kayitli)) setTema(kayitli);
    } catch {
      // yoksay
    }
    setHazir(true);
  }, []);

  useEffect(() => {
    if (!hazir) return;
    const kok = document.documentElement;
    if (tema === "sistem") kok.removeAttribute("data-theme");
    else kok.setAttribute("data-theme", tema);
    try {
      window.localStorage.setItem("catailyst:tema", tema);
    } catch {
      // yoksay
    }
  }, [tema, hazir]);

  const sonraki = SIRA[(SIRA.indexOf(tema) + 1) % SIRA.length];

  return (
    <button
      onClick={() => setTema(sonraki)}
      className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--line-1)] px-3 text-xs font-medium text-[var(--ink-2)] transition-colors hover:bg-[var(--surface-2)]"
      aria-label={`Tema: ${ETIKET[tema]}. Değiştirmek için tıkla, sonraki: ${ETIKET[sonraki]}`}
      title={ETIKET[tema]}
      type="button"
    >
      <span aria-hidden="true">
        {tema === "dark" ? "◐" : tema === "light" ? "○" : "◑"}
      </span>
      <span className="hidden sm:inline">{ETIKET[tema]}</span>
    </button>
  );
}
