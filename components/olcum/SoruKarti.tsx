"use client";

import { useEffect, useRef } from "react";
import type { QuestionItem } from "@/lib/sorular";
import { BOLUM_META } from "@/lib/skorlama";

const HARFLER = ["A", "B", "C", "D", "E", "F"];

export function SoruKarti({
  soru,
  secili,
  onSec,
  sira,
  toplam,
}: {
  soru: QuestionItem;
  secili: number | undefined;
  onSec: (indeks: number) => void;
  sira: number;
  toplam: number;
}) {
  const ilkRef = useRef<HTMLInputElement>(null);

  // Yeni soruya geçince odağı ilk seçeneğe taşı — klavye akışı kopmasın
  useEffect(() => {
    const zamanlayici = window.setTimeout(() => {
      if (secili === undefined) ilkRef.current?.focus({ preventScroll: true });
    }, 60);
    return () => window.clearTimeout(zamanlayici);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soru.id]);

  const bolum = BOLUM_META[soru.section];

  return (
    <div key={soru.id} className="cat-enter">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-3)]">
        {bolum ? bolum.kisa : soru.section}
      </p>

      <fieldset className="mt-3 border-0 p-0">
        <legend className="text-balance text-xl font-semibold leading-snug text-[var(--ink-1)] md:text-2xl">
          <span className="sr-only">
            Soru {sira} / {toplam}:{" "}
          </span>
          {soru.prompt}
        </legend>

        <div className="mt-5 space-y-2.5">
          {soru.options.map((secenek, indeks) => {
            const aktif = secili === indeks;
            return (
              <label
                key={`${soru.id}-${indeks}`}
                className="group block cursor-pointer"
              >
                <input
                  ref={indeks === 0 ? ilkRef : undefined}
                  type="radio"
                  name={soru.id}
                  value={indeks}
                  checked={aktif}
                  onChange={() => onSec(indeks)}
                  className="peer sr-only"
                />
                <span
                  className={`flex min-h-14 items-center gap-3 rounded-[var(--radius-field)] border px-4 py-3 text-left text-[15px] leading-snug transition-colors duration-[var(--motion-fast)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)] ${
                    aktif
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-ink)]"
                      : "border-[var(--line-1)] bg-[var(--surface-0)] text-[var(--ink-2)] group-hover:border-[var(--line-2)] group-hover:bg-[var(--surface-1)]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-7 shrink-0 items-center justify-center rounded-md border text-xs font-bold transition-colors ${
                      aktif
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-contrast)]"
                        : "border-[var(--line-2)] text-[var(--ink-3)]"
                    }`}
                  >
                    {HARFLER[indeks]}
                  </span>
                  <span>{secenek}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
