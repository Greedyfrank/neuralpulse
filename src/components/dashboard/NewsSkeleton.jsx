import React from "react";
import { Card } from "@/components/ui/card";

export default function NewsSkeleton() {
  return (
    <div className="space-y-3">
      {Array(5).fill(0).map((_, i) => (
        <Card key={i} className="bg-card border-border p-4 animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-14 bg-muted rounded" />
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
          <div className="h-4 w-full bg-muted rounded mb-1.5" />
          <div className="h-3 w-3/4 bg-muted rounded mb-2" />
          <div className="h-3 w-1/2 bg-muted rounded" />
        </Card>
      ))}
    </div>
  );
}