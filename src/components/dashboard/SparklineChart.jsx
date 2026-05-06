import React from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

export default function SparklineChart({ data, isPositive }) {
  if (!data || data.length === 0) return null;

  const color = isPositive ? "hsl(160, 84%, 39%)" : "hsl(0, 72%, 51%)";

  return (
    <ResponsiveContainer width="100%" height={36}>
      <LineChart data={data} margin={{ top: 4, right: 0, bottom: 4, left: 0 }}>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload?.length) {
              return (
                <div className="bg-card border border-border rounded px-2 py-1 text-[10px] font-mono text-foreground">
                  ${payload[0].value?.toFixed(2)}
                </div>
              );
            }
            return null;
          }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 2, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}