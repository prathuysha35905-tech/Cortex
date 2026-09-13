"use client";

import React from "react";
import { C } from "@/lib/utils";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export default function Card({ children, className = "", style = {}, delay = 0 }: CardProps) {
  return (
    <div
      className={`fade-up rounded-2xl relative overflow-hidden ${className}`}
      style={{
        background: C.glossCard,
        border: `1px solid ${C.border}`,
        boxShadow: C.shadow,
        animationDelay: `${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
