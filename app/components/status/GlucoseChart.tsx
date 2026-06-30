import type { GlucoseEntry } from "@/app/lib/types";

interface GlucoseChartProps {
  data: GlucoseEntry[];
}

export default function GlucoseChart({ data }: GlucoseChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted text-sm">
        Nenhuma medição registrada hoje. Use o chat para registrar.
      </div>
    );
  }

  const svgWidth = 320;
  const svgHeight = 160;
  const padding = { top: 20, right: 16, bottom: 30, left: 36 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  const minVal = 60;
  const maxVal = 200;

  const points = data.map((d, i) => ({
    x: padding.left + (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW),
    y: padding.top + chartH - ((d.valor - minVal) / (maxVal - minVal)) * chartH,
    valor: d.valor,
    hora: d.hora,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  const zoneTop = padding.top + chartH - ((140 - minVal) / (maxVal - minVal)) * chartH;
  const zoneBottom = padding.top + chartH - ((70 - minVal) / (maxVal - minVal)) * chartH;

  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={padding.left} y={zoneTop} width={chartW} height={zoneBottom - zoneTop} fill="var(--accent)" opacity="0.06" rx="4" />
      <text x={padding.left + 4} y={zoneTop + 12} fill="var(--muted)" fontSize="8" opacity="0.6">Meta</text>
      {[80, 100, 120, 140, 160, 180].map((v) => {
        const y = padding.top + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;
        return (
          <g key={v}>
            <line x1={padding.left} y1={y} x2={padding.left + chartW} y2={y} className="chart-grid-line" />
            <text x={padding.left - 4} y={y + 3} textAnchor="end" fill="var(--muted)" fontSize="9">{v}</text>
          </g>
        );
      })}
      {points.map((p, i) => (
        <text key={i} x={p.x} y={svgHeight - 6} textAnchor="middle" fill="var(--muted)" fontSize="9">
          {data[i].hora}
        </text>
      ))}
      <path d={areaPath} className="chart-area" />
      <path d={linePath} className="chart-line" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" className="chart-dot" />
          <text x={p.x} y={p.y - 10} textAnchor="middle" fill="var(--accent-light)" fontSize="9" fontWeight="600">
            {p.valor}
          </text>
        </g>
      ))}
    </svg>
  );
}
