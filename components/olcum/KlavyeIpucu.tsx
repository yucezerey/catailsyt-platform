export function KlavyeIpucu({ secenekSayisi }: { secenekSayisi: number }) {
  const tuslar = Array.from({ length: Math.min(secenekSayisi, 6) }, (_, i) => i + 1).join("-");
  return (
    <p className="hidden text-xs text-[var(--ink-3)] sm:block">
      <Tus>{tuslar}</Tus> ile seç · <Tus>Enter</Tus> ileri · <Tus>←</Tus> geri ·{" "}
      <Tus>↑↓</Tus> seçenekler
    </p>
  );
}

function Tus({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-[var(--line-2)] bg-[var(--surface-1)] px-1.5 py-0.5 font-sans text-[11px] font-medium text-[var(--ink-2)]">
      {children}
    </kbd>
  );
}
