"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell } from "lucide-react";
import { C } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export interface HeaderProps {
  onMenuClick: () => void;
  unreadCount?: number;
}

export default function Header({ onMenuClick, unreadCount = 0 }: HeaderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const userName = user?.name || "there";
  const today = useMemo(
    () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    []
  );
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <header className="flex items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors"
          style={{ border: `1px solid ${C.border}`, background: C.card, boxShadow: C.shadow }}
          aria-label="Open menu"
        >
          <Menu size={16} color={C.text} strokeWidth={1.75} />
        </button>
        <div>
          <div className="text-[13px]" style={{ color: C.faint }}>
            {today}
          </div>
          <div className="text-[15px] font-medium mt-0.5" style={{ color: C.text }}>
            {greeting}, {userName.split(" ")[0]}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ border: `1px solid ${C.border}`, background: C.card, width: 240, boxShadow: C.shadow }}
        >
          <Search size={14} color={C.faint} />
          <span className="text-[13px]" style={{ color: C.faint }}>
            Search Cortex…
          </span>
        </div>
        <button
          onClick={() => router.push("/notifications")}
          className="w-9 h-9 rounded-lg flex items-center justify-center relative transition-colors"
          style={{ border: `1px solid ${C.border}`, background: C.card, boxShadow: C.shadow }}
          aria-label="Open notifications"
        >
          <Bell size={15} color={C.sub} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: C.ink }} />
          )}
        </button>
        <button
          onClick={() => router.push("/settings")}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold glitter-sm"
          style={{ background: C.glossDark, color: C.onInk, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18), ${C.shadow}` }}
          aria-label="Account settings"
        >
          {userName.charAt(0).toUpperCase()}
        </button>
      </div>
    </header>
  );
}
