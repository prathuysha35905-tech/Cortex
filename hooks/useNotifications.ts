"use client";

import { useCallback, useEffect, useState } from "react";
import { archiveNotification, getNotifications, markNotificationRead } from "@/services/notification.service";
import type { NotificationResponse } from "@/services/notification.service";

export interface UiNotification extends NotificationResponse {
  time: string;
  when: "today" | "week" | "older";
  pinned: boolean;
  description: string;
  mention: boolean;
}

function relativeTime(iso: string) {
  const then = new Date(iso).getTime();
  if (isNaN(then)) return "";
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function whenBucket(iso: string): "today" | "week" | "older" {
  const then = new Date(iso).getTime();
  if (isNaN(then)) return "older";
  const days = (Date.now() - then) / 86400000;
  if (days < 1) return "today";
  if (days < 7) return "week";
  return "older";
}

export function useNotifications() {
  const [items, setItems] = useState<NotificationResponse[]>([]);
  const [pinnedIds, setPinnedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    return getNotifications()
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load notifications"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const notifications: UiNotification[] = items.map((n) => ({
    ...n,
    time: relativeTime(n.createdAt),
    when: whenBucket(n.createdAt),
    pinned: pinnedIds.includes(n.id),
    description: n.body,
    mention: false,
  }));

  const markRead = useCallback((id: number) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    return markNotificationRead(id).catch(() => {});
  }, []);

  const markAllRead = useCallback(() => {
    const unread = items.filter((n) => !n.read);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    return Promise.all(unread.map((n) => markNotificationRead(n.id).catch(() => {})));
  }, [items]);

  const archive = useCallback((id: number) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    return archiveNotification(id).catch(() => {});
  }, []);

  const togglePin = useCallback((id: number) => {
    setPinnedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  return { notifications, loading, error, refresh, markRead, markAllRead, archive, togglePin };
}
