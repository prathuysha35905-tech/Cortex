"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";
import { C } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon: Icon = Plus, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 fade-up">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5 glitter-sm" style={{ background: C.glossDark }}>
        <Icon size={22} color={C.onInk} strokeWidth={1.75} />
      </div>
      <h2 className="text-[22px] font-semibold mb-2" style={{ color: C.text }}>
        <span className="font-display text-[30px] font-normal align-middle">{title}</span>
      </h2>
      <p className="text-[13.5px] max-w-sm mb-6" style={{ color: C.sub }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="glossy-btn glitter-sm flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13.5px] font-medium"
          style={{ background: C.glossDark, color: C.onInk, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}` }}
        >
          <Plus size={15} strokeWidth={2} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
