import React from "react";

const TOPICS = [
  { label: "All", value: "all" },
  { label: "AI Chips", value: "AI Chips" },
  { label: "LLM Software", value: "LLM Software" },
  { label: "Earnings", value: "Earnings" },
  { label: "Regulation", value: "Regulation" },
  { label: "Research", value: "Research" },
  { label: "Deals", value: "Deals" },
  { label: "Markets", value: "Markets" },
];

export default function NewsFilter({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-3">
      {TOPICS.map((topic) => (
        <button
          key={topic.value}
          onClick={() => onChange(topic.value)}
          className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide transition-all border ${
            selected === topic.value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
          }`}
        >
          {topic.label}
        </button>
      ))}
    </div>
  );
}