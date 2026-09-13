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
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import { useNotifications } from "@/hooks/useNotifications";
import { useTasks } from "@/hooks/useTasks";
import { useHabits } from "@/hooks/useHabits";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { getInsights } from "@/services/ai.service";

/* ==================================================================== */
/* Notifications                                                          */
/* ==================================================================== */

/* ------------------------------------------------------------------ */
/* Mock data — shaped like the real Cortex NotificationResponse schema  */
/* ------------------------------------------------------------------ */
const No_CATEGORY_META = {
  "AI Assistant": {
    icon: MessageSquare,
    color: "#5B4B8A"
  },
  Tasks: {
    icon: CheckSquare,
    color: "#2F6F63"
  },
  Goals: {
    icon: Target,
    color: "#B3492B"
  },
  Calendar: {
    icon: CalendarDays,
    color: "#2D6A8F"
  },
  Habits: {
    icon: Flame,
    color: "#A15C1F"
  },
  Planner: {
    icon: ClipboardList,
    color: "#4A5A73"
  },
  Achievements: {
    icon: Award,
    color: "#8A6A1E"
  },
  Reminders: {
    icon: Bell,
    color: "#63635F"
  },
  "System Updates": {
    icon: Settings,
    color: "#5A5A56"
  }
};
/* ------------------------------------------------------------------ */
/* Notification, reminder, highlight, and activity data now come from  */
/* real hooks (useNotifications, useTasks, useHabits,                  */
/* useCalendarEvents, ai.service) instead of fixed mock arrays.        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Small shared building blocks                                        */
/* ------------------------------------------------------------------ */

function No_PriorityBadge({
  priority
}) {
  const styles = {
    High: {
      border: `1px solid ${C.ink}`,
      color: C.onInk,
      background: C.ink
    },
    Medium: {
      border: `1px solid ${C.divider}`,
      color: C.sub,
      background: C.cardMuted
    },
    Low: {
      border: `1px solid ${C.borderSoft}`,
      color: C.faint,
      background: "transparent"
    }
  };
  return <span className={`text-[10.5px] font-medium px-2 py-0.5 rounded-full tracking-wide inline-block shrink-0 ${priority === "High" ? "glitter-sm" : ""}`} style={styles[priority]}>
      {priority}
    </span>;
}
function No_IconBtn({
  icon: Icon,
  label,
  onClick,
  active = false,
  size = 13.5
}) {
  return <button onClick={onClick} title={label} aria-label={label} className="icon-btn w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{
    color: active ? C.onInk : C.faint,
    background: active ? C.ink : "transparent",
    border: `1px solid ${active ? C.ink : "transparent"}`
  }} onMouseEnter={e => {
    if (!active) {
      e.currentTarget.style.background = C.cardMuted;
      e.currentTarget.style.color = C.text;
    }
  }} onMouseLeave={e => {
    if (!active) {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = C.faint;
    }
  }}>
      <Icon size={size} strokeWidth={1.75} />
    </button>;
}
function No_PillButton({
  icon: Icon,
  children,
  onClick,
  tone = "default",
  small = false
}) {
  const tones = {
    default: {
      background: C.card,
      color: C.text,
      border: `1px solid ${C.border}`
    },
    dark: {
      background: C.ink,
      color: C.onInk,
      border: `1px solid ${C.ink}`
    },
    ghost: {
      background: "transparent",
      color: C.sub,
      border: `1px solid ${C.border}`
    }
  };
  return <button onClick={onClick} className={`icon-btn flex items-center gap-1.5 rounded-lg font-medium shrink-0 ${small ? "px-2.5 py-1.5 text-[12px]" : "px-3.5 py-2 text-[13px]"}`} style={{
    ...tones[tone],
    boxShadow: tone === "dark" ? "none" : C.shadow
  }}>
      {Icon && <Icon size={small ? 13 : 14} strokeWidth={1.75} />}
      {children}
    </button>;
}

/* ------------------------------------------------------------------ */
/* Sidebar — deepest ink shade, anchors the light canvas                */
/* ------------------------------------------------------------------ */

/* ==================================================================== */
/* NOTIFICATIONS PAGE — sections below                                  */
/* ==================================================================== */

/* ---- SearchBar (reusable) ---- */
function No_SearchBar({
  value,
  onChange,
  placeholder = "Search notifications\u2026",
  className = ""
}) {
  return <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg ${className}`} style={{
    border: `1px solid ${C.border}`,
    background: C.card,
    boxShadow: C.shadow
  }}>
      <Search size={15} color={C.faint} strokeWidth={1.75} className="shrink-0" />
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="flex-1 text-[13.5px] outline-none bg-transparent min-w-0" style={{
      color: C.text
    }} />
      {value && <button onClick={() => onChange("")} className="icon-btn w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{
      color: C.faint
    }} aria-label="Clear search">
          <X size={13} />
        </button>}
    </div>;
}

/* ---- Header ---- */
function No_NotificationsHeader({
  search,
  setSearch,
  unreadCount,
  onMarkAllRead,
  onOpenSettings,
  settingsOpen
}) {
  return <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative">
      <div>
        <h1 className="font-display text-[36px] sm:text-[42px] font-normal leading-none" style={{
        color: C.text
      }}>
          Notifications
        </h1>
        <p className="text-[13px] mt-1.5" style={{
        color: C.faint
      }}>
          {unreadCount} unread \u00b7 everything from across Cortex, in one place
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <No_SearchBar value={search} onChange={setSearch} className="w-full sm:w-[230px]" />
        <No_PillButton icon={CheckCheck} onClick={onMarkAllRead}>
          Mark All as Read
        </No_PillButton>
        <div className="relative">
          <No_PillButton icon={SlidersHorizontal} onClick={onOpenSettings} tone={settingsOpen ? "dark" : "default"}>
            Notification Settings
          </No_PillButton>
          {settingsOpen && <No_SettingsPanel />}
        </div>
      </div>
    </div>;
}
const NO_PREFS_STORAGE_KEY = "cortex_notification_prefs";
const NO_DEFAULT_PREFS = {
  email: true,
  push: true,
  desktop: false,
  sound: true,
  mentionsOnly: false
};
function No_SettingsPanel() {
  const [prefs, setPrefs] = useState(NO_DEFAULT_PREFS);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(NO_PREFS_STORAGE_KEY);
      if (saved) setPrefs({ ...NO_DEFAULT_PREFS, ...JSON.parse(saved) });
    } catch {
      /* fall back to defaults */
    }
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem(NO_PREFS_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore persistence errors */
    }
  }, [prefs]);
  const toggle = key => setPrefs(p => ({
    ...p,
    [key]: !p[key]
  }));
  const rows = [{
    key: "email",
    label: "Email notifications"
  }, {
    key: "push",
    label: "Push notifications"
  }, {
    key: "desktop",
    label: "Desktop alerts"
  }, {
    key: "sound",
    label: "Notification sound"
  }, {
    key: "mentionsOnly",
    label: "Only notify me for mentions"
  }];
  return <div className="panel-drop absolute right-0 top-[calc(100%+8px)] z-30 w-[260px] rounded-xl p-3.5" style={{
    background: C.glossCard,
    border: `1px solid ${C.border}`,
    boxShadow: C.shadowLift
  }}>
      <div className="text-[12px] font-semibold mb-2.5" style={{
      color: C.text
    }}>
        Notification preferences
      </div>
      <div className="flex flex-col gap-2">
        {rows.map(r => <label key={r.key} className="flex items-center justify-between gap-3 cursor-pointer py-0.5">
            <span className="text-[12.5px]" style={{
          color: C.sub
        }}>
              {r.label}
            </span>
            <button onClick={() => toggle(r.key)} className="relative shrink-0 rounded-full transition-colors" style={{
          width: 32,
          height: 18,
          background: prefs[r.key] ? C.ink : C.cardMuted,
          border: `1px solid ${prefs[r.key] ? C.ink : C.border}`
        }} aria-label={r.label}>
              <span className="absolute top-[1.5px] rounded-full transition-all" style={{
            width: 13,
            height: 13,
            left: prefs[r.key] ? 16 : 2,
            background: prefs[r.key] ? C.onInk : C.faint
          }} />
            </button>
          </label>)}
      </div>
    </div>;
}

/* ---- Filter tabs ---- */
function No_FilterTabs({
  active,
  onChange,
  counts
}) {
  const filters = [{
    key: "all",
    label: "All"
  }, {
    key: "unread",
    label: "Unread"
  }, {
    key: "today",
    label: "Today"
  }, {
    key: "week",
    label: "This Week"
  }, {
    key: "mentions",
    label: "Mentions"
  }, {
    key: "high",
    label: "High Priority"
  }];
  return <div className="flex flex-wrap items-center gap-2 mb-5">
      {filters.map(f => {
      const isActive = active === f.key;
      return <button key={f.key} onClick={() => onChange(f.key)} className="icon-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-medium" style={{
        background: isActive ? C.ink : C.card,
        color: isActive ? C.onInk : C.sub,
        border: `1px solid ${isActive ? C.ink : C.border}`,
        boxShadow: isActive ? "none" : C.shadow
      }}>
            {f.label}
            <span className="text-[10.5px] font-semibold px-1.5 rounded-full" style={{
          background: isActive ? "rgba(244,244,242,0.18)" : C.cardMuted,
          color: isActive ? C.onInk : C.faint
        }}>
              {counts[f.key] ?? 0}
            </span>
          </button>;
    })}
    </div>;
}

/* ---- Notification card ---- */
function No_NotificationCard({
  n,
  onMarkRead,
  onMarkUnread,
  onDelete,
  onArchive,
  onPin,
  onSnooze,
  delay = 0
}) {
  const meta = No_CATEGORY_META[n.category] || {
    icon: Bell,
    color: C.sub
  };
  const Icon = meta.icon;
  return <Card delay={delay} className="p-0">
      <div className="flex items-start gap-3 p-3.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 relative" style={{
        background: C.cardMuted,
        border: `1px solid ${C.border}`
      }}>
          <Icon size={16} strokeWidth={1.75} color={meta.color} />
          {!n.read && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full" style={{
          background: C.ink,
          border: `2px solid ${C.card}`
        }} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
              {n.pinned && <Pin size={11} strokeWidth={2} color={C.faint} className="shrink-0" />}
              <span className="text-[13.5px] truncate" style={{
              color: C.text,
              fontWeight: n.read ? 500 : 600
            }}>
                {n.title}
              </span>
              {n.mention && <span className="flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0" style={{
              background: C.cardMuted,
              color: C.sub,
              border: `1px solid ${C.border}`
            }}>
                  <AtSign size={9} strokeWidth={2} /> mention
                </span>}
            </div>
            <span className="text-[11.5px] shrink-0" style={{
            color: C.faint
          }}>
              {n.time}
            </span>
          </div>
          <p className="text-[12.5px] mt-0.5 leading-snug" style={{
          color: C.sub
        }}>
            {n.description}
          </p>

          <div className="flex items-center justify-between gap-3 mt-2.5">
            <div className="flex items-center gap-2">
              <No_PriorityBadge priority={n.priority} />
              <span className="text-[11px]" style={{
              color: C.faint
            }}>
                {n.category}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              {n.read ? <No_IconBtn icon={Mail} label="Mark as unread" onClick={() => onMarkUnread(n.id)} /> : <No_IconBtn icon={MailOpen} label="Mark as read" onClick={() => onMarkRead(n.id)} />}
              <No_IconBtn icon={n.pinned ? PinOff : Pin} label={n.pinned ? "Unpin" : "Pin"} onClick={() => onPin(n.id)} active={n.pinned} />
              <No_IconBtn icon={Hourglass} label="Snooze" onClick={() => onSnooze(n.id)} />
              <No_IconBtn icon={Archive} label="Archive" onClick={() => onArchive(n.id)} />
              <No_IconBtn icon={Trash2} label="Delete" onClick={() => onDelete(n.id)} />
            </div>
          </div>
        </div>
      </div>
    </Card>;
}

/* ---- Collapsible category section ---- */
function No_CategorySection({
  category,
  items,
  expanded,
  onToggle,
  cardHandlers
}) {
  const meta = No_CATEGORY_META[category] || {
    icon: Bell,
    color: C.sub
  };
  const Icon = meta.icon;
  const unread = items.filter(i => !i.read).length;
  return <div className="mb-2.5">
      <button onClick={() => onToggle(category)} className="icon-btn w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl" style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      boxShadow: C.shadow
    }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{
          background: C.cardMuted,
          border: `1px solid ${C.border}`
        }}>
            <Icon size={14} strokeWidth={1.75} color={meta.color} />
          </div>
          <span className="text-[13px] font-medium truncate" style={{
          color: C.text
        }}>
            {category}
          </span>
          <span className="text-[10.5px] font-semibold px-1.5 rounded-full shrink-0" style={{
          background: C.cardMuted,
          color: C.faint
        }}>
            {items.length}
          </span>
          {unread > 0 && <span className="text-[10.5px] font-semibold px-1.5 rounded-full shrink-0" style={{
          background: C.ink,
          color: C.onInk
        }}>
              {unread} new
            </span>}
        </div>
        {expanded ? <ChevronDown size={15} color={C.faint} strokeWidth={1.75} /> : <ChevronRight size={15} color={C.faint} strokeWidth={1.75} />}
      </button>
      {expanded && <div className="flex flex-col gap-2 mt-2 pl-1">
          {items.map((n, i) => <No_NotificationCard key={n.id} n={n} delay={i * 30} {...cardHandlers} />)}
        </div>}
    </div>;
}

/* ---- AI Highlight card ---- */
function No_AIHighlightCard({
  item,
  onViewDetails,
  onPrioritize,
  delay = 0
}) {
  const Icon = item.icon;
  return <Card delay={delay} className="p-4 min-w-[260px] max-w-[260px] shrink-0">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center glitter-sm" style={{
        background: C.glossDark
      }}>
          <Icon size={14.5} strokeWidth={1.75} color={C.onInk} />
        </div>
        <span className="text-[10.5px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{
        background: C.cardMuted,
        color: C.sub
      }}>
          {item.tag}
        </span>
      </div>
      <div className="text-[13.5px] font-semibold mb-1" style={{
      color: C.text
    }}>
        {item.title}
      </div>
      <p className="text-[12px] leading-snug mb-3" style={{
      color: C.sub
    }}>
        {item.text}
      </p>
      <div className="flex items-center gap-2 mt-auto">
        <button onClick={() => onViewDetails(item)} className="icon-btn text-[12px] font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1" style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        color: C.text
      }}>
          View Details <ArrowRight size={11} />
        </button>
        <button onClick={() => onPrioritize(item)} className="icon-btn text-[12px] font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1" style={{
        background: C.ink,
        color: C.onInk
      }}>
          <Wand2 size={11} /> Let AI Prioritize
        </button>
      </div>
    </Card>;
}

/* ---- Reminder card ---- */
function No_ReminderCard({
  reminder,
  onSnooze,
  onComplete,
  delay = 0
}) {
  const Icon = reminder.icon;
  const priorityColor = reminder.priority === "High" ? C.high : reminder.priority === "Medium" ? C.med : C.low;
  return <Card delay={delay} className="p-3.5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{
        background: C.cardMuted,
        border: `1px solid ${C.border}`
      }}>
          <Icon size={15.5} strokeWidth={1.75} color={C.sub} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10.5px] font-semibold uppercase tracking-wide" style={{
            color: C.faint
          }}>
              {reminder.type}
            </span>
            <No_PriorityBadge priority={reminder.priority} />
          </div>
          <div className="text-[13.5px] font-medium mt-0.5 truncate" style={{
          color: C.text
        }}>
            {reminder.title}
          </div>
          <div className="text-[12px] mt-0.5" style={{
          color: C.sub
        }}>
            {reminder.subtitle}
          </div>
          <div className="flex items-center justify-between gap-2 mt-2.5">
            <span className="text-[12px] font-medium flex items-center gap-1" style={{
            color: priorityColor
          }}>
              <Clock size={11.5} strokeWidth={2} />
              {reminder.snoozed ? "Snoozed" : reminder.remaining}
            </span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => onSnooze(reminder.id)} className="icon-btn text-[11.5px] font-medium px-2 py-1 rounded-md flex items-center gap-1" style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              color: C.sub
            }}>
                <Hourglass size={11} /> Snooze
              </button>
              <button onClick={() => onComplete(reminder.id)} className="icon-btn text-[11.5px] font-medium px-2 py-1 rounded-md flex items-center gap-1" style={{
              background: C.ink,
              color: C.onInk
            }}>
                <Check size={11} /> Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>;
}

/* ---- Activity timeline ---- */
function No_ActivityTimeline({
  items
}) {
  return <Card className="p-4">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-[14px] font-semibold" style={{
        color: C.text
      }}>
          Activity Timeline
        </h3>
        <RefreshCw size={13} color={C.faint} />
      </div>
      <div className="flex flex-col">
        {items.map((a, i) => {
        const Icon = a.icon;
        const isLast = i === items.length - 1;
        return <div key={a.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{
              background: C.cardMuted,
              border: `1px solid ${C.border}`
            }}>
                  <Icon size={12.5} strokeWidth={1.75} color={C.sub} />
                </div>
                {!isLast && <div className="w-px flex-1 my-1" style={{
              background: C.borderSoft
            }} />}
              </div>
              <div className={`pb-4 ${isLast ? "pb-0" : ""} min-w-0`}>
                <div className="text-[12.5px] leading-snug" style={{
              color: C.text
            }}>
                  {a.title}
                </div>
                <div className="text-[11px] mt-0.5" style={{
              color: C.faint
            }}>
                  {a.time}
                </div>
              </div>
            </div>;
      })}
      </div>
    </Card>;
}

/* ---- Statistics ---- */
function No_StatCard({
  icon: Icon,
  label,
  value,
  sub,
  delay = 0
}) {
  return <Card delay={delay} className="p-4">
      <div className="flex items-center justify-between mb-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
        background: C.cardMuted,
        border: `1px solid ${C.border}`
      }}>
          <Icon size={14.5} strokeWidth={1.75} color={C.sub} />
        </div>
      </div>
      <div className="font-display text-[30px] leading-none" style={{
      color: C.text
    }}>
        {value}
      </div>
      <div className="text-[12px] mt-1.5" style={{
      color: C.sub
    }}>
        {label}
      </div>
      {sub && <div className="text-[11px] mt-0.5" style={{
      color: C.faint
    }}>
          {sub}
        </div>}
    </Card>;
}

/* ---- History panel (archived / deleted) ---- */
function No_HistoryPanel({
  items,
  onRestore
}) {
  if (items.length === 0) {
    return <Card className="p-5 text-center">
        <History size={18} color={C.faint} className="mx-auto mb-2" />
        <p className="text-[12.5px]" style={{
        color: C.faint
      }}>
          Nothing archived or deleted yet.
        </p>
      </Card>;
  }
  return <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13.5px] font-semibold" style={{
        color: C.text
      }}>
          Notification History
        </h3>
        <span className="text-[11px]" style={{
        color: C.faint
      }}>
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map(n => <div key={n.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg" style={{
        background: C.cardMuted,
        border: `1px solid ${C.border}`
      }}>
            <div className="min-w-0">
              <div className="text-[12.5px] truncate" style={{
            color: C.text
          }}>
                {n.title}
              </div>
              <div className="text-[11px] mt-0.5" style={{
            color: C.faint
          }}>
                {n.archiveReason} \u00b7 {n.category}
              </div>
            </div>
            <No_IconBtn icon={ArchiveRestore} label="Restore" onClick={() => onRestore(n.id)} />
          </div>)}
      </div>
    </Card>;
}

/* ---- Quick actions ---- */
function No_QuickActions({
  onClearRead,
  onSnoozeAll,
  onToggleHistory,
  onExport,
  onCustomize,
  historyOpen,
  exported
}) {
  return <Card className="p-4">
      <h3 className="text-[13.5px] font-semibold mb-3" style={{
      color: C.text
    }}>
        Quick Actions
      </h3>
      <div className="flex flex-col gap-2">
        <button onClick={onClearRead} className="icon-btn flex items-center gap-2 text-[12.5px] font-medium px-3 py-2 rounded-lg" style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        color: C.text
      }}>
          <Trash2 size={13} /> Clear Read Notifications
        </button>
        <button onClick={onSnoozeAll} className="icon-btn flex items-center gap-2 text-[12.5px] font-medium px-3 py-2 rounded-lg" style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        color: C.text
      }}>
          <Hourglass size={13} /> Snooze All Reminders
        </button>
        <button onClick={onToggleHistory} className="icon-btn flex items-center gap-2 text-[12.5px] font-medium px-3 py-2 rounded-lg" style={{
        background: historyOpen ? C.ink : C.card,
        border: `1px solid ${historyOpen ? C.ink : C.border}`,
        color: historyOpen ? C.onInk : C.text
      }}>
          <History size={13} /> View Notification History
        </button>
        <button onClick={onExport} className="icon-btn flex items-center gap-2 text-[12.5px] font-medium px-3 py-2 rounded-lg" style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        color: C.text
      }}>
          {exported ? <Check size={13} /> : <Download size={13} />} {exported ? "Exported \u2713" : "Export Notifications"}
        </button>
        <button onClick={onCustomize} className="icon-btn flex items-center gap-2 text-[12.5px] font-medium px-3 py-2 rounded-lg" style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        color: C.text
      }}>
          <SlidersHorizontal size={13} /> Customize Notification Preferences
        </button>
      </div>
    </Card>;
}

/* ==================================================================== */
/* Page body                                                             */
/* ==================================================================== */
export function NotificationsBody() {
  const { notifications: rawNotifications, loading, error, markRead, markAllRead, archive, togglePin } = useNotifications();
  const { tasks } = useTasks();
  const { habits } = useHabits();
  const monthKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);
  const { events: monthEvents } = useCalendarEvents(monthKey);
  const todayKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);

  const [readOverrides, setReadOverrides] = useState({});
  const [archivedLocal, setArchivedLocal] = useState([]); // { ...notification, archiveReason }
  const [dismissedReminders, setDismissedReminders] = useState([]); // calendar event ids
  const [snoozedReminders, setSnoozedReminders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [exported, setExported] = useState(false);
  const [aiHighlights, setAiHighlights] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({
    "AI Assistant": true,
    Tasks: true,
    Goals: false,
    Calendar: false,
    Habits: false,
    Planner: false,
    Achievements: false,
    Reminders: false,
    "System Updates": false
  });

  useEffect(() => {
    getInsights()
      .then(list => setAiHighlights(list.map((ins, i) => ({
        id: ins.id,
        icon: [Zap, Hourglass, Flame, Rocket, Sparkles, AlertTriangle][i % 6],
        tag: "Insight",
        title: ins.title,
        text: ins.body
      }))))
      .catch(() => setAiHighlights([]));
  }, []);

  const notifications = useMemo(() => rawNotifications
    .filter(n => !archivedLocal.some(a => a.id === n.id))
    .map(n => readOverrides[n.id] !== undefined ? { ...n, read: readOverrides[n.id] } : n), [rawNotifications, archivedLocal, readOverrides]);

  const counts = useMemo(() => ({
    all: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    today: notifications.filter(n => n.when === "today").length,
    week: notifications.filter(n => n.when === "week").length,
    mentions: notifications.filter(n => n.mention).length,
    high: notifications.filter(n => n.priority === "High").length
  }), [notifications]);

  const filtered = useMemo(() => {
    let list = notifications;
    if (filter === "unread") list = list.filter(n => !n.read);else if (filter === "today") list = list.filter(n => n.when === "today");else if (filter === "week") list = list.filter(n => n.when === "week");else if (filter === "mentions") list = list.filter(n => n.mention);else if (filter === "high") list = list.filter(n => n.priority === "High");
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(n => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q) || n.category.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [notifications, filter, search]);

  const moveToArchive = (id, reason) => {
    const item = notifications.find(n => n.id === id);
    if (item) setArchivedLocal(a => [{ ...item, archiveReason: reason }, ...a]);
    archive(id);
  };
  const restoreNotification = id => {
    setArchivedLocal(list => list.filter(n => n.id !== id));
    // The backend has no "un-archive" endpoint; this just brings it back into view locally.
  };
  const cardHandlers = {
    onMarkRead: id => markRead(id),
    onMarkUnread: id => setReadOverrides(o => ({ ...o, [id]: false })),
    onPin: id => togglePin(id),
    onSnooze: id => moveToArchive(id, "Snoozed"),
    onArchive: id => moveToArchive(id, "Archived"),
    onDelete: id => moveToArchive(id, "Deleted")
  };
  const grouped = useMemo(() => {
    const g = {};
    Object.keys(No_CATEGORY_META).forEach(cat => {
      g[cat] = filtered.filter(n => n.category === cat);
    });
    return g;
  }, [filtered]);

  const handleClearRead = () => {
    const toArchive = notifications.filter(n => n.read && !n.pinned);
    setArchivedLocal(a => [...toArchive.map(n => ({ ...n, archiveReason: "Cleared (read)" })), ...a]);
    toArchive.forEach(n => archive(n.id));
  };

  // Reminders are derived from today's real calendar events that haven't
  // finished yet — there's no separate "reminders" endpoint on the backend.
  const reminders = useMemo(() => {
    return monthEvents
      .filter(e => e.date === todayKey && e.status !== "Done" && !dismissedReminders.includes(e.id))
      .sort((a, b) => a.startHour - b.startHour)
      .map(e => {
        const hour = Math.floor(e.startHour);
        const min = Math.round((e.startHour - hour) * 60);
        const ampm = hour < 12 ? "AM" : "PM";
        const displayHour = hour % 12 || 12;
        return {
          id: e.id,
          icon: e.category === "Meetings" ? Video : e.category === "Learning" ? BookOpen : e.category === "Fitness" ? Flame : CalendarClock,
          type: e.category,
          title: e.title,
          subtitle: `${e.duration}h block`,
          remaining: `Today, ${displayHour}:${String(min).padStart(2, "0")} ${ampm}`,
          priority: e.priority,
          snoozed: snoozedReminders.includes(e.id)
        };
      });
  }, [monthEvents, todayKey, dismissedReminders, snoozedReminders]);
  const handleSnoozeAllReminders = () => setSnoozedReminders(reminders.map(r => r.id));
  const handleReminderSnooze = id => setSnoozedReminders(prev => [...prev, id]);
  const handleReminderComplete = id => setDismissedReminders(prev => [...prev, id]);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  // Activity log derived from real completed tasks + habits.
  const activityLog = useMemo(() => {
    const fromTasks = tasks.filter(t => t.done).map(t => ({ id: `task-${t.id}`, icon: Check, title: `Completed "${t.title}"`, time: t.date }));
    const fromHabits = habits.filter(h => h.doneToday).map(h => ({ id: `habit-${h.id}`, icon: Flame, title: `Logged "${h.name}" habit`, time: "Today" }));
    return [...fromTasks, ...fromHabits].slice(0, 8);
  }, [tasks, habits]);

  const completedRemindersThisWeek = monthEvents.filter(e => e.status === "Done").length;
  const stats = {
    total: notifications.length + archivedLocal.length,
    unread: counts.unread,
    high: counts.high,
    aiRecs: aiHighlights.length,
    completedReminders: completedRemindersThisWeek
  };

  if (loading) return <Loader label="Loading your notifications…" />;
  if (error) return <EmptyState title="Couldn't load notifications" description={error} />;

  return <>
      <No_NotificationsHeader search={search} setSearch={setSearch} unreadCount={counts.unread} onMarkAllRead={markAllRead} onOpenSettings={() => setSettingsOpen(s => !s)} settingsOpen={settingsOpen} />

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <No_StatCard icon={Bell} label="Total Notifications" value={stats.total} delay={0} />
        <No_StatCard icon={MailOpen} label="Unread Notifications" value={stats.unread} delay={30} />
        <No_StatCard icon={AlertTriangle} label="High Priority Alerts" value={stats.high} delay={60} />
        <No_StatCard icon={Sparkles} label="AI Recommendations" value={stats.aiRecs} delay={90} />
        <No_StatCard icon={CheckCheck} label="Completed Events" value={stats.completedReminders} sub="This month" delay={120} />
      </div>

      {/* Smart AI Highlights */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold flex items-center gap-2" style={{
          color: C.text
        }}>
            <Sparkles size={15} /> Smart AI Highlights
          </h2>
        </div>
        {aiHighlights.length === 0 ? <p className="text-[12.5px]" style={{ color: C.faint }}>No AI highlights yet.</p> : <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {aiHighlights.map((h, i) => <No_AIHighlightCard key={h.id} item={h} delay={i * 40} onViewDetails={() => {}} onPrioritize={() => {}} />)}
        </div>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main column */}
        <div className="lg:col-span-8 min-w-0">
          <No_FilterTabs active={filter} onChange={setFilter} counts={counts} />

          <h2 className="text-[15px] font-semibold mb-3" style={{
          color: C.text
        }}>
            Notification Feed
          </h2>
          <div className="flex flex-col gap-2.5 mb-8">
            {filtered.length === 0 ? <Card className="p-6 text-center">
                <p className="text-[13px]" style={{
              color: C.faint
            }}>
                  No notifications match this filter.
                </p>
              </Card> : filtered.map((n, i) => <No_NotificationCard key={n.id} n={n} delay={i * 25} {...cardHandlers} />)}
          </div>

          <h2 className="text-[15px] font-semibold mb-3" style={{
          color: C.text
        }}>
            Notification Categories
          </h2>
          <div className="mb-2">
            {Object.keys(No_CATEGORY_META).map(cat => <No_CategorySection key={cat} category={cat} items={grouped[cat] || []} expanded={!!expandedCategories[cat]} onToggle={c => setExpandedCategories(e => ({
            ...e,
            [c]: !e[c]
          }))} cardHandlers={cardHandlers} />)}
          </div>
        </div>

        {/* Right rail */}
        <div className="lg:col-span-4 min-w-0 flex flex-col gap-6">
          <div>
            <h2 className="text-[15px] font-semibold mb-3" style={{
            color: C.text
          }}>
              Reminder Center
            </h2>
            <div className="flex flex-col gap-2.5">
              {reminders.map((r, i) => <No_ReminderCard key={r.id} reminder={r} delay={i * 30} onSnooze={handleReminderSnooze} onComplete={handleReminderComplete} />)}
              {reminders.length === 0 && <Card className="p-5 text-center">
                  <p className="text-[12.5px]" style={{
                color: C.faint
              }}>
                    All caught up — no active reminders.
                  </p>
                </Card>}
            </div>
          </div>

          <No_ActivityTimeline items={activityLog} />

          <No_QuickActions onClearRead={handleClearRead} onSnoozeAll={handleSnoozeAllReminders} onToggleHistory={() => setHistoryOpen(h => !h)} onExport={handleExport} onCustomize={() => setSettingsOpen(true)} historyOpen={historyOpen} exported={exported} />

          {historyOpen && <No_HistoryPanel items={archivedLocal} onRestore={restoreNotification} />}
        </div>
      </div>
    </>;
}

/* ==================================================================== */
/* Root export                                                          */
/* ==================================================================== */

export default NotificationsBody;
