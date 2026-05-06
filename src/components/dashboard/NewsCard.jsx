import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock } from "lucide-react";

export default function NewsCard({ article }) {
  return (
    <Card className="bg-card border-border p-4 hover:border-primary/40 transition-all duration-300 group">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-primary/5 px-1.5 py-0">
              {article.category}
            </Badge>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-2.5 h-2.5" />
              {article.time_ago}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-foreground leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {article.summary}
          </p>
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[10px] text-muted-foreground font-medium">{article.source}</span>
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Read more <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}