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
import { useAuth } from "@/hooks/useAuth";
import { useHabits } from "@/hooks/useHabits";

/* ==================================================================== */
/* Settings                                                               */
/* ==================================================================== */

/* ------------------------------------------------------------------ */
/* Settings state — shaped like the real Cortex SettingsResponse       */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Settings state — shaped like the real Cortex SettingsResponse       */
/* ------------------------------------------------------------------ */
const Se_DEFAULT_SETTINGS = {
  // Notifications & Reminders
  notificationsEnabled: true,
  taskReminders: true,
  habitReminders: true,
  goalReminders: true,
  plannerReminders: true,
  // AI & Memory
  aiMemoryEnabled: true,
  // Google Calendar
  calendarSyncFrequency: "Real-time",
  calendarTwoWaySync: true,
  // Productivity Preferences
  defaultTaskPriority: "Medium",
  defaultTaskCategory: "Work",
  dailyProductivityTarget: "5 tasks"
};
const Se_settingsCategories = [{
  label: "Profile & Account",
  icon: User
}, {
  label: "AI & Memory",
  icon: Brain
}, {
  label: "Notifications & Reminders",
  icon: Bell
}, {
  label: "Google Calendar",
  icon: CalendarDays
}, {
  label: "Productivity Preferences",
  icon: SlidersHorizontal
}, {
  label: "Data Management",
  icon: Database
}, {
  label: "Security",
  icon: Lock
}];
const Se_reminderTypes = [{
  key: "taskReminders",
  label: "Task Reminders",
  desc: "Nudges before a task is due.",
  icon: CheckSquare
}, {
  key: "habitReminders",
  label: "Habit Reminders",
  desc: "Daily check-ins for active habits.",
  icon: Repeat
}, {
  key: "goalReminders",
  label: "Goal Reminders",
  desc: "Progress check-ins on your goals.",
  icon: Target
}, {
  key: "plannerReminders",
  label: "Planner Reminders",
  desc: "Heads-up before scheduled blocks.",
  icon: ClipboardList
}];
const Se_priorityOptions = [{
  value: "Low",
  color: C.low,
  bg: C.lowBg
}, {
  value: "Medium",
  color: C.med,
  bg: C.medBg
}, {
  value: "High",
  color: C.high,
  bg: C.highBg
}];
const Se_categoryOptions = [{
  value: "Work",
  icon: Briefcase
}, {
  value: "Personal",
  icon: User
}, {
  value: "Health",
  icon: Heart
}, {
  value: "Learning",
  icon: GraduationCap
}];
const Se_dataActions = [{
  key: "export",
  title: "Export User Data",
  desc: "Download all your Cortex data as a JSON file.",
  icon: Download,
  tone: "neutral",
  buttonLabel: "Export Data"
}, {
  key: "history",
  title: "Clear Activity & History",
  desc: "Erase your task, habit, and planner activity history.",
  icon: History,
  tone: "neutral",
  buttonLabel: "Clear History"
}, {
  key: "memories",
  title: "Delete AI Memories",
  desc: "Permanently erase everything Cortex remembers about you.",
  icon: Brain,
  tone: "danger",
  buttonLabel: "Delete Memories"
}, {
  key: "account",
  title: "Delete Account",
  desc: "Permanently delete your account and all associated data.",
  icon: Trash2,
  tone: "danger",
  buttonLabel: "Delete Account"
}];

/* ------------------------------------------------------------------ */
/* Small building blocks — shared visual language with the dashboard   */
/* ------------------------------------------------------------------ */

function Se_Toggle({
  checked,
  onChange,
  label
}) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className="relative shrink-0 transition-colors duration-200" style={{
    width: 40,
    height: 22,
    borderRadius: 999,
    background: checked ? C.glossDark : C.cardMuted,
    border: `1px solid ${checked ? "#000" : C.divider}`,
    boxShadow: checked ? "inset 0 1px 0 rgba(255,255,255,0.18)" : "none"
  }}>
      <span style={{
      position: "absolute",
      top: 1.5,
      left: checked ? 20 : 2,
      width: 17,
      height: 17,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
      transition: "left 200ms cubic-bezier(0.16,1,0.3,1)"
    }} />
    </button>;
}
function Se_Select({
  value,
  onChange,
  options,
  width = 168
}) {
  return <div className="relative" style={{
    width
  }}>
      <select value={value} onChange={e => onChange(e.target.value)} className="text-[13px] pl-3 pr-8 py-2 rounded-lg outline-none w-full appearance-none cursor-pointer" style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      color: C.text
    }}>
        {options.map(o => <option key={o} value={o}>
            {o}
          </option>)}
      </select>
      <ChevronDown size={13} color={C.faint} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>;
}
function Se_Input({
  value,
  onChange,
  placeholder,
  type = "text",
  width = 220
}) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="text-[13px] px-3 py-2 rounded-lg outline-none" style={{
    background: C.card,
    border: `1px solid ${C.border}`,
    color: C.text,
    width
  }} />;
}
function Se_Row({
  label,
  description,
  control,
  last
}) {
  return <div className="flex items-center justify-between gap-6 py-4 flex-wrap" style={{
    borderBottom: last ? "none" : `1px solid ${C.borderSoft}`
  }}>
      <div className="max-w-[62%] min-w-[200px]">
        <div className="text-[13.5px] font-medium" style={{
        color: C.text
      }}>
          {label}
        </div>
        {description && <div className="text-[12px] mt-1 leading-relaxed" style={{
        color: C.faint
      }}>
            {description}
          </div>}
      </div>
      <div className="shrink-0">{control}</div>
    </div>;
}
function Se_SectionCard({
  title,
  description,
  children,
  delay = 0,
  action
}) {
  return <Card className="p-6 lg:p-7 mb-6" delay={delay}>
      <div className="flex items-center justify-between mb-1 gap-3">
        <h3 className="text-[15px] font-semibold" style={{
        color: C.text
      }}>
          {title}
        </h3>
        {action}
      </div>
      {description && <p className="text-[12.5px] mb-2" style={{
      color: C.sub
    }}>
          {description}
        </p>}
      <div className="flex flex-col">{children}</div>
    </Card>;
}
function Se_ConfigRows({
  rows,
  settings,
  setSettings
}) {
  return rows.map((r, i) => <Se_Row key={r.key} label={r.label} description={r.desc} last={i === rows.length - 1} control={r.type === "toggle" ? <Se_Toggle checked={settings[r.key]} onChange={() => setSettings(s => ({
    ...s,
    [r.key]: !s[r.key]
  }))} /> : r.type === "select" ? <Se_Select value={settings[r.key]} options={r.options} onChange={v => setSettings(s => ({
    ...s,
    [r.key]: v
  }))} /> : r.type === "time" ? <Se_Input type="time" width={140} value={settings[r.key]} onChange={v => setSettings(s => ({
    ...s,
    [r.key]: v
  }))} /> : null} />);
}
function Se_DangerButton({
  children,
  onClick,
  icon: Icon
}) {
  return <button onClick={onClick} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150" style={{
    border: `1px solid ${C.danger}`,
    color: C.danger,
    background: C.dangerBg
  }}>
      {Icon && <Icon size={14} />}
      {children}
    </button>;
}
function Se_GhostButton({
  children,
  onClick,
  icon: Icon
}) {
  return <button onClick={onClick} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150" style={{
    border: `1px solid ${C.divider}`,
    color: C.text
  }}>
      {Icon && <Icon size={14} />}
      {children}
    </button>;
}
function Se_DarkButton({
  children,
  onClick,
  icon: Icon,
  disabled
}) {
  return <button onClick={onClick} disabled={disabled} className="glossy-btn glitter-sm flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-transform duration-150 hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none" style={{
    background: C.glossDark,
    color: C.onInk,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`
  }}>
      {Icon && <Icon size={14} />}
      {children}
    </button>;
}

/* ------------------------------------------------------------------ */
/* New primitives — used to give the settings sections a richer,       */
/* less "form list" feel, while staying in the same visual language.   */
/* ------------------------------------------------------------------ */
function Se_IconChip({
  icon: Icon,
  tone = "neutral",
  size = 36
}) {
  const tones = {
    neutral: {
      bg: C.cardMuted,
      border: C.border,
      color: C.sub
    },
    ink: {
      bg: C.glossDark,
      border: "#000",
      color: C.onInk
    },
    good: {
      bg: C.goodBg,
      border: C.good,
      color: C.good
    },
    warn: {
      bg: C.warnBg,
      border: C.warn,
      color: C.warn
    },
    danger: {
      bg: C.dangerBg,
      border: C.danger,
      color: C.danger
    }
  };
  const t = tones[tone] || tones.neutral;
  return <div className="shrink-0 rounded-xl flex items-center justify-center" style={{
    width: size,
    height: size,
    background: t.bg,
    border: `1px solid ${t.border}`
  }}>
      <Icon size={size * 0.42} color={t.color} strokeWidth={1.9} />
    </div>;
}
function Se_StatChip({
  label,
  value
}) {
  return <div className="px-3 py-2 rounded-lg" style={{
    background: C.cardMuted,
    border: `1px solid ${C.borderSoft}`
  }}>
      <div className="text-[13px] font-semibold" style={{
      color: C.text
    }}>
        {value}
      </div>
      <div className="text-[10.5px] mt-0.5 uppercase tracking-wide" style={{
      color: C.faint
    }}>
        {label}
      </div>
    </div>;
}
function Se_SegmentedControl({
  value,
  onChange,
  options
}) {
  return <div className="inline-flex rounded-lg overflow-hidden flex-wrap" style={{
    border: `1px solid ${C.border}`
  }}>
      {options.map(o => {
      const label = typeof o === "string" ? o : o.value;
      const isActive = value === label;
      return <button key={label} onClick={() => onChange(label)} className="px-3.5 py-2 text-[12.5px] font-medium transition-colors duration-150" style={{
        background: isActive ? typeof o === "string" ? C.ink : o.color : "transparent",
        color: isActive ? "#fff" : C.text,
        borderRight: `1px solid ${C.border}`
      }}>
            {label}
          </button>;
    })}
    </div>;
}

/* ------------------------------------------------------------------ */
/* Settings sidebar — same ink-dark anchor as the dashboard sidebar     */
/* ------------------------------------------------------------------ */
function Se_CategoryTabs({
  active,
  onNavigate
}) {
  return <nav className="flex items-center gap-2 overflow-x-auto pb-1 mb-7 -mx-1 px-1" style={{
    scrollbarWidth: "none"
  }}>
      {Se_settingsCategories.map(item => {
      const Icon = item.icon;
      const isActive = item.label === active;
      return <button key={item.label} onClick={() => onNavigate(item.label)} className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] whitespace-nowrap shrink-0 transition-colors duration-150" style={{
        color: isActive ? C.onInk : C.text,
        background: isActive ? C.glossDark : C.card,
        border: `1px solid ${isActive ? "#000" : C.border}`,
        boxShadow: isActive ? C.shadow : "none"
      }}>
            <Icon size={14.5} strokeWidth={1.75} />
            <span className="font-medium">{item.label}</span>
          </button>;
    })}
    </nav>;
}

/* ------------------------------------------------------------------ */
/* Header                                                                */
/* ------------------------------------------------------------------ */
function Se_SettingsHeader({
  search,
  setSearch,
  onSave,
  onReset,
  dirty
}) {
  return <header className="flex items-center justify-between gap-4 mb-8 flex-wrap">
      <div>
          <h1 className="text-[26px] sm:text-[28px] font-semibold tracking-tight" style={{
          color: C.text
        }}>
            Settings
          </h1>
          <p className="text-[13px] mt-0.5" style={{
          color: C.faint
        }}>
            Customize every corner of your Cortex experience.
          </p>
        </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg" style={{
        border: `1px solid ${C.border}`,
        background: C.card,
        width: 220,
        boxShadow: C.shadow
      }}>
          <Search size={14} color={C.faint} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search settings…" className="text-[13px] outline-none bg-transparent w-full" style={{
          color: C.text
        }} />
        </div>
        <Se_GhostButton onClick={onReset} icon={RotateCcw}>
          Reset to Default
        </Se_GhostButton>
        <Se_DarkButton onClick={onSave} icon={Save}>
          {dirty ? "Save Changes" : "Saved"}
        </Se_DarkButton>
      </div>
    </header>;
}

/* ------------------------------------------------------------------ */
/* Confirmation modal — reused for destructive / high-stakes actions    */
/* ------------------------------------------------------------------ */
function Se_ConfirmationModal({
  modal,
  onClose,
  onConfirm
}) {
  if (!modal) return null;
  return <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{
    background: "rgba(13,13,12,0.5)",
    backdropFilter: "blur(6px)"
  }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="fade-up w-full max-w-[420px] rounded-2xl p-6" style={{
      background: C.glossCard,
      border: `1px solid ${C.border}`,
      boxShadow: C.shadowLift
    }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{
          background: modal.danger ? C.dangerBg : C.cardMuted,
          border: `1px solid ${modal.danger ? C.danger : C.border}`
        }}>
            <AlertTriangle size={16} color={modal.danger ? C.danger : C.sub} />
          </div>
          <h3 className="text-[16px] font-semibold" style={{
          color: C.text
        }}>
            {modal.title}
          </h3>
        </div>
        <p className="text-[13.5px] leading-relaxed mb-6" style={{
        color: C.sub
      }}>
          {modal.body}
        </p>
        <div className="flex justify-end gap-3">
          <Se_GhostButton onClick={onClose}>Cancel</Se_GhostButton>
          {modal.danger ? <Se_DangerButton onClick={onConfirm} icon={modal.icon}>
              {modal.confirmLabel}
            </Se_DangerButton> : <Se_DarkButton onClick={onConfirm} icon={modal.icon}>
              {modal.confirmLabel}
            </Se_DarkButton>}
        </div>
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* 1. Profile & Account                                                 */
/* ------------------------------------------------------------------ */
function Se_ProfileAccountSection({
  openModal
}) {
  const { user, logout, updateProfile } = useAuth();
  const { habits } = useHabits();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (user) setProfile({ name: user.name, email: user.email });
  }, [user]);
  const set = k => v => setProfile(p => ({
    ...p,
    [k]: v
  }));
  const handleSaveProfile = () => {
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    updateProfile(profile)
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      })
      .catch(err => setSaveError(err instanceof Error ? err.message : "Couldn't save your profile"))
      .finally(() => setSaving(false));
  };
  const initials = (profile.name || "?").trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "short", year: "2-digit" }) : "—";
  const bestStreak = habits.length ? Math.max(...habits.map(h => h.streak || 0)) : 0;
  return <>
      <Card className="p-6 lg:p-7 mb-6 relative overflow-hidden" delay={40}>
        <div className="flex items-start justify-between gap-6 flex-wrap relative">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-[26px] font-semibold glitter-sm" style={{
              background: C.glossDark,
              color: C.onInk,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18), ${C.shadow}`
            }}>
                {initials}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center" style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow
            }} aria-label="Change profile picture">
                <Camera size={13} color={C.sub} />
              </button>
            </div>
            <div>
              <div className="text-[16px] font-semibold" style={{
              color: C.text
            }}>
                {profile.name || "Your name"}
              </div>
              <div className="text-[12.5px] mt-0.5" style={{
              color: C.faint
            }}>
                {profile.email || "your@email.com"}
              </div>
              <button className="text-[12.5px] font-medium mt-2 underline underline-offset-2" style={{
              color: C.text
            }}>
                Upload new photo
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <Se_StatChip label="Member Since" value={memberSince} />
            <Se_StatChip label="Best Streak" value={`${bestStreak} days`} />
            <Se_GhostButton icon={LogOut} onClick={logout}>Log Out</Se_GhostButton>
          </div>
        </div>
      </Card>

      <Se_SectionCard title="Profile Details" description="This information identifies you across Cortex." delay={80}>
        <Se_Row label={<span className="flex items-center gap-3">
              <Se_IconChip icon={User} size={30} /> Name
            </span>} control={<Se_Input value={profile.name} onChange={set("name")} />} />
        <Se_Row label={<span className="flex items-center gap-3">
              <Se_IconChip icon={AtSign} size={30} /> Email
            </span>} last control={<Se_Input type="email" value={profile.email} onChange={set("email")} />} />
      </Se_SectionCard>

      <div className="flex items-center justify-end gap-3 mb-6 -mt-2">
        {saveError && <span className="text-[12px]" style={{ color: C.danger }}>{saveError}</span>}
        {saved && <span className="text-[12px]" style={{ color: C.sub }}>Saved</span>}
        <Se_DarkButton icon={Save} onClick={handleSaveProfile} disabled={saving}>{saving ? "Saving…" : "Update Profile Details"}</Se_DarkButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-6" delay={120}>
          <div className="flex items-center gap-3 mb-4">
            <Se_IconChip icon={KeyRound} tone="neutral" />
            <div>
              <div className="text-[14px] font-semibold" style={{
              color: C.text
            }}>
                Password
              </div>
              <div className="text-[11.5px]" style={{
              color: C.faint
            }}>
                Keep your account secure
              </div>
            </div>
          </div>
          <Se_GhostButton icon={KeyRound}>Change Password</Se_GhostButton>
        </Card>

        <Card className="p-6" delay={160} style={{
        border: `1px solid ${C.danger}`,
        background: C.dangerBg
      }}>
          <div className="flex items-center gap-3 mb-4">
            <Se_IconChip icon={Trash2} tone="danger" />
            <div>
              <div className="text-[14px] font-semibold" style={{
              color: C.danger
            }}>
                Delete Account
              </div>
              <div className="text-[11.5px]" style={{
              color: C.danger,
              opacity: 0.8
            }}>
                Permanent — cannot be undone
              </div>
            </div>
          </div>
          <Se_DangerButton icon={Trash2} onClick={() => openModal({
          title: "Delete your account?",
          body: "This will permanently delete your Cortex account, including tasks, goals, habits, and AI memory. This cannot be undone.",
          confirmLabel: "Delete Account",
          danger: true,
          icon: Trash2
        })}>
            Delete Account
          </Se_DangerButton>
        </Card>
      </div>
    </>;
}

/* ------------------------------------------------------------------ */
/* 2. AI & Memory                                                       */
/* ------------------------------------------------------------------ */
function Se_AIMemorySection({
  settings,
  setSettings,
  openModal
}) {
  const [memories, setMemories] = useState([]);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("cortex_ai_memories");
      setMemories(saved ? JSON.parse(saved) : []);
    } catch {
      setMemories([]);
    }
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem("cortex_ai_memories", JSON.stringify(memories));
    } catch {
      /* ignore persistence errors */
    }
  }, [memories]);
  const forget = id => setMemories(m => m.filter(mem => mem.id !== id));
  const clearAll = () => setMemories([]);
  return <>
      <Card className="p-6 lg:p-7 mb-6 glitter" delay={40} style={{
      background: C.glossDark
    }}>
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{
            background: settings.aiMemoryEnabled ? "rgba(63,107,78,0.35)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${settings.aiMemoryEnabled ? "#6FA382" : C.ink3}`
          }}>
              <Brain size={22} color={settings.aiMemoryEnabled ? "#8FC7A5" : C.onInkSub} />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full" style={{
              background: settings.aiMemoryEnabled ? "#6FA382" : C.faint,
              border: `2px solid ${C.ink}`
            }} />
            </div>
            <div>
              <div className="text-[15px] font-semibold" style={{
              color: C.onInk
            }}>
                AI Memory is {settings.aiMemoryEnabled ? "Active" : "Paused"}
              </div>
              <div className="text-[12px] mt-0.5" style={{
              color: C.onInkSub
            }}>
                {settings.aiMemoryEnabled ? "Connected to your Cortex AI backend — remembering context across conversations." : "Cortex will not retain context between sessions."}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Se_StatChip label="Memories" value={memories.length} />
            <Se_Toggle checked={settings.aiMemoryEnabled} onChange={() => setSettings(s => ({
            ...s,
            aiMemoryEnabled: !s.aiMemoryEnabled
          }))} />
          </div>
        </div>
      </Card>

      <Se_SectionCard title="Stored Memories" description="What Cortex remembers about you, based on what you've shared in conversations." delay={80}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
          {memories.length === 0 && <p className="text-[12.5px] py-2 col-span-2" style={{
          color: C.faint
        }}>
              No stored memories yet — Cortex will add memories here as it learns from your conversations.
            </p>}
          {memories.map(m => <div key={m.id} className="rounded-xl p-4 flex items-start gap-3" style={{
          background: C.card,
          border: `1px solid ${C.borderSoft}`
        }}>
              <Se_IconChip icon={m.icon || Brain} size={32} />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium" style={{
              color: C.text
            }}>
                  {m.title}
                </div>
                <div className="text-[11.5px] mt-0.5 leading-relaxed" style={{
              color: C.faint
            }}>
                  {m.snippet}
                </div>
                <div className="text-[10.5px] mt-1.5" style={{
              color: C.faint
            }}>
                  {m.date}
                </div>
              </div>
              <button onClick={() => forget(m.id)} className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150" style={{
            border: `1px solid ${C.divider}`,
            color: C.danger
          }} aria-label={`Forget ${m.title}`}>
                <Trash2 size={12.5} />
              </button>
            </div>)}
        </div>
      </Se_SectionCard>

      <Se_SectionCard title="Danger Zone" description="This action is permanent and cannot be undone." delay={120}>
        <Se_Row label="Clear All AI Memories" description="Permanently erase everything Cortex has learned from your conversations." last control={<Se_DangerButton icon={Trash2} onClick={() => openModal({
        title: "Clear all AI memories?",
        body: "This permanently erases everything Cortex remembers about you. Future conversations will start with no prior context.",
        confirmLabel: "Clear All Memories",
        danger: true,
        icon: Trash2,
        onConfirm: clearAll
      })}>
              Clear All Memories
            </Se_DangerButton>} />
      </Se_SectionCard>
    </>;
}

/* ------------------------------------------------------------------ */
/* 3. Notifications & Reminders                                         */
/* ------------------------------------------------------------------ */
function Se_NotificationsRemindersSection({
  settings,
  setSettings
}) {
  return <>
      <Card className="p-6 mb-6 flex items-center justify-between gap-6 flex-wrap" delay={40}>
        <div className="flex items-center gap-4">
          <Se_IconChip icon={settings.notificationsEnabled ? BellRing : BellOff} tone={settings.notificationsEnabled ? "good" : "neutral"} size={40} />
          <div>
            <div className="text-[14.5px] font-semibold" style={{
            color: C.text
          }}>
              Notifications
            </div>
            <div className="text-[12px] mt-0.5" style={{
            color: C.faint
          }}>
              {settings.notificationsEnabled ? "You'll be notified across tasks, habits, goals, and planner." : "All Cortex notifications are turned off."}
            </div>
          </div>
        </div>
        <Se_Toggle checked={settings.notificationsEnabled} onChange={() => setSettings(s => ({
        ...s,
        notificationsEnabled: !s.notificationsEnabled
      }))} />
      </Card>

      <Se_SectionCard title="Reminder Types" description="Fine-tune which reminders reach you." delay={80}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
          {Se_reminderTypes.map(r => <div key={r.key} className="rounded-xl p-4 flex items-center justify-between gap-3" style={{
          background: settings[r.key] && settings.notificationsEnabled ? C.card : C.cardMuted,
          border: `1px solid ${C.borderSoft}`,
          opacity: settings.notificationsEnabled ? 1 : 0.55
        }}>
              <div className="flex items-center gap-3 min-w-0">
                <Se_IconChip icon={r.icon} size={32} />
                <div className="min-w-0">
                  <div className="text-[13px] font-medium truncate" style={{
                color: C.text
              }}>
                    {r.label}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{
                color: C.faint
              }}>
                    {r.desc}
                  </div>
                </div>
              </div>
              <Se_Toggle checked={settings[r.key]} onChange={() => settings.notificationsEnabled && setSettings(s => ({
            ...s,
            [r.key]: !s[r.key]
          }))} />
            </div>)}
        </div>
      </Se_SectionCard>
    </>;
}

/* ------------------------------------------------------------------ */
/* 4. Google Calendar Integration                                       */
/* ------------------------------------------------------------------ */
function Se_GoogleCalendarSection({
  settings,
  setSettings
}) {
  const [status, setStatus] = useState("Connected");
  const connected = status === "Connected";
  return <>
      <Card className="p-6 lg:p-7 mb-6" delay={40}>
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <Se_IconChip icon={CalendarDays} tone={connected ? "good" : "neutral"} size={44} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold" style={{
                color: C.text
              }}>
                  Google Calendar
                </span>
                <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1" style={{
                background: connected ? C.goodBg : "transparent",
                border: connected ? "none" : `1px solid ${C.divider}`,
                color: connected ? C.good : C.faint
              }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{
                  background: connected ? C.good : C.faint
                }} />
                  {status}
                </span>
              </div>
              <div className="text-[12px] mt-0.5" style={{
              color: C.faint
            }}>
                {connected ? "Synced 2 minutes ago." : "Link your Google account to sync events into Cortex."}
              </div>
            </div>
          </div>
          {connected ? <div className="flex gap-2">
              <Se_GhostButton icon={RefreshCw}>Sync Now</Se_GhostButton>
              <button onClick={() => setStatus("Not connected")} className="px-4 py-2.5 rounded-lg text-[13px] font-medium" style={{
            border: `1px solid ${C.danger}`,
            color: C.danger
          }}>
                Disconnect
              </button>
            </div> : <Se_DarkButton onClick={() => setStatus("Connected")} icon={Plug}>
              Connect Google Calendar
            </Se_DarkButton>}
        </div>
      </Card>

      <Se_SectionCard title="Synchronization Preferences" delay={80}>
        <Se_Row label="Sync Frequency" description="How often Cortex checks Google Calendar for changes." control={<Se_SegmentedControl value={settings.calendarSyncFrequency} onChange={v => setSettings(s => ({
        ...s,
        calendarSyncFrequency: v
      }))} options={["Real-time", "Every 15 min", "Hourly", "Manual"]} />} />
        <Se_Row label="Two-way Sync" description="Changes made in Cortex also update Google Calendar." last control={<Se_Toggle checked={settings.calendarTwoWaySync} onChange={() => setSettings(s => ({
        ...s,
        calendarTwoWaySync: !s.calendarTwoWaySync
      }))} />} />
      </Se_SectionCard>
    </>;
}

/* ------------------------------------------------------------------ */
/* 5. Productivity Preferences                                          */
/* ------------------------------------------------------------------ */
function Se_ProductivityPreferencesSection({
  settings,
  setSettings
}) {
  const priority = Se_priorityOptions.find(p => p.value === settings.defaultTaskPriority) || Se_priorityOptions[1];
  const category = Se_categoryOptions.find(c => c.value === settings.defaultTaskCategory) || Se_categoryOptions[0];
  return <>
      <Se_SectionCard title="Task Defaults" description="Applied automatically whenever you create a new task." delay={40}>
        <Se_Row label="Default Task Priority" control={<Se_SegmentedControl value={settings.defaultTaskPriority} onChange={v => setSettings(s => ({
        ...s,
        defaultTaskPriority: v
      }))} options={Se_priorityOptions} />} />
        <Se_Row label="Default Task Category" control={<div className="flex items-center gap-2 flex-wrap justify-end">
              {Se_categoryOptions.map(c => {
          const isActive = settings.defaultTaskCategory === c.value;
          return <button key={c.value} onClick={() => setSettings(s => ({
            ...s,
            defaultTaskCategory: c.value
          }))} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors duration-150" style={{
            background: isActive ? C.ink : "transparent",
            color: isActive ? C.onInk : C.text,
            border: `1px solid ${isActive ? C.ink : C.divider}`
          }}>
                    <c.icon size={12.5} />
                    {c.value}
                  </button>;
        })}
            </div>} />
        <Se_Row label="Daily Productivity Target" description="Tasks you aim to complete each day." last control={<Se_SegmentedControl value={settings.dailyProductivityTarget} onChange={v => setSettings(s => ({
        ...s,
        dailyProductivityTarget: v
      }))} options={["3 tasks", "5 tasks", "8 tasks", "10 tasks"]} />} />
      </Se_SectionCard>

      <Se_SectionCard title="Preview" description="How a new task will look with these defaults applied." delay={80}>
        <div className="rounded-xl p-4 flex items-center gap-3 mt-1" style={{
        background: C.card,
        border: `1px solid ${C.borderSoft}`
      }}>
          <div className="w-4 h-4 rounded-[5px] shrink-0" style={{
          border: `1.5px solid ${C.divider}`
        }} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium" style={{
            color: C.text
          }}>
              New task
            </div>
            <div className="text-[11px] mt-0.5" style={{
            color: C.faint
          }}>
              Target: {settings.dailyProductivityTarget} · day
            </div>
          </div>
          <span className="text-[10.5px] font-medium px-2 py-1 rounded-full flex items-center gap-1" style={{
          background: category ? C.cardMuted : C.cardMuted,
          color: C.sub
        }}>
            <category.icon size={11} />
            {category.value}
          </span>
          <span className="text-[10.5px] font-medium px-2 py-1 rounded-full" style={{
          background: priority.bg,
          color: priority.color
        }}>
            {priority.value}
          </span>
        </div>
      </Se_SectionCard>
    </>;
}

/* ------------------------------------------------------------------ */
/* 6. Data Management                                                   */
/* ------------------------------------------------------------------ */
function Se_DataManagementSection({
  openModal
}) {
  const handle = action => {
    if (action.tone !== "danger") return;
    openModal({
      title: `${action.title}?`,
      body: action.key === "memories" ? "This permanently erases everything Cortex has learned from your conversations. This cannot be undone." : "This will permanently delete your Cortex account, including tasks, goals, habits, and AI memory. This cannot be undone.",
      confirmLabel: action.buttonLabel,
      danger: true,
      icon: action.icon
    });
  };
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {Se_dataActions.map((a, i) => <Card key={a.key} className="p-6" delay={40 + i * 30} style={a.tone === "danger" ? {
      border: `1px solid ${C.danger}`,
      background: C.dangerBg
    } : undefined}>
          <div className="flex items-center gap-3 mb-4">
            <Se_IconChip icon={a.icon} tone={a.tone === "danger" ? "danger" : "neutral"} />
            <div>
              <div className="text-[14px] font-semibold" style={{
              color: a.tone === "danger" ? C.danger : C.text
            }}>
                {a.title}
              </div>
              <div className="text-[11.5px] mt-0.5 leading-relaxed" style={{
              color: a.tone === "danger" ? C.danger : C.faint,
              opacity: a.tone === "danger" ? 0.8 : 1
            }}>
                {a.desc}
              </div>
            </div>
          </div>
          {a.tone === "danger" ? <Se_DangerButton icon={a.icon} onClick={() => handle(a)}>
              {a.buttonLabel}
            </Se_DangerButton> : <Se_GhostButton icon={a.icon}>{a.buttonLabel}</Se_GhostButton>}
        </Card>)}
    </div>;
}

/* ------------------------------------------------------------------ */
/* 7. Security                                                          */
/* ------------------------------------------------------------------ */
function Se_SecuritySection({
  openModal
}) {
  const { logout } = useAuth();
  return <>
      <Se_SectionCard title="Sign-in & Sessions" description="Manage how you sign in and stay signed in." delay={40}>
        <Se_Row label={<span className="flex items-center gap-3">
              <Se_IconChip icon={KeyRound} size={30} /> Change Password
            </span>} description="Keep your account secure with a strong password." control={<Se_GhostButton icon={KeyRound}>Change Password</Se_GhostButton>} />
        <Se_Row label={<span className="flex items-center gap-3">
              <Se_IconChip icon={LogOut} size={30} /> Log Out
            </span>} description="Sign out of Cortex on this device." last control={<Se_GhostButton icon={LogOut} onClick={logout}>Log Out</Se_GhostButton>} />
      </Se_SectionCard>

      <Card className="p-6" delay={80} style={{
      border: `1px solid ${C.danger}`,
      background: C.dangerBg
    }}>
        <div className="flex items-center gap-3 mb-4">
          <Se_IconChip icon={ShieldAlert} tone="danger" />
          <div>
            <div className="text-[14px] font-semibold" style={{
            color: C.danger
          }}>
              Log Out From All Devices
            </div>
            <div className="text-[11.5px] mt-0.5" style={{
            color: C.danger,
            opacity: 0.8
          }}>
              Immediately signs you out everywhere, including this device.
            </div>
          </div>
        </div>
        <Se_DangerButton icon={LogOut} onClick={() => openModal({
        title: "Log out from all devices?",
        body: "This will immediately sign you out of Cortex everywhere, including this device. You'll need to sign in again.",
        confirmLabel: "Log Out Everywhere",
        danger: true,
        icon: LogOut,
        onConfirm: logout
      })}>
          Log Out Everywhere
        </Se_DangerButton>
      </Card>
    </>;
}

/* ------------------------------------------------------------------ */
/* Category → content map                                               */
/* ------------------------------------------------------------------ */
function Se_CategoryContent({
  category,
  settings,
  setSettings,
  openModal
}) {
  switch (category) {
    case "Profile & Account":
      return <Se_ProfileAccountSection openModal={openModal} />;
    case "AI & Memory":
      return <Se_AIMemorySection settings={settings} setSettings={setSettings} openModal={openModal} />;
    case "Notifications & Reminders":
      return <Se_NotificationsRemindersSection settings={settings} setSettings={setSettings} />;
    case "Google Calendar":
      return <Se_GoogleCalendarSection settings={settings} setSettings={setSettings} />;
    case "Productivity Preferences":
      return <Se_ProductivityPreferencesSection settings={settings} setSettings={setSettings} />;
    case "Data Management":
      return <Se_DataManagementSection openModal={openModal} />;
    case "Security":
      return <Se_SecuritySection openModal={openModal} />;
    default:
      return null;
  }
}
const SE_SETTINGS_STORAGE_KEY = "cortex_settings_preferences";

export function SettingsBody() {
  const [activeCategory, setActiveCategory] = useState("Profile & Account");
  const [search, setSearch] = useState("");
  const [settings, setSettings] = useState(Se_DEFAULT_SETTINGS);
  const [dirty, setDirty] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SE_SETTINGS_STORAGE_KEY);
      if (saved) setSettings({ ...Se_DEFAULT_SETTINGS, ...JSON.parse(saved) });
    } catch {
      /* fall back to defaults */
    }
  }, []);

  const updateSettings = (updater) => {
    setSettings(updater);
    setDirty(true);
  };

  const handleSave = () => {
    try {
      window.localStorage.setItem(SE_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore persistence errors */
    }
    setDirty(false);
    setToast("Changes saved");
    setTimeout(() => setToast(null), 2200);
  };

  const handleReset = () => {
    setSettings(Se_DEFAULT_SETTINGS);
    try {
      window.localStorage.setItem(SE_SETTINGS_STORAGE_KEY, JSON.stringify(Se_DEFAULT_SETTINGS));
    } catch {
      /* ignore persistence errors */
    }
    setDirty(false);
    setToast("Reset to default");
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <>
      <div className="-mt-2">
        <Se_SettingsHeader
          search={search}
          setSearch={setSearch}
          onSave={handleSave}
          onReset={handleReset}
          dirty={dirty}
        />

        <Se_CategoryTabs active={activeCategory} onNavigate={setActiveCategory} />

        <Se_CategoryContent
          category={activeCategory}
          settings={settings}
          setSettings={updateSettings}
          openModal={setModal}
        />
      </div>

      <Se_ConfirmationModal modal={modal} onClose={() => setModal(null)} onConfirm={() => { modal?.onConfirm?.(); setModal(null); }} />

      {toast && (
        <div
          className="fixed bottom-6 right-6 fade-up px-4 py-3 rounded-xl text-[13px] font-medium flex items-center gap-2 z-[110]"
          style={{ background: C.glossDark, color: C.onInk, boxShadow: C.shadowLift }}
        >
          <Check size={14} /> {toast}
        </div>
      )}
    </>
  );
}


export default SettingsBody;
