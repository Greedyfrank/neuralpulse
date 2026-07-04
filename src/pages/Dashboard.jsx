import React, { useState, useEffect, useCallback, useMemo } from "react";
import { fetchStocks as getStocks, fetchNews as getNews } from "@/lib/marketApi";
import { Button } from "@/components/ui/button";
import { RefreshCw, Zap, Newspaper, BarChart3, Search, X } from "lucide-react";
import PriceAlertModal from "../components/dashboard/PriceAlertModal";
import PriceAlertsPanel from "../components/dashboard/PriceAlertsPanel";

import StockTicker from "../components/dashboard/StockTicker";
import StockCard from "../components/dashboard/StockCard";
import NewsCard from "../components/dashboard/NewsCard";
import MarketSummary from "../components/dashboard/MarketSummary";
import BrokerLinks from "../components/dashboard/BrokerLinks";
import NewsSkeleton from "../components/dashboard/NewsSkeleton";
import StocksSkeleton from "../components/dashboard/StocksSkeleton";
import NewsFilter from "../components/dashboard/NewsFilter";
import NewsSummary from "../components/dashboard/NewsSummary";

function generateSparkline(currentPrice, changePercent) {
  const points = 12;
  const data = [];
  // Work backwards to simulate intraday price movement
  let price = currentPrice;
  for (let i = points; i >= 0; i--) {
    const noise = (Math.random() - 0.5) * currentPrice * 0.008;
    const trend = (changePercent / 100) * currentPrice * (i / points) * 0.6;
    data.unshift({ price: Math.max(0, price - trend + noise) });
  }
  data[data.length - 1] = { price: currentPrice };
  return data;
}

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [news, setNews] = useState([]);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newsTopic, setNewsTopic] = useState("all");
  const [newsSearch, setNewsSearch] = useState("");
  const [alertStock, setAlertStock] = useState(null);
  const [alertsRefresh, setAlertsRefresh] = useState(0);

  const fetchStocks = useCallback(async () => {
    setLoadingStocks(true);
    try {
      const result = await getStocks();
      const enriched = result.map((s) => ({
        ...s,
        sparkline: generateSparkline(s.price, s.change_percent),
      }));
      setStocks(enriched);
      setLastUpdated(new Date());
    } catch (e) {
      console.error("Failed to load stocks:", e);
    } finally {
      setLoadingStocks(false);
    }
  }, []);

  const fetchNews = useCallback(async () => {
    setLoadingNews(true);
    try {
      const result = await getNews();
      setNews(result);
    } catch (e) {
      console.error("Failed to load news:", e);
    } finally {
      setLoadingNews(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
    fetchNews();
  }, [fetchStocks, fetchNews]);

  const handleRefresh = () => {
    fetchStocks();
    fetchNews();
  };

  const filteredNews = useMemo(() => {
    const q = newsSearch.trim().toLowerCase();
    return news.filter(
      (a) =>
        (newsTopic === "all" || a.category === newsTopic) &&
        (!q ||
          a.title?.toLowerCase().includes(q) ||
          a.summary?.toLowerCase().includes(q))
    );
  }, [news, newsTopic, newsSearch]);

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
                    <StockCard key={stock.symbol} stock={stock} onSetAlert={setAlertStock} />
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
              <div className="mb-3">
                <NewsSummary news={news} />
              </div>
              {/* Search bar */}
              <div className="relative mb-3">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  placeholder="Search headlines..."
                  className="w-full bg-secondary/50 border border-border rounded-lg pl-8 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                {newsSearch && (
                  <button
                    onClick={() => setNewsSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <NewsFilter selected={newsTopic} onChange={setNewsTopic} />
              {loadingNews ? (
                <NewsSkeleton />
              ) : (
                <div className="space-y-3">
                  {filteredNews.map((article, i) => (
                    <NewsCard key={article.url || article.title || i} article={article} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Price Alerts Panel */}
          <PriceAlertsPanel refresh={alertsRefresh} />

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
      {/* Price Alert Modal */}
      <PriceAlertModal
        stock={alertStock}
        open={!!alertStock}
        onClose={() => setAlertStock(null)}
        onCreated={() => setAlertsRefresh((n) => n + 1)}
      />
    </div>
  );
}
