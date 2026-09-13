"use client";

import React from "react";
import { C } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  variant?: "dark" | "ghost" | "danger";
}

export default function Button({ children, icon: Icon, variant = "dark", className = "", style = {}, ...rest }: ButtonProps) {
  const base = "flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150";

  const variantStyle: React.CSSProperties =
    variant === "danger"
      ? { border: `1px solid ${C.danger}`, color: C.danger, background: C.dangerBg }
      : variant === "ghost"
      ? { border: `1px solid ${C.divider}`, color: C.text, background: "transparent" }
      : {
          background: C.glossDark,
          color: C.onInk,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`,
        };

  return (
    <button
      className={`${base} ${variant === "dark" ? "glossy-btn glitter-sm hover:-translate-y-0.5" : ""} ${className}`}
      style={{ ...variantStyle, ...style }}
      {...rest}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}
