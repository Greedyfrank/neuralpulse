import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

function StockTicker({ stocks, loading }) {
  if (loading || !stocks?.length) {
    return (
      <div className="w-full bg-secondary/50 border-b border-border py-2.5 overflow-hidden">
        <div className="flex items-center gap-8 px-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-2 animate-pulse">
              <div className="h-3 w-12 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const duplicated = [...stocks, ...stocks];

  return (
    <div className="w-full bg-secondary/50 border-b border-border py-2.5 overflow-hidden">
      <div className="ticker-animate flex items-center gap-8 whitespace-nowrap" style={{ width: "max-content" }}>
        {duplicated.map((stock, i) => {
          const isPositive = stock.change >= 0;
          return (
            <a
              key={`${stock.symbol}-${i}`}
              href={stock.buy_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer group"
            >
              <span className="font-mono text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                {stock.symbol}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                ${stock.price?.toFixed(2)}
              </span>
              <span className={`flex items-center gap-0.5 font-mono text-xs font-medium ${isPositive ? "text-accent" : "text-destructive"}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? "+" : ""}{stock.change_percent?.toFixed(2)}%
              </span>
              <div className="w-px h-3 bg-border ml-2" />
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(StockTicker);