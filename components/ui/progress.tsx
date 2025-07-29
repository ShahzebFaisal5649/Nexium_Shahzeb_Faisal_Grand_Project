// Inside @/components/ui/progress.tsx
"use client";

import * as React from "react";

// Define the Progress component
export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={`bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}