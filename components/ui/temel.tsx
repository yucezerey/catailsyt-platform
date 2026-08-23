import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButonVaryant = "birincil" | "ikincil" | "sessiz" | "koyu";
type ButonBoyut = "sm" | "md" | "lg";

const VARYANT: Record<ButonVaryant, string> = {
  birincil:
    "bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)] disabled:bg-[var(--line-2)] disabled:text-[var(--ink-3)]",
  ikincil:
    "border border-[var(--line-2)] bg-[var(--surface-0)] text-[var(--ink-1)] hover:border-[var(--accent-line)] hover:bg-[var(--accent-soft)]",
  sessiz: "text-[var(--ink-2)] hover:bg-[var(--surface-2)]",
  koyu: "bg-[var(--surface-inverse)] text-[var(--ink-inverse)] hover:opacity-90",
};

const BOYUT: Record<ButonBoyut, string> = {
  sm: "min-h-9 px-3.5 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
};

export function Buton({
  varyant = "birincil",
  boyut = "md",
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  varyant?: ButonVaryant;
  boyut?: ButonBoyut;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-[var(--motion-fast)] disabled:cursor-not-allowed disabled:opacity-60 ${VARYANT[varyant]} ${BOYUT[boyut]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Kart({
  children,
  className = "",
  yumusak = false,
}: {
  children: ReactNode;
  className?: string;
  yumusak?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-[var(--line-1)] ${
        yumusak ? "bg-[var(--surface-1)]" : "bg-[var(--surface-0)]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Etiket({
  children,
  ton = "notr",
}: {
  children: ReactNode;
  ton?: "notr" | "vurgu" | "uyari" | "kritik" | "basari";
}) {
  const tonlar = {
    notr: "bg-[var(--surface-2)] text-[var(--ink-2)]",
    vurgu: "bg-[var(--accent-soft)] text-[var(--accent-ink)]",
    uyari: "bg-[var(--warning-soft)] text-[var(--warning)]",
    kritik: "bg-[var(--critical-soft)] text-[var(--critical)]",
    basari: "bg-[var(--success-soft)] text-[var(--success)]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tonlar[ton]}`}
    >
      {children}
    </span>
  );
}

export function OlcuCubugu({
  yuzde,
  etiket,
  ince = false,
}: {
  yuzde: number;
  etiket?: string;
  ince?: boolean;
}) {
  const guvenli = Math.max(0, Math.min(100, yuzde));
  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-[var(--surface-2)] ${ince ? "h-1.5" : "h-2.5"}`}
      role="img"
      aria-label={etiket ?? `Yüzde ${Math.round(guvenli)}`}
    >
      <div
        className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-[var(--motion-slow)] ease-[var(--ease-out)]"
        style={{ width: `${guvenli}%` }}
      />
    </div>
  );
}
