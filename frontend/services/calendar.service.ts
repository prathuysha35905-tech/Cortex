import { api } from "@/lib/api";

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  startHour: number;
  endHour: number;
  category: string;
  priority: "Low" | "Medium" | "High";
  status: "Upcoming" | "In Progress" | "Done";
}

export function getEvents(month: string): Promise<CalendarEvent[]> {
  return api.get<CalendarEvent[]>(`/calendar/events?month=${encodeURIComponent(month)}`);
}

export function createEvent(payload: Omit<CalendarEvent, "id">): Promise<CalendarEvent> {
  return api.post<CalendarEvent>("/calendar/events", payload);
}

export function updateEvent(id: number, payload: Partial<CalendarEvent>): Promise<CalendarEvent> {
  return api.patch<CalendarEvent>(`/calendar/events/${id}`, payload);
}

export function deleteEvent(id: number): Promise<void> {
  return api.delete<void>(`/calendar/events/${id}`);
}
