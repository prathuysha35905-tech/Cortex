import { api } from "@/lib/api";

export interface AiMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface AiInsight {
  id: number;
  title: string;
  body: string;
}

// The backend's /chat endpoint (see app/api/chat.py -> process_message)
// doesn't return a fixed shape -- depending on detected intent it replies
// with one of:
//   { status, message }                  (no tasks yet)
//   { status, daily_plan }                (plan_day intent)
//   { status, response, actions }         (general AI chat)
//   or whatever modify_plan() returns     (modify_plan intent)
// There's no message id/role/createdAt from the backend at all, so we
// synthesize those and extract the best human-readable string we can.
interface BackendChatReply {
  status?: string;
  message?: string;
  response?: unknown;
  daily_plan?: unknown;
  [key: string]: unknown;
}

function extractReplyText(reply: BackendChatReply): string {
  if (typeof reply.response === "string" && reply.response.trim()) return reply.response;
  if (typeof reply.message === "string" && reply.message.trim()) return reply.message;
  if (reply.daily_plan !== undefined) return "Here's your plan for the day.";
  return "Done.";
}

export async function sendMessage(content: string): Promise<AiMessage> {
  const reply = await api.post<BackendChatReply>("/chat", { message: content });
  return {
    id: Date.now(),
    role: "assistant",
    content: extractReplyText(reply),
    createdAt: new Date().toISOString(),
  };
}

// The backend's /insights endpoint ultimately returns whatever JSON shape
// the LLM produced (see app/insights/service.py -> ask_ai ->
// parse_ai_response), which isn't guaranteed to already be an
// AiInsight[]. Normalize defensively so a malformed/partial AI reply
// doesn't crash the insights UI.
function normalizeInsights(raw: unknown): AiInsight[] {
  if (Array.isArray(raw)) {
    return raw.map((item, i) => {
      if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        return {
          id: typeof obj.id === "number" ? obj.id : i,
          title: typeof obj.title === "string" ? obj.title : `Insight ${i + 1}`,
          body: typeof obj.body === "string" ? obj.body : typeof obj.response === "string" ? obj.response : JSON.stringify(item),
        };
      }
      return { id: i, title: `Insight ${i + 1}`, body: String(item) };
    });
  }
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (typeof obj.response === "string" && obj.response.trim()) {
      return [{ id: 0, title: "Insight", body: obj.response }];
    }
  }
  return [];
}

export async function getInsights(): Promise<AiInsight[]> {
  const raw = await api.get<unknown>("/insights");
  return normalizeInsights(raw);
}
