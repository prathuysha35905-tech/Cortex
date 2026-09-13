// @ts-nocheck
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Accessibility as AccessibilityIcon,
  Activity,
  AlertTriangle,
  Archive,
  ArchiveRestore,
  ArrowDownRight,
  ArrowRight,
  ArrowUpDown,
  ArrowUpRight,
  AtSign,
  Award,
  BarChart3,
  Bell,
  BellOff,
  BellRing,
  BookOpen,
  Brain,
  Briefcase,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  Camera,
  Check,
  CheckCheck,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleAlert,
  CircleSlash,
  ClipboardList,
  Clock,
  Cloud,
  Code2,
  Coffee,
  Copy,
  Database,
  Download,
  Dumbbell,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Flame,
  Github,
  Globe,
  GraduationCap,
  GripVertical,
  HardDrive,
  Heart,
  History,
  Hourglass,
  Info,
  KeyRound,
  Laptop,
  Layers,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  Lock,
  LogOut,
  Mail,
  MailOpen,
  MapPin,
  Medal,
  Menu,
  MessageSquare,
  Mic,
  MonitorSmartphone,
  MoreHorizontal,
  Palette,
  Paperclip,
  PauseCircle,
  PenLine,
  Pencil,
  Percent,
  Pin,
  PinOff,
  PlayCircle,
  Plug,
  Plus,
  RefreshCw,
  Repeat,
  Rocket,
  RotateCcw,
  Save,
  Search,
  Send,
  SendHorizontal,
  Settings,
  Share2,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Square,
  Star,
  Sun,
  Sunrise,
  Target,
  ThumbsDown,
  ThumbsUp,
  Timer,
  Trash2,
  TrendingDown,
  TrendingUp,
  Trophy,
  Upload,
  User,
  Users,
  Users2,
  Video,
  Wand2,
  X,
  Zap,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { C } from "@/lib/utils";
import Card from "@/components/ui/Card";
import { useAiAssistant } from "@/hooks/useAiAssistant";
import { useTasks } from "@/hooks/useTasks";
import { useGoals } from "@/hooks/useGoals";
import { useHabits } from "@/hooks/useHabits";
import { useDashboard } from "@/hooks/useDashboard";

/* ==================================================================== */
/* AI Assistant                                                           */
/* ==================================================================== */

/* ------------------------------------------------------------------ */
/* Mock data                                                            */
/* ------------------------------------------------------------------ */
const As_quickActions = [{
  id: "plan-day",
  icon: Sun,
  title: "Plan My Day",
  desc: "A schedule built from today's tasks and your focus windows.",
  prompt: "Plan my day based on today's tasks and goals."
}, {
  id: "create-tasks",
  icon: ListChecks,
  title: "Create Tasks",
  desc: "Turn a goal or note into a clear, actionable task list.",
  prompt: "Help me create tasks for launching the new website."
}, {
  id: "study-plan",
  icon: GraduationCap,
  title: "Generate Study Plan",
  desc: "A study schedule built around your exams and habits.",
  prompt: "Help me prepare for my exams."
}, {
  id: "explain-code",
  icon: Code2,
  title: "Explain Code",
  desc: "Paste a snippet and get a clear, line-by-line breakdown.",
  prompt: "Explain this code."
}, {
  id: "summarize-notes",
  icon: FileText,
  title: "Summarize Notes",
  desc: "Condense long notes into the takeaways that matter.",
  prompt: "Summarize my notes."
}, {
  id: "brainstorm",
  icon: Lightbulb,
  title: "Brainstorm Ideas",
  desc: "Fresh angles and directions for any project.",
  prompt: "Brainstorm ideas for my product launch."
}, {
  id: "weekly-review",
  icon: BarChart3,
  title: "Weekly Review",
  desc: "A look back at progress, wins, and what slipped.",
  prompt: "Give me a weekly review."
}, {
  id: "improve-productivity",
  icon: TrendingUp,
  title: "Improve Productivity",
  desc: "Tailored tips based on how you actually work.",
  prompt: "How can I improve my productivity?"
}];
const As_suggestedPrompts = ["What should I focus on today?", "Help me prepare for my exams.", "Plan my evening.", "Explain this code.", "Organize my schedule.", "Summarize my notes."];
/* ------------------------------------------------------------------ */
/* AI context, insights, conversation history, and chat replies now    */
/* come from real hooks (useAiAssistant, useTasks, useGoals,           */
/* useHabits, useDashboard) instead of fixed mock data.                */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Conversation list                                                    */
/* ------------------------------------------------------------------ */
function As_ConversationList({
  conversations,
  activeId,
  onSelect,
  search
}) {
  const filtered = conversations.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
  return <div className="flex flex-col gap-2">
      {filtered.length === 0 && <p className="text-[12.5px] px-1 py-3" style={{
      color: C.faint
    }}>
          No conversations match "{search}".
        </p>}
      {filtered.map(c => {
      const isActive = activeId === c.id;
      return <button key={c.id} onClick={() => onSelect(c.id)} className="icon-btn w-full text-left px-3 py-2.5 rounded-xl" style={{
        background: isActive ? C.cardMuted : "transparent",
        border: `1px solid ${isActive ? C.ink : "transparent"}`
      }}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12.5px] font-medium truncate" style={{
            color: C.text
          }}>
                {c.title}
              </span>
              <span className="text-[10.5px] shrink-0" style={{
            color: C.faint
          }}>
                {c.date}
              </span>
            </div>
            <p className="text-[11.5px] mt-1 leading-snug" style={{
          color: C.sub,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
              {c.preview}
            </p>
          </button>;
    })}
    </div>;
}

/* ------------------------------------------------------------------ */
/* AI Action Card                                                       */
/* ------------------------------------------------------------------ */
function As_AIActionCard({
  action,
  onClick,
  delay
}) {
  const Icon = action.icon;
  return <Card className="p-4 min-w-[190px] sm:min-w-0" delay={delay}>
      <button onClick={() => onClick(action)} className="w-full h-full text-left flex flex-col">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mb-3" style={{
        background: C.cardMuted,
        border: `1px solid ${C.border}`
      }}>
          <Icon size={15} color={C.text} strokeWidth={1.75} />
        </div>
        <div className="text-[13px] font-semibold mb-1" style={{
        color: C.text
      }}>
          {action.title}
        </div>
        <p className="text-[11.5px] leading-relaxed" style={{
        color: C.sub
      }}>
          {action.desc}
        </p>
      </button>
    </Card>;
}

/* ------------------------------------------------------------------ */
/* Prompt Card (suggested prompt pill)                                  */
/* ------------------------------------------------------------------ */
function As_PromptCard({
  text,
  onClick
}) {
  return <button onClick={() => onClick(text)} className="icon-btn flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium text-left w-full" style={{
    border: `1px solid ${C.border}`,
    background: C.card,
    color: C.text
  }}>
      <Sparkles size={12} color={C.faint} strokeWidth={1.75} className="shrink-0" />
      <span className="truncate">{text}</span>
    </button>;
}

/* ------------------------------------------------------------------ */
/* AI Insight Card                                                      */
/* ------------------------------------------------------------------ */
function As_AIInsightCard({
  insight,
  onApply,
  applied,
  delay
}) {
  const Icon = insight.icon;
  return <Card className="p-4" delay={delay}>
      <div className="flex items-start gap-2.5 mb-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{
        background: C.cardMuted,
        border: `1px solid ${C.border}`
      }}>
          <Icon size={13} color={C.text} strokeWidth={1.75} />
        </div>
        <div className="text-[12.5px] font-semibold pt-0.5" style={{
        color: C.text
      }}>
          {insight.title}
        </div>
      </div>
      <p className="text-[11.5px] leading-relaxed mb-3" style={{
      color: C.sub
    }}>
        {insight.text}
      </p>
      <button onClick={() => onApply(insight.id)} disabled={applied} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium self-start transition-all duration-150 ${!applied ? "glitter-sm" : ""}`} style={{
      background: applied ? "transparent" : C.glossDark,
      color: applied ? C.faint : C.onInk,
      border: applied ? `1px solid ${C.divider}` : "1px solid transparent"
    }}>
        {applied ? "Applied" : insight.action}
      </button>
    </Card>;
}

/* ------------------------------------------------------------------ */
/* Message Bubble                                                       */
/* ------------------------------------------------------------------ */
function As_MessageBubble({
  message,
  onCopy,
  onRegenerate,
  onLike,
  onDislike,
  isLast
}) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    onCopy(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return <div className={`flex items-start gap-2.5 group ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 glitter-sm mt-0.5" style={{
      background: C.glossDark
    }}>
          <Sparkles size={12} color={C.onInk} strokeWidth={1.75} />
        </div>}
      <div className={`flex flex-col max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        <div className="px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap" style={isUser ? {
        background: C.glossDark,
        color: C.onInk,
        borderRadius: "14px 14px 3px 14px",
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), ${C.shadow}`
      } : {
        background: C.card,
        color: C.text,
        border: `1px solid ${C.border}`,
        borderRadius: "14px 14px 14px 3px",
        boxShadow: C.shadow
      }}>
          {message.text}
        </div>

        <div className="flex items-center gap-2 mt-1.5 px-0.5">
          <span className="text-[10.5px]" style={{
          color: C.faint
        }}>
            {message.time}
          </span>

          {!isUser && <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <button onClick={handleCopy} className="icon-btn w-6 h-6 rounded-md flex items-center justify-center" style={{
            color: copied ? C.text : C.faint
          }} aria-label="Copy response" title="Copy">
                <Copy size={11.5} strokeWidth={1.75} />
              </button>
              {isLast && <button onClick={() => onRegenerate(message.id)} className="icon-btn w-6 h-6 rounded-md flex items-center justify-center" style={{
            color: C.faint
          }} aria-label="Regenerate response" title="Regenerate">
                  <RotateCcw size={11.5} strokeWidth={1.75} />
                </button>}
              <button onClick={() => onLike(message.id)} className="icon-btn w-6 h-6 rounded-md flex items-center justify-center" style={{
            color: message.liked ? C.text : C.faint
          }} aria-label="Like response" title="Like">
                <ThumbsUp size={11.5} strokeWidth={1.75} fill={message.liked ? C.text : "none"} />
              </button>
              <button onClick={() => onDislike(message.id)} className="icon-btn w-6 h-6 rounded-md flex items-center justify-center" style={{
            color: message.disliked ? C.text : C.faint
          }} aria-label="Dislike response" title="Dislike">
                <ThumbsDown size={11.5} strokeWidth={1.75} fill={message.disliked ? C.text : "none"} />
              </button>
            </div>}
        </div>
      </div>
    </div>;
}
function As_TypingBubble() {
  return <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 glitter-sm mt-0.5" style={{
      background: C.glossDark
    }}>
        <Sparkles size={12} color={C.onInk} strokeWidth={1.75} />
      </div>
      <div className="px-4 py-3 flex items-center gap-1.5" style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: "14px 14px 14px 3px",
      boxShadow: C.shadow
    }}>
        <span className="typing-dot" style={{
        background: C.faint
      }} />
        <span className="typing-dot" style={{
        background: C.faint,
        animationDelay: "0.15s"
      }} />
        <span className="typing-dot" style={{
        background: C.faint,
        animationDelay: "0.3s"
      }} />
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Input Box                                                            */
/* ------------------------------------------------------------------ */
function As_InputBox({
  value,
  onChange,
  onSend,
  disabled
}) {
  const [attachment, setAttachment] = useState(null);
  const [recording, setRecording] = useState(false);
  const fileRef = useRef(null);
  const textRef = useRef(null);
  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.style.height = "auto";
    textRef.current.style.height = Math.min(textRef.current.scrollHeight, 140) + "px";
  }, [value]);
  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && (value.trim() || attachment)) {
        onSend();
        setAttachment(null);
      }
    }
  };
  return <div className="p-3" style={{
    borderTop: `1px solid ${C.borderSoft}`
  }}>
      {attachment && <div className="flex items-center gap-2 mb-2 px-2.5 py-1.5 rounded-lg w-fit" style={{
      background: C.cardMuted,
      border: `1px solid ${C.border}`
    }}>
          <Paperclip size={11} color={C.sub} />
          <span className="text-[11.5px]" style={{
        color: C.text
      }}>
            {attachment}
          </span>
          <button onClick={() => setAttachment(null)} style={{
        color: C.faint
      }} aria-label="Remove attachment">
            <X size={11} />
          </button>
        </div>}
      <div className="flex items-end gap-2 px-3 py-2 rounded-xl" style={{
      border: `1px solid ${C.border}`,
      background: C.card,
      boxShadow: C.shadow
    }}>
        <input ref={fileRef} type="file" className="hidden" onChange={e => {
        if (e.target.files && e.target.files[0]) setAttachment(e.target.files[0].name);
      }} />
        <button onClick={() => fileRef.current && fileRef.current.click()} className="icon-btn w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mb-0.5" style={{
        color: C.faint
      }} aria-label="Attach file" title="Attach file">
          <Paperclip size={15} strokeWidth={1.75} />
        </button>

        <textarea ref={textRef} value={value} onChange={e => onChange(e.target.value)} onKeyDown={handleKeyDown} rows={1} placeholder="Ask Cortex anything\u2026" className="flex-1 text-[13.5px] outline-none bg-transparent resize-none py-1 min-w-0" style={{
        color: C.text,
        maxHeight: 140
      }} />

        <button onClick={() => setRecording(r => !r)} className="icon-btn w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mb-0.5 relative" style={{
        color: recording ? C.text : C.faint,
        background: recording ? C.cardMuted : "transparent"
      }} aria-label="Voice input" title="Voice input">
          {recording && <span className="pulse-ping absolute inline-flex h-full w-full rounded-lg" style={{
          background: "rgba(13,13,12,0.18)"
        }} />}
          <Mic size={15} strokeWidth={1.75} className="relative" />
        </button>

        <button onClick={() => {
        onSend();
        setAttachment(null);
      }} disabled={disabled || !value.trim() && !attachment} className="glossy-btn glitter-sm w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mb-0.5 transition-transform duration-150 disabled:opacity-40" style={{
        background: C.glossDark,
        color: C.onInk,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`
      }} aria-label="Send message">
          <SendHorizontal size={14} strokeWidth={2} />
        </button>
      </div>
      <p className="text-[10.5px] mt-1.5 px-1" style={{
      color: C.faint
    }}>
        Cortex can make mistakes. Review important suggestions before acting on them.
      </p>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Chat Window                                                          */
/* ------------------------------------------------------------------ */
function As_ChatWindow({
  conversationTitle,
  messages,
  isTyping,
  input,
  onInputChange,
  onSend,
  onCopy,
  onRegenerate,
  onLike,
  onDislike,
  onDeleteConversation,
  onQuickAction,
  onPrompt,
  hasActiveConversation
}) {
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);
  const lastAssistantId = useMemo(() => {
    const assistants = messages.filter(m => m.role === "assistant");
    return assistants.length ? assistants[assistants.length - 1].id : null;
  }, [messages]);
  return <Card className="flex-1 flex flex-col min-h-[560px]" delay={40}>
      <div className="flex items-center justify-between gap-3 px-4 py-3" style={{
      borderBottom: `1px solid ${C.borderSoft}`
    }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 glitter-sm" style={{
          background: C.glossDark
        }}>
            <Sparkles size={13} color={C.onInk} strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <div className="text-[13.5px] font-semibold truncate" style={{
            color: C.text
          }}>
              {conversationTitle}
            </div>
            <div className="text-[11px]" style={{
            color: C.faint
          }}>
              Your personal productivity companion
            </div>
          </div>
        </div>
        {hasActiveConversation && <button onClick={onDeleteConversation} className="icon-btn w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{
        border: `1px solid ${C.border}`,
        color: C.sub
      }} aria-label="Delete conversation" title="Delete conversation">
            <Trash2 size={14} strokeWidth={1.75} />
          </button>}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 chat-scroll">
        {messages.length === 0 ? <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 glitter-sm" style={{
          background: C.glossDark
        }}>
              <Sparkles size={20} color={C.onInk} strokeWidth={1.75} />
            </div>
            <h3 className="text-[16px] font-semibold mb-1.5" style={{
          color: C.text
        }}>
              How can I help you today?
            </h3>
            <p className="text-[12.5px] mb-5 max-w-[360px]" style={{
          color: C.sub
        }}>
              Ask about your tasks, goals, or schedule \u2014 or try one of the quick actions above.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-[460px] w-full">
              {As_suggestedPrompts.slice(0, 4).map(p => <As_PromptCard key={p} text={p} onClick={onPrompt} />)}
            </div>
          </div> : messages.map(m => <As_MessageBubble key={m.id} message={m} onCopy={onCopy} onRegenerate={onRegenerate} onLike={onLike} onDislike={onDislike} isLast={m.id === lastAssistantId} />)}
        {isTyping && <As_TypingBubble />}
      </div>

      <As_InputBox value={input} onChange={onInputChange} onSend={onSend} disabled={isTyping} />
    </Card>;
}

/* ------------------------------------------------------------------ */
/* AI Context panel                                                     */
/* ------------------------------------------------------------------ */
function As_ContextSection({
  icon: Icon,
  label,
  children,
  delay
}) {
  return <div className="fade-up" style={{
    animationDelay: `${delay}ms`
  }}>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon size={12.5} color={C.faint} strokeWidth={1.75} />
        <span className="text-[11px] font-semibold uppercase tracking-wide" style={{
        color: C.faint
      }}>
          {label}
        </span>
      </div>
      {children}
    </div>;
}
function As_AIContextPanel({ tasks, goals, events, habits, activity }) {
  return <Card className="p-4" delay={60}>
      <h2 className="text-[14px] font-semibold mb-4" style={{
      color: C.text
    }}>
        AI Context
      </h2>
      <div className="flex flex-col gap-5">
        <As_ContextSection icon={CheckSquare} label="Today's Tasks" delay={70}>
          <div className="flex flex-col gap-2">
            {tasks.length === 0 && <p className="text-[11.5px]" style={{ color: C.faint }}>No tasks for today.</p>}
            {tasks.map(t => <div key={t.title} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{
              background: t.priority === "High" ? C.ink : t.priority === "Medium" ? C.sub : C.divider
            }} />
                <span className="text-[12px] flex-1 truncate" style={{
              color: C.text
            }}>
                  {t.title}
                </span>
                <span className="text-[10.5px] shrink-0" style={{
              color: C.faint
            }}>
                  {t.time}
                </span>
              </div>)}
          </div>
        </As_ContextSection>

        <As_ContextSection icon={Target} label="Active Goals" delay={90}>
          <div className="flex flex-col gap-2.5">
            {goals.length === 0 && <p className="text-[11.5px]" style={{ color: C.faint }}>No active goals.</p>}
            {goals.map(g => <div key={g.title}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px]" style={{
                color: C.text
              }}>
                    {g.title}
                  </span>
                  <span className="text-[10.5px]" style={{
                color: C.faint
              }}>
                    {g.progress}%
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{
              background: C.borderSoft
            }}>
                  <div className="h-full rounded-full" style={{
                width: `${g.progress}%`,
                background: C.glossDark
              }} />
                </div>
              </div>)}
          </div>
        </As_ContextSection>

        <As_ContextSection icon={CalendarClock} label="Upcoming Events" delay={110}>
          <div className="flex flex-col gap-2">
            {events.length === 0 && <p className="text-[11.5px]" style={{ color: C.faint }}>Nothing scheduled today.</p>}
            {events.map(e => <div key={e.title} className="flex items-center justify-between gap-2">
                <span className="text-[12px] truncate" style={{
              color: C.text
            }}>
                  {e.title}
                </span>
                <span className="text-[10.5px] shrink-0" style={{
              color: C.faint
            }}>
                  {e.time}
                </span>
              </div>)}
          </div>
        </As_ContextSection>

        <As_ContextSection icon={Flame} label="Habit Progress" delay={130}>
          <div className="flex flex-col gap-2">
            {habits.length === 0 && <p className="text-[11.5px]" style={{ color: C.faint }}>No habits tracked yet.</p>}
            {habits.map(h => <div key={h.name} className="flex items-center justify-between gap-2">
                <span className="text-[12px] truncate" style={{
              color: C.text
            }}>
                  {h.name}
                </span>
                <span className="text-[10.5px] shrink-0" style={{
              color: h.streak === 0 ? C.faint : C.sub
            }}>
                  {h.streak}/{h.target} days
                </span>
              </div>)}
          </div>
        </As_ContextSection>

        <As_ContextSection icon={Activity} label="Recent Activity" delay={150}>
          <div className="flex flex-col gap-2">
            {activity.length === 0 && <p className="text-[11.5px]" style={{ color: C.faint }}>Nothing completed yet.</p>}
            {activity.map((a, i) => <div key={i} className="flex items-start justify-between gap-2">
                <span className="text-[11.5px] leading-snug" style={{
              color: C.sub
            }}>
                  {a.text}
                </span>
                <span className="text-[10px] shrink-0 whitespace-nowrap" style={{
              color: C.faint
            }}>
                  {a.time}
                </span>
              </div>)}
          </div>
        </As_ContextSection>
      </div>
    </Card>;
}

/* ------------------------------------------------------------------ */
/* AI Insights panel                                                    */
/* ------------------------------------------------------------------ */
function As_AIInsightsPanel({
  insights,
  appliedIds,
  onApply
}) {
  return <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-0.5 fade-up" style={{
      animationDelay: "170ms"
    }}>
        <span className="relative flex h-2 w-2">
          <span className="pulse-ping absolute inline-flex h-full w-full rounded-full" style={{
          background: "rgba(13,13,12,0.35)"
        }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{
          background: C.ink
        }} />
        </span>
        <h2 className="text-[14px] font-semibold" style={{
        color: C.text
      }}>
          AI Insights
        </h2>
      </div>
      {insights.length === 0 && <p className="text-[12px] px-0.5" style={{ color: C.faint }}>Nothing to flag right now — check back later.</p>}
      {insights.map((ins, i) => <As_AIInsightCard key={ins.id} insight={{ ...ins, icon: Sparkles, text: ins.body, action: "Apply" }} onApply={onApply} applied={appliedIds.includes(ins.id)} delay={190 + i * 30} />)}
    </div>;
}

/* ------------------------------------------------------------------ */
/* Header                                                               */
/* ------------------------------------------------------------------ */
function As_AIAssistantHeader({
  search,
  onSearch,
  onNewChat
}) {
  return <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-7 fade-up" style={{
    animationDelay: "20ms"
  }}>
      <div>
        <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-tight leading-tight" style={{
        color: C.text
      }}>
          <span className="font-display text-[38px] sm:text-[44px] font-normal align-middle">AI Assistant</span>
        </h1>
        <p className="text-[13.5px] mt-1" style={{
        color: C.sub
      }}>
          Your intelligent productivity companion
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg w-full sm:w-[260px]" style={{
        border: `1px solid ${C.border}`,
        background: C.card,
        boxShadow: C.shadow
      }}>
          <Search size={14} color={C.faint} strokeWidth={1.75} className="shrink-0" />
          <input type="text" value={search} onChange={e => onSearch(e.target.value)} placeholder="Search conversations\u2026" className="flex-1 text-[13px] outline-none bg-transparent min-w-0" style={{
          color: C.text
        }} />
          {search && <button onClick={() => onSearch("")} className="icon-btn w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{
          color: C.faint
        }} aria-label="Clear search">
              <X size={12} />
            </button>}
        </div>
        <button onClick={onNewChat} className="glossy-btn glitter-sm flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13.5px] font-medium shrink-0 transition-transform duration-150 hover:-translate-y-0.5" style={{
        background: C.glossDark,
        color: C.onInk,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`
      }}>
          <Plus size={15} strokeWidth={2} />
          New Chat
        </button>
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Quick AI Actions row                                                 */
/* ------------------------------------------------------------------ */
function As_QuickActionsRow({
  onAction
}) {
  return <div className="mb-6 lg:mb-7">
      <h2 className="text-[13px] font-semibold mb-3 fade-up" style={{
      color: C.text,
      animationDelay: "40ms"
    }}>
        Quick AI Actions
      </h2>
      <div className="grid grid-flow-col auto-cols-[190px] sm:auto-cols-fr sm:grid-flow-row sm:grid-cols-4 xl:grid-cols-8 gap-3 overflow-x-auto pb-1">
        {As_quickActions.map((a, i) => <As_AIActionCard key={a.id} action={a} onClick={onAction} delay={50 + i * 20} />)}
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Main AI Assistant page content                                      */
/* ------------------------------------------------------------------ */
export function AIAssistantBody() {
  const {
    conversations,
    activeId,
    activeConversation,
    setActiveId,
    startNewConversation,
    send,
    sending,
    error,
    insights,
  } = useAiAssistant();
  const { tasks } = useTasks();
  const { goals } = useGoals();
  const { habits } = useHabits();
  const { data } = useDashboard();

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [appliedInsights, setAppliedInsights] = useState([]);
  const [likes, setLikes] = useState({}); // { [messageId]: "liked" | "disliked" }

  const messages = (activeConversation?.messages || []).map(m => ({
    ...m,
    liked: likes[m.id] === "liked",
    disliked: likes[m.id] === "disliked"
  }));
  const conversationTitle = activeConversation ? activeConversation.title : "New chat";

  const todaysTasksCtx = useMemo(() => tasks.filter(t => t.date === "Today").map(t => ({ title: t.title, time: t.time, priority: t.priority })), [tasks]);
  const activeGoalsCtx = useMemo(() => goals.filter(g => !g.archived && g.status === "Active").map(g => ({ title: g.title, progress: g.progress })), [goals]);
  const upcomingEventsCtx = data?.schedule?.map(s => ({ title: s.title, time: s.time })) || [];
  const habitProgressCtx = useMemo(() => habits.map(h => ({
    name: h.name,
    streak: (h.week || []).filter(Boolean).length,
    target: (h.week || []).length || 7
  })), [habits]);
  const recentActivityCtx = useMemo(() => {
    const fromTasks = tasks.filter(t => t.done).map(t => ({ text: `Completed '${t.title}'`, time: t.date }));
    const fromHabits = habits.filter(h => h.doneToday).map(h => ({ text: `Logged ${h.name} habit`, time: "Today" }));
    return [...fromTasks, ...fromHabits].slice(0, 5);
  }, [tasks, habits]);

  function startNewChat() {
    startNewConversation();
    setInput("");
  }
  function selectConversation(id) {
    setActiveId(id);
    setInput("");
  }
  function deleteConversation() {
    if (activeId != null) {
      // Local-only conversation grouping — just drop it from view.
      setActiveId(null);
    }
  }
  function submit(text) {
    if (!text.trim() || sending) return;
    send(text);
    setInput("");
  }
  function handleSend() {
    submit(input);
  }
  function handleQuickAction(action) {
    submit(action.prompt);
  }
  function handlePrompt(text) {
    submit(text);
  }
  function handleCopy(text) {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
  }
  function handleRegenerate(messageId) {
    const priorUserMsg = [...messages].reverse().find(m => m.role === "user");
    if (priorUserMsg) submit(priorUserMsg.text);
  }
  function handleLike(messageId) {
    setLikes(prev => ({ ...prev, [messageId]: prev[messageId] === "liked" ? null : "liked" }));
  }
  function handleDislike(messageId) {
    setLikes(prev => ({ ...prev, [messageId]: prev[messageId] === "disliked" ? null : "disliked" }));
  }
  function handleApplyInsight(id) {
    setAppliedInsights(prev => [...prev, id]);
  }
  return <>
      <As_AIAssistantHeader search={search} onSearch={setSearch} onNewChat={startNewChat} />
      <As_QuickActionsRow onAction={handleQuickAction} />

      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr_300px] gap-5 items-start">
        {/* Left: Recent Conversations + Suggested Prompts */}
        <div className="order-2 xl:order-1 flex flex-col gap-5">
          <Card className="p-4" delay={60}>
            <h2 className="text-[13px] font-semibold mb-3" style={{
            color: C.text
          }}>
              Recent Conversations
            </h2>
            <As_ConversationList conversations={conversations} activeId={activeId} onSelect={selectConversation} search={search} />
          </Card>

          <Card className="p-4" delay={80}>
            <h2 className="text-[13px] font-semibold mb-3" style={{
            color: C.text
          }}>
              Suggested Prompts
            </h2>
            <div className="flex flex-col gap-2">
              {As_suggestedPrompts.map(p => <As_PromptCard key={p} text={p} onClick={handlePrompt} />)}
            </div>
          </Card>
        </div>

        {/* Center: Chat */}
        <div className="order-1 xl:order-2 flex flex-col">
          {error && <div className="mb-3 text-[12.5px] px-1" style={{ color: C.warn }}>{error}</div>}
          <As_ChatWindow conversationTitle={conversationTitle} messages={messages} isTyping={sending} input={input} onInputChange={setInput} onSend={handleSend} onCopy={handleCopy} onRegenerate={handleRegenerate} onLike={handleLike} onDislike={handleDislike} onDeleteConversation={deleteConversation} onQuickAction={handleQuickAction} onPrompt={handlePrompt} hasActiveConversation={activeId != null} />
        </div>

        {/* Right: AI Context + AI Insights */}
        <div className="order-3 flex flex-col gap-5">
          <As_AIContextPanel tasks={todaysTasksCtx} goals={activeGoalsCtx} events={upcomingEventsCtx} habits={habitProgressCtx} activity={recentActivityCtx} />
          <As_AIInsightsPanel insights={insights} appliedIds={appliedInsights} onApply={handleApplyInsight} />
        </div>
      </div>
    </>;
}

/* ------------------------------------------------------------------ */
/* Page shell                                                           */
/* ------------------------------------------------------------------ */

export default AIAssistantBody;
