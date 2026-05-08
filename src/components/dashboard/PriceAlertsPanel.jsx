import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Bell, Trash2, TrendingUp, TrendingDown, CheckCircle2 } from "lucide-react";

export default function PriceAlertsPanel({ refresh }) {
  const [alerts, setAlerts] = useState([]);

  const load = async () => {
    const data = await base44.entities.PriceAlert.list("-created_date", 20);
    setAlerts(data);
  };

  useEffect(() => { load(); }, [refresh]);

  const handleDelete = async (id) => {
    await base44.entities.PriceAlert.delete(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  if (!alerts.length) return (
    <Card className="bg-card border-border p-4 mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-primary" />
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Active Price Alerts</h3>
      </div>
      <p className="text-xs text-muted-foreground text-center py-4">
        No active price alerts. Click the bell icon on any stock card to create one.
      </p>
    </Card>
  );

  return (
    <Card className="bg-card border-border p-4 mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-primary" />
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Active Price Alerts</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${
              alert.status === "triggered"
                ? "border-accent/40 bg-accent/5"
                : "border-border bg-secondary/30"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {alert.status === "triggered" ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0" />
              ) : alert.condition === "above" ? (
                <TrendingUp className="w-3.5 h-3.5 text-accent flex-shrink-0" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-mono text-xs font-bold text-foreground">{alert.symbol}</p>
                <p className="text-[10px] text-muted-foreground">
                  {alert.condition} ${alert.target_price?.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(alert.id)}
              className="text-muted-foreground hover:text-destructive transition-colors ml-2 flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}