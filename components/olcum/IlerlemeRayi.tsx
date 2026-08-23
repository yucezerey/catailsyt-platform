"use client";

export type RaySegmenti = {
  bolum: string;
  toplam: number;
  cevaplanan: number;
};

export function IlerlemeRayi({
  segmentler,
  yuzde,
  kalanDakika,
  adimEtiketi,
}: {
  segmentler: RaySegmenti[];
  yuzde: number;
  kalanDakika: number | null;
  adimEtiketi: string;
}) {
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between gap-3 text-xs text-[var(--ink-3)]">
        <span className="font-medium text-[var(--ink-2)]">{adimEtiketi}</span>
        <span aria-live="polite">
          {kalanDakika !== null ? `~${kalanDakika} dk kaldı` : `%${Math.round(yuzde)}`}
        </span>
      </div>

      <div
        className="mt-2 flex gap-1"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(yuzde)}
        aria-label="Değerlendirme ilerlemesi"
      >
        {segmentler.length === 0 ? (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-[var(--motion-base)]"
              style={{ width: `${yuzde}%` }}
            />
          </div>
        ) : (
          segmentler.map((segment) => {
            const dolu = segment.toplam ? (segment.cevaplanan / segment.toplam) * 100 : 0;
            return (
              <div
                key={segment.bolum}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]"
                title={`${segment.bolum}: ${segment.cevaplanan}/${segment.toplam}`}
              >
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-[var(--motion-base)]"
                  style={{ width: `${dolu}%` }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
