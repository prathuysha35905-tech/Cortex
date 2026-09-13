"use client";

import { useCallback, useEffect, useState } from "react";
import { getInsights, sendMessage } from "@/services/ai.service";
import type { AiInsight, AiMessage } from "@/services/ai.service";

export interface ChatMessage {
  id: number | string;
  role: "user" | "assistant";
  text: string;
  time: string;
}

export interface Conversation {
  id: number | string;
  title: string;
  date: string;
  preview: string;
  messages: ChatMessage[];
}

const STORAGE_KEY = "cortex_ai_conversations";

function nowLabel() {
  return new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function loadConversations(): Conversation[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConversations(conversations: Conversation[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    /* ignore persistence errors */
  }
}

/**
 * Manages chat conversations for the AI Assistant page. Conversation
 * grouping/history is kept client-side (persisted to localStorage) since
 * the backend only exposes a single chat endpoint (`sendMessage`) plus
 * fetching one conversation's messages by id — there's no "list all
 * conversations" endpoint. Every reply is a real call to the backend.
 */
export function useAiAssistant() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadConversations();
    setConversations(loaded);
    setActiveId(loaded[0]?.id ?? null);
  }, []);

  useEffect(() => {
    if (conversations.length) saveConversations(conversations);
  }, [conversations]);

  const startNewConversation = useCallback(() => {
    const id = Date.now();
    const conv: Conversation = { id, title: "New conversation", date: "Today", preview: "", messages: [] };
    setConversations(prev => [conv, ...prev]);
    setActiveId(id);
    return id;
  }, []);

  const send = useCallback((text: string) => {
    if (!text.trim()) return Promise.resolve();
    let targetId = activeId;
    let isNew = false;
    if (targetId === null) {
      targetId = Date.now();
      isNew = true;
    }
    const userMsg: ChatMessage = { id: `u${Date.now()}`, role: "user", text, time: nowLabel() };

    setConversations(prev => {
      if (isNew) {
        const conv: Conversation = {
          id: targetId as number,
          title: text.slice(0, 40),
          date: "Today",
          preview: text,
          messages: [userMsg],
        };
        return [conv, ...prev];
      }
      return prev.map(c => c.id === targetId ? { ...c, messages: [...c.messages, userMsg], preview: text } : c);
    });
    if (isNew) setActiveId(targetId);

    setSending(true);
    setError(null);
    return sendMessage(text)
      .then((reply: AiMessage) => {
        const assistantMsg: ChatMessage = {
          id: reply.id ?? `a${Date.now()}`,
          role: "assistant",
          text: reply.content,
          time: nowLabel(),
        };
        setConversations(prev => prev.map(c => c.id === targetId ? { ...c, messages: [...c.messages, assistantMsg], preview: assistantMsg.text } : c));
      })
      .catch(err => setError(err instanceof Error ? err.message : "Couldn't reach the assistant"))
      .finally(() => setSending(false));
  }, [activeId]);

  const activeConversation = conversations.find(c => c.id === activeId) || null;

  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(true);
  useEffect(() => {
    getInsights()
      .then(setInsights)
      .catch(() => setInsights([]))
      .finally(() => setInsightsLoading(false));
  }, []);

  return {
    conversations,
    activeId,
    activeConversation,
    setActiveId,
    startNewConversation,
    send,
    sending,
    error,
    insights,
    insightsLoading,
  };
}
