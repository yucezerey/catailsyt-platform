"use client";

import { MARKA } from "@/lib/marka";

export function CatAIlystBrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <CatAIlystOlcumIcon />
      <span className="text-lg font-semibold tracking-tight text-[var(--ink-1)]">
        {MARKA.ad}
      </span>
    </span>
  );
}

export function CatAIlystOlcumIcon() {
  return (
    <span
      className="relative flex size-10 shrink-0 items-center justify-center rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
      style={{ background: MARKA.ustMarka.renk }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5 fill-none stroke-white"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 14.5a7 7 0 0 1 14 0" />
        <path d="M7.25 14.5h9.5" />
        <path d="M12 14.5l3.4-5.15" />
        <path d="M8.1 8.35l1.05 1.05" opacity="0.78" />
        <path d="M15.9 8.35l-1.05 1.05" opacity="0.78" />
        <path d="M9 18.5h6" />
      </svg>
    </span>
  );
}

export function SpeakerAgencyLogo({ className = "" }: { className?: string }) {
  return (
    <img
      src={MARKA.ustMarka.logo}
      alt="Speaker Agency"
      className={`${className || "h-10"} w-auto object-contain`}
      loading="lazy"
    />
  );
}
