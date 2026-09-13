import { api } from "@/lib/api";

export interface NotificationResponse {
  id: number;
  title: string;
  body: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  read: boolean;
  createdAt: string;
}

// Wire shape from app/models/notification.py / app/schemas/notification.py
interface BackendNotification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  priority: string;
  is_read: boolean;
  created_at: string;
}

function toNotification(n: BackendNotification): NotificationResponse {
  const priority = (["Low", "Medium", "High"] as const).find(
    (p) => p.toUpperCase() === n.priority?.toUpperCase()
  );
  return {
    id: n.id,
    title: n.title,
    body: n.message,
    category: n.notification_type,
    priority: priority ?? "Medium",
    read: n.is_read,
    createdAt: n.created_at,
  };
}

export async function getNotifications(): Promise<NotificationResponse[]> {
  const res = await api.get<BackendNotification[]>("/notifications");
  return res.map(toNotification);
}

export async function markNotificationRead(id: number): Promise<NotificationResponse> {
  const res = await api.patch<BackendNotification>(`/notifications/${id}/read`);
  return toNotification(res);
}

export function archiveNotification(id: number): Promise<void> {
  return api.delete<void>(`/notifications/${id}`);
}
