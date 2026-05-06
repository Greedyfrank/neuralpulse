import React from "react";
import { Card } from "@/components/ui/card";

export default function StocksSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {Array(8).fill(0).map((_, i) => (
        <Card key={i} className="bg-card border-border p-4 animate-pulse">
          <div className="flex justify-between mb-3">
            <div>
              <div className="h-4 w-14 bg-muted rounded mb-1" />
              <div className="h-3 w-20 bg-muted rounded" />
            </div>
            <div className="text-right">
              <div className="h-5 w-16 bg-muted rounded mb-1" />
              <div className="h-3 w-10 bg-muted rounded ml-auto" />
            </div>
          </div>
          <div className="flex justify-between pt-3 border-t border-border">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-7 w-16 bg-muted rounded" />
          </div>
        </Card>
      ))}
    </div>
  );
}