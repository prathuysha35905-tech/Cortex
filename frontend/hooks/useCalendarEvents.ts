"use client";

import { useCallback, useEffect, useState } from "react";
import { createEvent, deleteEvent, getEvents, updateEvent } from "@/services/calendar.service";
import type { CalendarEvent } from "@/services/calendar.service";

/**
 * The Calendar UI works in terms of `startHour` + `duration` (hours), while
 * the real backend stores `startHour` + `endHour`. This hook exposes the
 * UI shape and converts to/from the API shape at the network boundary, so
 * the rest of the calendar components don't need to know the difference.
 */
export interface CalendarUiEvent extends Omit<CalendarEvent, "endHour"> {
  duration: number;
  location?: string;
  reminder?: boolean;
}

function toUiEvent(e: CalendarEvent): CalendarUiEvent {
  return { ...e, duration: Math.max(0.25, e.endHour - e.startHour) };
}

function toApiPayload(e: Partial<CalendarUiEvent>) {
  const { id, duration, location, reminder, ...rest } = e as any;
  const payload: any = { ...rest };
  if (e.startHour !== undefined && duration !== undefined) {
    payload.endHour = e.startHour + duration;
  }
  return payload;
}

export function useCalendarEvents(monthKey: string) {
  const [events, setEvents] = useState<CalendarUiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    return getEvents(monthKey)
      .then((data) => setEvents(data.map(toUiEvent)))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load events"))
      .finally(() => setLoading(false));
  }, [monthKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback((payload: Omit<CalendarUiEvent, "id">) => {
    return createEvent(toApiPayload(payload)).then((created) => {
      const uiEvent = toUiEvent(created);
      setEvents((prev) => [...prev, uiEvent]);
      return uiEvent;
    });
  }, []);

  const update = useCallback((id: number, payload: Partial<CalendarUiEvent>) => {
    return updateEvent(id, toApiPayload(payload)).then((updated) => {
      const uiEvent = toUiEvent(updated);
      setEvents((prev) => prev.map((e) => (e.id === id ? uiEvent : e)));
      return uiEvent;
    });
  }, []);

  const remove = useCallback((id: number) => {
    return deleteEvent(id).then(() => {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    });
  }, []);

  return { events, setEvents, loading, error, refresh, add, update, remove };
}
