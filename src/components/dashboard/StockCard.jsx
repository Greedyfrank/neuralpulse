import React from "react";
import { TrendingUp, TrendingDown, ExternalLink, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SparklineChart from "./SparklineChart";

export default function StockCard({ stock, onSetAlert }) {
  const isPositive = stock.change >= 0;

  return (
    <Card className="bg-card border-border p-4 hover:border-primary/40 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-foreground">{stock.symbol}</span>
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
              isPositive ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"
            }`}>
              {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
              {isPositive ? "+" : ""}{stock.change_percent?.toFixed(2)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-tight max-w-[140px] truncate">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg font-bold text-foreground">${stock.price?.toFixed(2)}</p>
          <p className={`font-mono text-[11px] ${isPositive ? "text-accent" : "text-destructive"}`}>
            {isPositive ? "+" : ""}${stock.change?.toFixed(2)}
          </p>
        </div>
      </div>

      {stock.sparkline?.length > 0 && (
        <div className="mb-2">
          <SparklineChart data={stock.sparkline} isPositive={isPositive} />
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex gap-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Mkt Cap</p>
            <p className="font-mono text-xs text-foreground">{stock.market_cap}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Vol</p>
            <p className="font-mono text-xs text-foreground">{stock.volume}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0 border-border hover:border-primary/40 hover:text-primary"
            onClick={() => onSetAlert?.(stock)}
            title="Set price alert"
          >
            <Bell className="w-3 h-3" />
          </Button>
          <a href={stock.buy_url} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="h-7 text-[11px] gap-1 bg-primary hover:bg-primary/90">
              Trade <ExternalLink className="w-3 h-3" />
            </Button>
          </a>
        </div>
      </div>
    </Card>
  );
}