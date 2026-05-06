import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart3, Activity } from "lucide-react";

const stats = [
  { label: "AI Sector", icon: Activity, key: "sector_change" },
  { label: "Top Gainer", icon: TrendingUp, key: "top_gainer" },
  { label: "Top Loser", icon: TrendingDown, key: "top_loser" },
  { label: "Avg Volume", icon: BarChart3, key: "avg_volume" },
];

export default function MarketSummary({ stocks }) {
  if (!stocks?.length) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="bg-card border-border p-4 animate-pulse">
            <div className="h-3 w-16 bg-muted rounded mb-2" />
            <div className="h-5 w-20 bg-muted rounded" />
          </Card>
        ))}
      </div>
    );
  }

  const avgChange = stocks.reduce((a, s) => a + (s.change_percent || 0), 0) / stocks.length;
  const sorted = [...stocks].sort((a, b) => (b.change_percent || 0) - (a.change_percent || 0));
  const topGainer = sorted[0];
  const topLoser = sorted[sorted.length - 1];

  const data = [
    {
      label: "AI Sector",
      value: `${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`,
      positive: avgChange >= 0,
      icon: Activity,
      sub: "Avg. Performance"
    },
    {
      label: "Top Gainer",
      value: topGainer?.symbol,
      positive: true,
      icon: TrendingUp,
      sub: `+${topGainer?.change_percent?.toFixed(2)}%`
    },
    {
      label: "Top Loser",
      value: topLoser?.symbol,
      positive: false,
      icon: TrendingDown,
      sub: `${topLoser?.change_percent?.toFixed(2)}%`
    },
    {
      label: "Tracked",
      value: `${stocks.length} stocks`,
      positive: true,
      icon: BarChart3,
      sub: "AI Companies"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {data.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="bg-card border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">{item.label}</span>
              <Icon className={`w-3.5 h-3.5 ${item.positive ? "text-accent" : "text-destructive"}`} />
            </div>
            <p className={`font-mono text-lg font-bold ${item.positive ? "text-accent" : "text-destructive"}`}>
              {item.value}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</p>
          </Card>
        );
      })}
    </div>
  );
}