import React, { useId, useMemo, useState } from "react";

// Lightweight, dependency-free sparkline.
// Replaces the previous recharts implementation, which pulled the entire
// recharts + d3 bundle into the app just to draw a 36px line.
const VIEW_W = 100;
const VIEW_H = 36;
const PAD_Y = 4;

function SparklineChart({ data, isPositive }) {
  const gradientId = useId();
  const [hover, setHover] = useState(null);

  const geometry = useMemo(() => {
    if (!data || data.length === 0) return null;

    const prices = data.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const stepX = data.length > 1 ? VIEW_W / (data.length - 1) : 0;

    const points = data.map((d, i) => {
      const x = i * stepX;
      const y = PAD_Y + (1 - (d.price - min) / range) * (VIEW_H - PAD_Y * 2);
      return { x, y, price: d.price };
    });

    const line = points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
    const area = `0,${VIEW_H} ${line} ${VIEW_W},${VIEW_H}`;

    return { points, line, area, last: points[points.length - 1] };
  }, [data]);

  if (!geometry) return null;

  const color = isPositive ? "hsl(160, 84%, 39%)" : "hsl(0, 72%, 51%)";
  const active = hover != null ? geometry.points[hover] : null;

  return (
    <div className="relative w-full" style={{ height: VIEW_H }}>
      <svg
        width="100%"
        height={VIEW_H}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="overflow-visible"
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <polygon points={geometry.area} fill={`url(#${gradientId})`} />
        <polyline
          points={geometry.line}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {active && (
          <circle cx={active.x} cy={active.y} r="2.5" fill={color} vectorEffect="non-scaling-stroke" />
        )}

        {/* Transparent hover columns — stretch with the chart so the whole width is interactive */}
        {geometry.points.map((p, i) => (
          <rect
            key={i}
            x={i === 0 ? 0 : p.x - (VIEW_W / (geometry.points.length - 1)) / 2}
            y="0"
            width={VIEW_W / (geometry.points.length - 1)}
            height={VIEW_H}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </svg>

      {active && (
        <div
          className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 -translate-y-full rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono text-foreground shadow-sm"
          style={{ left: `${(hover / (geometry.points.length - 1)) * 100}%` }}
        >
          ${active.price?.toFixed(2)}
        </div>
      )}
    </div>
  );
}

export default React.memo(SparklineChart);
