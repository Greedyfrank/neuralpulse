import React from "react";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const brokers = [
  { name: "Robinhood", url: "https://robinhood.com", description: "Commission-free trading" },
  { name: "E*TRADE", url: "https://etrade.com", description: "Full-service brokerage" },
  { name: "Fidelity", url: "https://fidelity.com", description: "Investment management" },
  { name: "Charles Schwab", url: "https://schwab.com", description: "Trading & banking" },
  { name: "TD Ameritrade", url: "https://tdameritrade.com", description: "Advanced trading tools" },
  { name: "Webull", url: "https://webull.com", description: "Free stock trading" },
];

export default function BrokerLinks() {
  return (
    <Card className="bg-card border-border p-4">
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">Quick Trade — Platforms</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {brokers.map((broker) => (
          <a
            key={broker.name}
            href={broker.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-secondary/50 hover:bg-primary/10 border border-border hover:border-primary/30 transition-all group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">{broker.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{broker.description}</p>
            </div>
            <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
          </a>
        ))}
      </div>
    </Card>
  );
}