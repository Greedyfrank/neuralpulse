import React, { useState, useEffect } from "react";
import { summarizeNews } from "@/lib/marketApi";
import { Card } from "@/components/ui/card";
import { Sparkles, RefreshCw } from "lucide-react";

export default function NewsSummary({ news }) {
  const [bullets, setBullets] = useState([]);
  const [loading, setLoading] = useState(false);

  const summarize = async () => {
    if (!news?.length) return;
    setLoading(true);
    try {
      const titles = news.map((a) => a.title);
      const bullets = await summarizeNews(titles);
      setBullets(bullets);
    } catch (e) {
      console.error("Failed to summarize news:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (news?.length) summarize();
  }, [news?.length]);

  return (
    <Card className="bg-card border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-medium">AI News Summary</h3>
        </div>
        <button
          onClick={summarize}
          disabled={loading || !news?.length}
          className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
          title="Refresh summary"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0" />
              <div className="h-3 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      ) : bullets.length > 0 ? (
        <ul className="space-y-2">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-2.5 text-xs text-foreground leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">Waiting for news to load...</p>
      )}
    </Card>
  );
}