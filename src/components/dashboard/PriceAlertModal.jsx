import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, TrendingUp, TrendingDown } from "lucide-react";

export default function PriceAlertModal({ stock, open, onClose, onCreated }) {
  const [condition, setCondition] = useState("above");
  const [targetPrice, setTargetPrice] = useState(stock?.price ? String(Math.round(stock.price * 1.05)) : "");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!targetPrice || !email) return;
    setSaving(true);
    await base44.entities.PriceAlert.create({
      symbol: stock.symbol,
      stock_name: stock.name,
      target_price: parseFloat(targetPrice),
      condition,
      email,
      status: "active",
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onCreated?.();
      onClose();
    }, 1200);
  };

  if (!stock) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Bell className="w-4 h-4 text-primary" />
            Set Price Alert — <span className="font-mono text-primary">{stock.symbol}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
            <span>{stock.name}</span>
            <span className="font-mono text-foreground font-semibold">${stock.price?.toFixed(2)}</span>
          </div>

          {/* Condition toggle */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Notify me when price goes</p>
            <div className="flex gap-2">
              <button
                onClick={() => setCondition("above")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-semibold transition-all ${
                  condition === "above"
                    ? "bg-accent/15 border-accent text-accent"
                    : "bg-secondary/50 border-border text-muted-foreground hover:border-accent/40"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" /> Above
              </button>
              <button
                onClick={() => setCondition("below")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-semibold transition-all ${
                  condition === "below"
                    ? "bg-destructive/15 border-destructive text-destructive"
                    : "bg-secondary/50 border-border text-muted-foreground hover:border-destructive/40"
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" /> Below
              </button>
            </div>
          </div>

          {/* Target price */}
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Target price (USD)</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="pl-7 bg-secondary/50 border-border text-foreground font-mono"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Notification email</p>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary/50 border-border text-foreground"
              placeholder="you@example.com"
            />
          </div>

          <Button
            className="w-full gap-2"
            onClick={handleSave}
            disabled={saving || saved || !targetPrice || !email}
          >
            <Bell className="w-3.5 h-3.5" />
            {saved ? "Alert Set!" : saving ? "Saving..." : "Set Alert"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}