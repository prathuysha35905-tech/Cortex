"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { C } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav";
import { useAuth } from "@/hooks/useAuth";
import { sendMessage } from "@/services/ai.service";

const STORAGE_KEY = "cortex_ai_widget_messages";
const MAX_STORED = 30;

function loadMessages() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: any[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED)));
  } catch {
    /* ignore persistence errors */
  }
}

function nowLabel() {
  return new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

// Very small, deterministic "go to X" intent matcher against the real nav
// items — this runs entirely client-side so navigation is instant and
// doesn't cost an API round trip.
function matchNavigation(text: string) {
  const q = text.trim().toLowerCase().replace(/[.?!]+$/, "");
  const navPhrases = ["go to ", "open ", "take me to ", "navigate to ", "show me ", "switch to "];
  let target = q;
  for (const phrase of navPhrases) {
    if (q.startsWith(phrase)) {
      target = q.slice(phrase.length);
      break;
    }
  }
  target = target.trim();
  const found = NAV_ITEMS.find(item => {
    const label = item.label.toLowerCase();
    return label === target || target === label.replace(/\s+/g, "") || label.includes(target) && target.length > 2 || target.includes(label);
  });
  return found || null;
}

export default function AiChatWidget() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hide the widget on the login/register screens and on the full AI
  // Assistant page, where a dedicated chat already lives.
  const hidden = pathname === "/login" || pathname === "/register" || pathname === "/ai-assistant";

  useEffect(() => {
    setMessages(loadMessages());
  }, []);

  useEffect(() => {
    if (messages.length) saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, sending]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const firstName = (user?.name || "there").split(" ")[0];
  const hour = new Date().getHours();
  const greetingWord = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const greeting = `${greetingWord}, ${firstName}! I'm your Cortex assistant. Ask me about your day, or tell me where you'd like to go — try "open tasks" or "take me to calendar".`;

  function pushMessage(msg: any) {
    setMessages(prev => [...prev, msg]);
  }

  function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setError(null);
    pushMessage({ id: `u${Date.now()}`, role: "user", text, time: nowLabel() });

    const navTarget = matchNavigation(text);
    if (navTarget) {
      pushMessage({ id: `a${Date.now()}`, role: "assistant", text: `Sure — heading to ${navTarget.label}.`, time: nowLabel() });
      router.push(navTarget.href);
      return;
    }

    setSending(true);
    sendMessage(text)
      .then(reply => {
        pushMessage({ id: reply.id ?? `a${Date.now()}`, role: "assistant", text: reply.content, time: nowLabel() });
      })
      .catch(err => setError(err instanceof Error ? err.message : "Couldn't reach the assistant"))
      .finally(() => setSending(false));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (hidden) return null;

  return (
    <>
      {open && (
        <div
          className="fixed bottom-24 right-5 sm:right-8 z-[120] flex flex-col fade-up"
          style={{
            width: 340,
            maxWidth: "calc(100vw - 2.5rem)",
            height: 460,
            maxHeight: "calc(100vh - 8rem)",
            background: C.canvas,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            boxShadow: C.shadowLift,
            overflow: "hidden",
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ borderBottom: `1px solid ${C.borderSoft}` }}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="pulse-ping absolute inline-flex h-full w-full rounded-full" style={{ background: "rgba(13,13,12,0.35)" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: C.ink }} />
              </span>
              <span className="text-[13.5px] font-semibold" style={{ color: C.text }}>
                Cortex Assistant
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ color: C.faint }}
              aria-label="Close assistant"
            >
              <X size={15} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 glitter-sm" style={{ background: C.glossDark }}>
                <Sparkles size={12} color={C.onInk} strokeWidth={2} />
              </div>
              <div
                className="text-[12.5px] leading-relaxed px-3 py-2 rounded-xl rounded-tl-sm"
                style={{ background: C.cardMuted, color: C.text, maxWidth: "85%" }}
              >
                {greeting}
              </div>
            </div>

            {messages.map(m => (
              <div key={m.id} className={`flex items-start gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 glitter-sm" style={{ background: C.glossDark }}>
                    <Sparkles size={12} color={C.onInk} strokeWidth={2} />
                  </div>
                )}
                <div
                  className="text-[12.5px] leading-relaxed px-3 py-2 whitespace-pre-wrap"
                  style={{
                    background: m.role === "user" ? C.glossDark : C.cardMuted,
                    color: m.role === "user" ? C.onInk : C.text,
                    maxWidth: "85%",
                    borderRadius: 12,
                    borderTopRightRadius: m.role === "user" ? 4 : 12,
                    borderTopLeftRadius: m.role === "assistant" ? 4 : 12,
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 glitter-sm" style={{ background: C.glossDark }}>
                  <Sparkles size={12} color={C.onInk} strokeWidth={2} />
                </div>
                <div className="px-3 py-2 rounded-xl rounded-tl-sm flex items-center gap-1.5" style={{ background: C.cardMuted }}>
                  <Loader2 size={12} className="animate-spin" color={C.faint} />
                  <span className="text-[12px]" style={{ color: C.faint }}>Thinking…</span>
                </div>
              </div>
            )}
            {error && (
              <div className="text-[12px] px-1" style={{ color: C.warn }}>
                {error}
              </div>
            )}
          </div>

          <div className="p-3 shrink-0" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ border: `1px solid ${C.border}`, background: C.canvas }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your day, or say “open tasks”…"
                className="flex-1 bg-transparent outline-none text-[12.5px]"
                style={{ color: C.text }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 disabled:opacity-40"
                style={{ background: C.glossDark, color: C.onInk }}
                aria-label="Send message"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-5 sm:right-8 z-[120] w-13 h-13 rounded-full flex items-center justify-center glitter-sm transition-transform duration-150 hover:-translate-y-0.5"
        style={{
          width: 52,
          height: 52,
          background: C.glossDark,
          color: C.onInk,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadowLift}`,
        }}
        aria-label={open ? "Close Cortex assistant" : "Open Cortex assistant"}
      >
        {open ? (
          <X size={20} />
        ) : (
          <span className="font-display font-semibold text-[18px] leading-none" style={{ color: C.onInk }}>
            C
          </span>
        )}
      </button>
    </>
  );
}
