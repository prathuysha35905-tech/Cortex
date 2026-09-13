"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { C } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav";
import { useAuth } from "@/hooks/useAuth";

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  notifCount?: number;
}

export default function Sidebar({ isOpen, onClose, notifCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const userName = user?.name || "there";

  return (
    <aside
      className={`flex flex-col shrink-0 h-screen fixed lg:sticky top-0 left-0 py-6 px-3 z-50 transition-transform duration-300 ease-out lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{
        width: 240,
        background: C.card,
        borderRight: `1px solid ${C.border}`,
        boxShadow: isOpen ? C.shadowLift : "none",
      }}
    >
      <div className="flex items-center justify-between px-2 mb-9">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center glitter-sm" style={{ background: C.glossDark }}>
            <div style={{ width: 8, height: 8, background: C.onInk, borderRadius: 2 }} />
          </div>
          <span className="font-display font-semibold text-[26px] leading-none relative -top-0.5" style={{ color: C.text }}>
            Cortex
          </span>
        </div>
        <button
          onClick={onClose}
          className="icon-btn lg:hidden w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ color: C.faint }}
          aria-label="Close menu"
        >
          <X size={16} strokeWidth={1.75} />
        </button>
      </div>

      <nav className="flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] transition-colors duration-150 ${
                isActive ? "glitter-sm" : ""
              }`}
              style={{
                color: isActive ? C.onInk : C.sub,
                background: isActive ? C.glossDark : "transparent",
                border: `1px solid ${isActive ? C.ink : "transparent"}`,
              }}
            >
              <Icon size={16.5} strokeWidth={1.75} />
              <span className="font-medium">{item.label}</span>
              {item.label === "Notifications" && notifCount > 0 && (
                <span
                  className="ml-auto text-[10.5px] font-semibold px-1.5 rounded-full"
                  style={{ background: isActive ? "rgba(244,244,242,0.16)" : C.ink, color: C.onInk }}
                >
                  {notifCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
        <div className="flex items-center gap-2.5 px-2 pt-4">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold"
            style={{ background: C.cardMuted, border: `1px solid ${C.border}`, color: C.text }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="leading-tight">
            <div className="text-[12.5px] font-medium" style={{ color: C.text }}>
              {userName}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
