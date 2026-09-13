"use client";

import React, { useState } from "react";
import { C } from "@/lib/utils";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AnimatedDotField from "./AnimatedDotField";
import AiChatWidget from "./AiChatWidget";
import { useNotifications } from "@/hooks/useNotifications";

export interface PageContainerProps {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const mainMaxWidth = "max-w-[1760px]";

  return (
    <div
      style={{
        backgroundColor: C.canvas,
        minHeight: "100vh",
        fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
        position: "relative",
      }}
    >
      <AnimatedDotField />

      <div className="flex relative" style={{ zIndex: 1 }}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} notifCount={unreadCount} />

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden transition-opacity duration-300"
            style={{ background: "rgba(13,13,12,0.45)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <main className={`flex-1 px-5 sm:px-8 lg:px-8 xl:px-10 py-5 lg:py-7 ${mainMaxWidth} mx-auto w-full`}>
          <Header onMenuClick={() => setSidebarOpen(true)} unreadCount={unreadCount} />
          {children}
        </main>
      </div>

      <AiChatWidget />
    </div>
  );
}
