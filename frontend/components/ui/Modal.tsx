"use client";

import React from "react";
import { C } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: number;
}

export default function Modal({ open, onClose, title, children, maxWidth = 480 }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(13,13,12,0.5)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-up w-full rounded-2xl p-6"
        style={{ background: C.glossCard, border: `1px solid ${C.border}`, boxShadow: C.shadowLift, maxWidth }}
      >
        {title && (
          <h3 className="text-[16px] font-semibold mb-4" style={{ color: C.text }}>
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
}
