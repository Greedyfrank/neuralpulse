import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { RefreshCw, Zap, Newspaper, BarChart3 } from "lucide-react";

import StockTicker from "../components/dashboard/StockTicker";
import StockCard from "../components/dashboard/StockCard";
import NewsCard from "../components/dashboard/NewsCard";
import MarketSummary from "../components/dashboard/MarketSummary";
import BrokerLinks from "../components/dashboard/BrokerLinks";
import NewsSkeleton from "../components/dashboard/NewsSkeleton";
import StocksSkeleton from "../components/dashboard/StocksSkeleton";

const AI_STOCKS = [
  "NVDA", "MSFT", "GOOGL", "META", "AMZN", "AMD", "INTC",
  "PLTR", "CRM", "SNOW", "AI", "SMCI", "AVGO", "ORCL"
];

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStocks = useCallback(async () => {
    setLoadingStocks(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a financial data assistant. Provide current approximate stock data for these AI-related companies: ${AI_STOCKS.join(", ")}.
      
For each stock, provide:
- symbol (ticker)
- name (company full name)
- price (current approximate price in USD)
- change (dollar change today, can be negative)
- change_percent (percentage change today, can be negative)
- market_cap (formatted string like "3.2T" or "450B")
- volume (formatted string like "45M" or "1.2B")
- buy_url (direct URL to buy this stock on Robinhood, format: https://robinhood.com/stocks/SYMBOL)

Use your best knowledge of recent market data. Make the prices realistic and current.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          stocks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                symbol: { type: "string" },
                name: { type: "string" },
                price: { type: "number" },
                change: { type: "number" },
                change_percent: { type: "number" },
                market_cap: { type: "string" },
                volume: { type: "string" },
                buy_url: { type: "string" }
              }
            }
          }
        }
      },
      model: "gemini_3_flash"
    });
    setStocks(result.stocks || []);
    setLoadingStocks(false);
    setLastUpdated(new Date());
  }, []);

  const fetchNews = useCallback(async () => {
    setLoadingNews(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an AI news aggregator. Provide the 10 most recent and important AI-related news stories from today or this week. Include news about:
- AI company earnings & announcements (OpenAI, Google, Microsoft, NVIDIA, Meta, etc.)
- AI regulation and policy
- New AI model releases and breakthroughs
- AI industry deals and partnerships
- AI stock market movements

For each article provide:
- title (compelling headline)
- summary (2-3 sentence summary)
- source (news outlet name)
- category (one of: "Earnings", "Regulation", "Technology", "Markets", "Deals", "Research")
- time_ago (realistic time like "2h ago", "5h ago", "1d ago")
- url (real URL to a major news source covering this topic, use real URLs from reuters.com, bloomberg.com, cnbc.com, techcrunch.com, theverge.com, etc.)`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          articles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                summary: { type: "string" },
                source: { type: "string" },
                category: { type: "string" },
                time_ago: { type: "string" },
                url: { type: "string" }
              }
            }
          }
        }
      },
      model: "gemini_3_flash"
    });
    setNews(result.articles || []);
    setLoadingNews(false);
  }, []);

  useEffect(() => {
    fetchStocks();
    fetchNews();
  }, [fetchStocks, fetchNews]);

  const handleRefresh = () => {
    fetchStocks();
    fetchNews();
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Ticker */}
      <StockTicker stocks={stocks} loading={loadingStocks} />

      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Zap className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">AI Markets Dashboard</h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" />
                  {lastUpdated
                    ? `Updated ${lastUpdated.toLocaleTimeString()}`
                    : "Loading market data..."}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loadingStocks || loadingNews}
              className="gap-2 text-xs border-border hover:bg-secondary"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${(loadingStocks || loadingNews) ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
          </div>

          {/* Market Summary */}
          <MarketSummary stocks={stocks} />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
            {/* Stocks Section */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">AI Stocks</h2>
              </div>
              {loadingStocks ? (
                <StocksSkeleton />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {stocks.map((stock) => (
                    <StockCard key={stock.symbol} stock={stock} />
                  ))}
                </div>
              )}
            </div>

            {/* News Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Newspaper className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">AI News</h2>
              </div>
              {loadingNews ? (
                <NewsSkeleton />
              ) : (
                <div className="space-y-3">
                  {news.map((article, i) => (
                    <NewsCard key={i} article={article} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Broker Links */}
          <div className="mt-6">
            <BrokerLinks />
          </div>

          {/* Footer */}
          <div className="mt-8 pb-6 text-center">
            <p className="text-[10px] text-muted-foreground">
              Data provided for informational purposes only. Not financial advice. Prices may be delayed.
              Always do your own research before investing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}