"use client";

export type RadarEkseni = {
  etiket: string;
  deger: number;
  karsilastirma?: number;
};

const BOYUT = 320;
const MERKEZ = BOYUT / 2;
const YARICAP = 108;
const HALKALAR = [25, 50, 75, 100];

function nokta(indeks: number, toplam: number, deger: number) {
  const aci = (Math.PI * 2 * indeks) / toplam - Math.PI / 2;
  const uzaklik = (Math.max(0, Math.min(100, deger)) / 100) * YARICAP;
  return {
    x: MERKEZ + Math.cos(aci) * uzaklik,
    y: MERKEZ + Math.sin(aci) * uzaklik,
  };
}

function poligon(eksenler: RadarEkseni[], secici: (e: RadarEkseni) => number) {
  return eksenler
    .map((eksen, i) => {
      const p = nokta(i, eksenler.length, secici(eksen));
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");
}

export function RadarGrafik({
  eksenler,
  karsilastirmaEtiketi,
}: {
  eksenler: RadarEkseni[];
  karsilastirmaEtiketi?: string;
}) {
  if (eksenler.length < 3) return null;

  const karsilastirmaVar = eksenler.some((e) => typeof e.karsilastirma === "number");
  const ozet = eksenler.map((e) => `${e.etiket}: yüzde ${Math.round(e.deger)}`).join(", ");

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${BOYUT} ${BOYUT}`}
        className="mx-auto h-auto w-full max-w-[360px]"
        role="img"
        aria-label={`Boyut radarı. ${ozet}`}
      >
        {HALKALAR.map((halka) => (
          <polygon
            key={halka}
            points={poligon(eksenler, () => halka)}
            fill="none"
            stroke="var(--line-1)"
            strokeWidth="1"
          />
        ))}

        {eksenler.map((eksen, i) => {
          const uc = nokta(i, eksenler.length, 100);
          return (
            <line
              key={eksen.etiket}
              x1={MERKEZ}
              y1={MERKEZ}
              x2={uc.x}
              y2={uc.y}
              stroke="var(--line-1)"
              strokeWidth="1"
            />
          );
        })}

        {karsilastirmaVar && (
          <polygon
            points={poligon(eksenler, (e) => e.karsilastirma ?? 0)}
            fill="var(--info)"
            fillOpacity="0.1"
            stroke="var(--info)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        )}

        <polygon
          points={poligon(eksenler, (e) => e.deger)}
          fill="var(--accent)"
          fillOpacity="0.18"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {eksenler.map((eksen, i) => {
          const p = nokta(i, eksenler.length, eksen.deger);
          return (
            <circle
              key={`n-${eksen.etiket}`}
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="var(--accent)"
              stroke="var(--surface-0)"
              strokeWidth="1.5"
            />
          );
        })}

        {eksenler.map((eksen, i) => {
          const p = nokta(i, eksenler.length, 128);
          const ortala =
            Math.abs(p.x - MERKEZ) < 12 ? "middle" : p.x > MERKEZ ? "start" : "end";
          return (
            <text
              key={`e-${eksen.etiket}`}
              x={p.x}
              y={p.y}
              textAnchor={ortala}
              dominantBaseline="middle"
              className="fill-[var(--ink-3)] text-[10px] font-medium"
            >
              {eksen.etiket.length > 16 ? `${eksen.etiket.slice(0, 15)}…` : eksen.etiket}
            </text>
          );
        })}
      </svg>

      {karsilastirmaVar && karsilastirmaEtiketi && (
        <figcaption className="mt-2 flex items-center justify-center gap-4 text-xs text-[var(--ink-3)]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-[var(--accent)]" aria-hidden="true" />
            Senin skorun
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-0.5 w-4 border-t border-dashed border-[var(--info)]"
              aria-hidden="true"
            />
            {karsilastirmaEtiketi}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
