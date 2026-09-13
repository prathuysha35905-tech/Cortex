"use client";

import React from "react";
import { C } from "@/lib/utils";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (value: string) => void;
  label?: string;
}

export default function Input({ label, onChange, className = "", style = {}, ...rest }: InputProps) {
  const field = (
    <input
      {...rest}
      onChange={(e) => onChange?.(e.target.value)}
      className={`text-[13px] px-3 py-2 rounded-lg outline-none w-full ${className}`}
      style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text, ...style }}
    />
  );

  if (!label) return field;

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-medium" style={{ color: C.sub }}>
        {label}
      </span>
      {field}
    </label>
  );
}
