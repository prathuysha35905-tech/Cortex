"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import { C } from "@/lib/utils";

export interface LoaderProps {
  label?: string;
  cards?: number;
}

export default function Loader({ label = "Loading…", cards = 6 }: LoaderProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6 fade-up" style={{ color: C.faint }}>
        <RefreshCw size={14} className="animate-spin" />
        <span className="text-[13px] font-medium">{label}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={i}
            className="fade-up rounded-2xl p-5"
            style={{ background: C.card, border: `1px solid ${C.border}`, animationDelay: `${i * 40}ms` }}
          >
            <div className="h-4 w-24 rounded-full mb-4" style={{ background: C.cardMuted }} />
            <div className="h-4 w-3/4 rounded-md mb-2" style={{ background: C.cardMuted }} />
            <div className="h-3 w-full rounded-md mb-1.5" style={{ background: C.cardMuted }} />
            <div className="h-3 w-5/6 rounded-md mb-5" style={{ background: C.cardMuted }} />
            <div className="h-1.5 w-full rounded-full" style={{ background: C.cardMuted }} />
          </div>
        ))}
      </div>
    </div>
  );
}
