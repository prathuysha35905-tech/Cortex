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
import { usePlanner } from "@/hooks/usePlanner";
import { useTasks } from "@/hooks/useTasks";
import { useGoals } from "@/hooks/useGoals";
import { useHabits } from "@/hooks/useHabits";
import { useDashboard } from "@/hooks/useDashboard";
import { getPlannerEntries } from "@/services/planner.service";

/* ------------------------------------------------------------------ */
/* Date helpers — real calendar dates instead of a fixed mock "today"   */
/* ------------------------------------------------------------------ */
function Pl_pad2(n) {
  return n < 10 ? `0${n}` : `${n}`;
}
function Pl_fmtKey(d) {
  return `${d.getFullYear()}-${Pl_pad2(d.getMonth() + 1)}-${Pl_pad2(d.getDate())}`;
}
function Pl_addDays(d, n) {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}
function Pl_startOfWeekMon(d) {
  const day = (d.getDay() + 6) % 7; // 0 = Monday
  return Pl_addDays(d, -day);
}
function Pl_parseTimeToMinutes(time) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec((time || "").trim());
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ampm = m[3]?.toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + min;
}
function Pl_parseDurationToMinutes(duration) {
  if (!duration) return 0;
  const hMatch = /(\d+(?:\.\d+)?)\s*h/i.exec(duration);
  const mMatch = /(\d+)\s*m/i.exec(duration);
  const hours = hMatch ? parseFloat(hMatch[1]) : 0;
  const mins = mMatch ? parseInt(mMatch[1], 10) : 0;
  return Math.round(hours * 60 + mins);
}

/* ==================================================================== */
/* Planner                                                                */
/* ==================================================================== */

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Planner data now comes from real hooks (usePlanner, useTasks,       */
/* useGoals, useHabits, useDashboard) instead of fixed mock arrays.    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Shared building blocks (mirrors dashboard Card / PriorityBadge)     */
/* ------------------------------------------------------------------ */
function Pl_Card({
  children,
  className = "",
  style = {},
  delay = 0
}) {
  return <div className={`fade-up hover-lift shine-card relative overflow-hidden ${className}`} style={{
    background: C.glossCard,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    boxShadow: `inset 0 1px 0 ${C.sheenSoft}, ${C.shadow}`,
    animationDelay: `${delay}ms`,
    ...style
  }}>
      <span className="shine-sweep" aria-hidden="true" />
      <div className="relative flex-1 flex flex-col min-h-0">{children}</div>
    </div>;
}
function Pl_PriorityBadge({
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
  return <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full tracking-wide inline-block shrink-0 ${priority === "High" ? "glitter-sm" : ""}`} style={styles[priority]}>
      {priority}
    </span>;
}
function Pl_StatusBadge({
  status
}) {
  const map = {
    done: {
      label: "Done",
      icon: CheckCircle2,
      color: C.faint
    },
    "in-progress": {
      label: "In progress",
      icon: Circle,
      color: C.text
    },
    upcoming: {
      label: "Upcoming",
      icon: Circle,
      color: C.faint
    }
  };
  const s = map[status] || map.upcoming;
  const Icon = s.icon;
  return <span className="flex items-center gap-1.5 text-[11.5px] shrink-0" style={{
    color: s.color
  }}>
      <Icon size={12} strokeWidth={status === "in-progress" ? 2.5 : 2} />
      {s.label}
    </span>;
}

/* ------------------------------------------------------------------ */
/* 1. Planner Header                                                    */
/* ------------------------------------------------------------------ */
function Pl_PlannerHeader({ taskCount = 0, eventCount = 0 }) {
  const today = useMemo(() => new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }), []);
  return <Pl_Card className="p-7 lg:p-8 mb-6" delay={20}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="text-[13px] mb-2" style={{
          color: C.faint
        }}>
            {today}
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-tight leading-tight" style={{
          color: C.text
        }}>
            <span className="font-display text-[38px] sm:text-[44px] font-normal align-middle">Planner</span>
          </h1>
          <p className="text-[14.5px] mt-2" style={{
          color: C.sub
        }}>
            {taskCount} task{taskCount === 1 ? "" : "s"}, {eventCount} event{eventCount === 1 ? "" : "s"} today.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button className="px-4 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors duration-150 flex items-center gap-1.5" style={{
          border: `1px solid ${C.divider}`,
          color: C.text
        }}>
            <Zap size={14} />
            Plan My Day
          </button>
          <button className="glossy-btn glitter-sm px-4 py-2.5 rounded-lg text-[13.5px] font-medium transition-transform duration-150 hover:-translate-y-0.5 flex items-center gap-1.5" style={{
          background: C.glossDark,
          color: C.onInk,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`
        }}>
            <Sparkles size={14} />
            Generate AI Plan
          </button>
        </div>
      </div>
    </Pl_Card>;
}

/* ------------------------------------------------------------------ */
/* 2. Planner Navigation                                                */
/* ------------------------------------------------------------------ */
function Pl_PlannerNav({
  active,
  onChange
}) {
  const ranges = ["Today", "Tomorrow", "This Week", "This Month"];
  return <div className="inline-flex items-center gap-1 p-1 rounded-xl mb-6 fade-up" style={{
    background: C.cardMuted,
    border: `1px solid ${C.border}`,
    animationDelay: "60ms"
  }}>
      {ranges.map(r => {
      const isActive = r === active;
      return <button key={r} onClick={() => onChange(r)} className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors duration-150" style={{
        background: isActive ? C.glossDark : "transparent",
        color: isActive ? C.onInk : C.sub,
        boxShadow: isActive ? C.shadow : "none"
      }}>
            {r}
          </button>;
    })}
    </div>;
}

/* ------------------------------------------------------------------ */
/* 3. Daily Timeline (drag-and-drop reorder)                           */
/* ------------------------------------------------------------------ */
function Pl_Timeline({
  range,
  dateKey
}) {
  const { entries, loading, error } = usePlanner(dateKey);
  const [items, setItems] = useState([]);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [dragOverId, setDragOverId] = useState(null);

  useEffect(() => {
    const statusMap = { Upcoming: "upcoming", "In Progress": "in-progress", Done: "done" };
    const withMinutes = entries.map(e => ({
      ...e,
      status: statusMap[e.status] || "upcoming",
      _start: Pl_parseTimeToMinutes(e.time)
    })).sort((a, b) => (a._start ?? 0) - (b._start ?? 0));
    let prevEnd = -Infinity;
    const withConflict = withMinutes.map(e => {
      const start = e._start ?? 0;
      const conflict = start < prevEnd;
      prevEnd = Math.max(prevEnd, start + Pl_parseDurationToMinutes(e.duration));
      return { ...e, conflict };
    });
    setItems(withConflict);
  }, [entries]);

  if (!dateKey) {
    return <Pl_Card className="p-6 lg:p-7 h-full flex flex-col items-center justify-center text-center" delay={100}>
        <CalendarDays size={22} color={C.faint} className="mb-3" />
        <p className="text-[13.5px]" style={{
        color: C.sub
      }}>
          {range} spans several days.
        </p>
        <p className="text-[12.5px] mt-1" style={{
        color: C.faint
      }}>
          Pick a day in Weekly Overview below to preview its schedule.
        </p>
      </Pl_Card>;
  }
  const handleDrop = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from === null || to === null || from === to) return;
    setItems(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    dragItem.current = null;
    dragOverItem.current = null;
    setDragOverId(null);
  };
  return <Pl_Card className="p-6 lg:p-7 h-full flex flex-col" delay={100}>
      <div className="flex items-center justify-between mb-5 shrink-0">
        <h3 className="text-[15px] font-semibold" style={{
        color: C.text
      }}>
          Daily Timeline
        </h3>
        <span className="text-[11.5px]" style={{
        color: C.faint
      }}>
          Drag to reschedule
        </span>
      </div>
      {loading && <div className="text-[13px]" style={{ color: C.faint }}>Loading…</div>}
      {error && <div className="text-[13px]" style={{ color: C.warn }}>{error}</div>}
      {!loading && !error && items.length === 0 && <div className="text-[13px] py-6 text-center" style={{ color: C.faint }}>Nothing planned for {range.toLowerCase()} yet.</div>}
      <div className="flex flex-col gap-1 overflow-y-auto">
        {items.map((item, i) => <div key={item.id} draggable onDragStart={() => dragItem.current = i} onDragEnter={() => {
        dragOverItem.current = i;
        setDragOverId(item.id);
      }} onDragEnd={handleDrop} onDragOver={e => e.preventDefault()} className="flex items-center gap-3 py-2.5 px-2 rounded-lg transition-colors duration-150" style={{
        borderBottom: `1px solid ${C.borderSoft}`,
        background: dragOverId === item.id ? C.cardMuted : "transparent",
        opacity: item.status === "done" ? 0.7 : 1,
        cursor: "grab"
      }}>
            <GripVertical size={14} color={C.faint} className="shrink-0" />
            <span className="text-[12.5px] w-12 shrink-0" style={{
          color: C.faint
        }}>
              {item.time}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] truncate" style={{
            color: item.status === "done" ? C.faint : C.text,
            textDecoration: item.status === "done" ? "line-through" : "none"
          }}>
                {item.title}
              </div>
              {item.conflict && <div className="flex items-center gap-1 mt-0.5" style={{
            color: C.warn
          }}>
                  <AlertTriangle size={11} />
                  <span className="text-[11px]">Overlaps with previous event</span>
                </div>}
            </div>
            <span className="text-[11.5px] w-14 text-right shrink-0" style={{
          color: C.faint
        }}>
              {item.duration}
            </span>
            <Pl_StatusBadge status={item.status} />
            <Pl_PriorityBadge priority={item.priority} />
          </div>)}
      </div>
    </Pl_Card>;
}

/* ------------------------------------------------------------------ */
/* 4. AI Planner Card                                                   */
/* ------------------------------------------------------------------ */
function Pl_AIPlannerCard({ dateKey }) {
  const { generate } = usePlanner(dateKey);
  const [blocks, setBlocks] = useState([]);
  const [applied, setApplied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);

  const runGenerate = () => {
    if (!dateKey) return;
    setGenerating(true);
    setGenError(null);
    setApplied(false);
    generate()
      .then(plan => setBlocks(plan))
      .catch(err => setGenError(err instanceof Error ? err.message : "Couldn't generate a plan"))
      .finally(() => setGenerating(false));
  };

  return <Pl_Card className="p-6 lg:p-7 h-full flex flex-col" delay={140}>
      <div className="flex items-center gap-2 mb-1 shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="pulse-ping absolute inline-flex h-full w-full rounded-full" style={{
          background: "rgba(13,13,12,0.35)"
        }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{
          background: C.ink
        }} />
        </span>
        <h3 className="text-[15px] font-semibold" style={{
        color: C.text
      }}>
          AI Planner
        </h3>
      </div>
      <p className="text-[12.5px] mb-5 shrink-0" style={{
      color: C.sub
    }}>
        Built from your tasks, deadlines, habits, and calendar.
      </p>

      <div className="flex flex-col gap-3 overflow-y-auto flex-1">
        {genError && <div className="text-[12.5px]" style={{ color: C.warn }}>{genError}</div>}
        {!genError && blocks.length === 0 && <p className="text-[12.5px]" style={{ color: C.faint }}>
            {generating ? "Generating your plan…" : "Generate an AI plan for today to see it here."}
          </p>}
        {blocks.map(b => <div key={b.id} className="p-3 rounded-lg" style={{
        background: C.cardMuted,
        border: `1px solid ${C.border}`
      }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-medium" style={{
            color: C.faint
          }}>
                {b.time}
              </span>
              <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full" style={{
            border: `1px solid ${C.divider}`,
            color: C.sub
          }}>
                {b.priority}
              </span>
            </div>
            <div className="text-[13.5px] font-medium mb-1" style={{
          color: C.text
        }}>
              {b.title}
            </div>
            <div className="text-[12px] leading-relaxed" style={{
          color: C.faint
        }}>
              {b.duration} · {b.status}
            </div>
          </div>)}
      </div>

      <div className="flex gap-2.5 mt-5 shrink-0">
        <button onClick={runGenerate} disabled={generating || !dateKey} className="flex-1 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150 flex items-center justify-center gap-1.5" style={{
        border: `1px solid ${C.divider}`,
        color: C.text
      }}>
          <RefreshCw size={13} className={generating ? "animate-spin" : ""} />
          {blocks.length ? "Regenerate Plan" : "Generate Plan"}
        </button>
        <button onClick={() => setApplied(true)} disabled={applied || blocks.length === 0} className={`flex-1 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 flex items-center justify-center gap-1.5 ${!applied ? "glitter-sm" : ""}`} style={{
        background: applied ? "transparent" : C.glossDark,
        color: applied ? C.faint : C.onInk,
        border: applied ? `1px solid ${C.divider}` : "1px solid transparent",
        boxShadow: applied ? "none" : `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`
      }}>
          {applied ? <Check size={13} /> : <Wand2 size={13} />}
          {applied ? "Plan applied" : "Apply Plan"}
        </button>
      </div>
    </Pl_Card>;
}

/* ------------------------------------------------------------------ */
/* 5. Priority Tasks (Task Card)                                       */
/* ------------------------------------------------------------------ */
function Pl_TaskCard({
  task
}) {
  return <div className="py-3 px-2 rounded-lg" style={{
    borderBottom: `1px solid ${C.borderSoft}`
  }}>
      <div className="flex items-center justify-between mb-2 gap-2">
        <span className="text-[13.5px] font-medium truncate" style={{
        color: C.text
      }}>
          {task.title}
        </span>
        <Pl_PriorityBadge priority={task.priority} />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full overflow-hidden" style={{
        background: C.borderSoft
      }}>
          <div className="h-full rounded-full bar-grow glitter-sm" style={{
          background: C.glossDark,
          "--w": `${task.progress}%`
        }} />
        </div>
        <span className="text-[11px] shrink-0" style={{
        color: C.faint
      }}>
          {task.progress}%
        </span>
      </div>
      <div className="text-[11px] mt-1.5" style={{
      color: C.faint
    }}>
        Due {task.due}
      </div>
    </div>;
}
function Pl_PriorityTasksCard() {
  const { tasks, loading } = useTasks();
  const priorityTasks = useMemo(() => {
    return tasks
      .filter(t => !t.done && (t.priority === "High" || t.priority === "Medium"))
      .sort((a, b) => (a.priority === b.priority ? 0 : a.priority === "High" ? -1 : 1))
      .slice(0, 5)
      .map(t => ({ id: t.id, title: t.title, due: t.time, priority: t.priority, progress: t.progress }));
  }, [tasks]);
  return <Pl_Card className="p-6 lg:p-7 h-full" delay={180}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold" style={{
        color: C.text
      }}>
          Priority Tasks
        </h3>
        <Target size={14} color={C.faint} />
      </div>
      <div className="flex flex-col">
        {!loading && priorityTasks.length === 0 && <p className="text-[12.5px]" style={{ color: C.faint }}>No high or medium priority tasks pending — nice work.</p>}
        {priorityTasks.map(t => <Pl_TaskCard key={t.id} task={t} />)}
      </div>
    </Pl_Card>;
}

/* ------------------------------------------------------------------ */
/* 6. Weekly Overview                                                   */
/* ------------------------------------------------------------------ */
function Pl_WeeklyOverview() {
  const today = useMemo(() => new Date(), []);
  const weekStart = useMemo(() => Pl_startOfWeekMon(today), [today]);
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const todayName = dayNames[(today.getDay() + 6) % 7];
  const [selected, setSelected] = useState(todayName);
  const [weekData, setWeekData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const days = Array.from({ length: 7 }, (_, i) => Pl_addDays(weekStart, i));
    Promise.all(days.map(d => getPlannerEntries(Pl_fmtKey(d)).catch(() => [])))
      .then(results => {
        if (cancelled) return;
        setWeekData(days.map((d, i) => ({
          day: dayNames[i],
          date: d.getDate(),
          dateKey: Pl_fmtKey(d),
          tasks: results[i].length,
          completed: results[i].filter(e => e.status === "Done").length,
          events: results[i].length,
          today: Pl_fmtKey(d) === Pl_fmtKey(today),
          preview: results[i]
            .slice()
            .sort((a, b) => (Pl_parseTimeToMinutes(a.time) ?? 0) - (Pl_parseTimeToMinutes(b.time) ?? 0))
            .map(e => `${e.time} ${e.title}`),
        })));
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [weekStart]);

  const rangeLabel = `${weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${Pl_addDays(weekStart, 6).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  const selectedDay = weekData.find(d => d.day === selected);

  return <Pl_Card className="p-6 lg:p-7 h-full" delay={200}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold" style={{
        color: C.text
      }}>
          Weekly Overview
        </h3>
        <span className="text-[11.5px]" style={{
        color: C.faint
      }}>
          {rangeLabel}
        </span>
      </div>

      {loading ? <div className="text-[13px] mb-5" style={{ color: C.faint }}>Loading this week…</div> : <div className="grid grid-cols-7 gap-2 mb-5">
        {weekData.map(d => {
        const isSelected = d.day === selected;
        return <button key={d.day} onClick={() => setSelected(d.day)} className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-colors duration-150" style={{
          background: isSelected ? C.glossDark : "transparent",
          border: `1px solid ${isSelected ? "transparent" : C.borderSoft}`
        }}>
              <span className="text-[10.5px] font-medium" style={{
            color: isSelected ? C.onInkSub : C.faint
          }}>
                {d.day}
              </span>
              <span className="text-[14px] font-semibold" style={{
            color: isSelected ? C.onInk : C.text
          }}>
                {d.date}
              </span>
              <span className="text-[9.5px] mt-1" style={{
            color: isSelected ? C.onInkSub : C.faint
          }}>
                {d.completed}/{d.tasks}
              </span>
              {d.today && !isSelected && <span className="w-1 h-1 rounded-full" style={{
            background: C.ink
          }} />}
            </button>;
      })}
      </div>}

      <div className="p-4 rounded-lg" style={{
      background: C.cardMuted,
      border: `1px solid ${C.border}`
    }}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[13px] font-medium" style={{
          color: C.text
        }}>
            {selected} day preview
          </span>
          <span className="text-[11.5px]" style={{
          color: C.faint
        }}>
            {selectedDay?.events ?? 0} events
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {(selectedDay?.preview || []).length === 0 && <div className="text-[12.5px]" style={{ color: C.faint }}>No events planned.</div>}
          {(selectedDay?.preview || []).map((line, i) => <div key={i} className="text-[12.5px]" style={{
          color: C.sub
        }}>
              {line}
            </div>)}
        </div>
      </div>
    </Pl_Card>;
}

/* ------------------------------------------------------------------ */
/* 7. Upcoming Deadlines (Deadline Card)                                */
/* ------------------------------------------------------------------ */
function Pl_DeadlineCard({
  deadline
}) {
  const urgent = deadline.daysLeft <= 3;
  return <div className="flex items-center gap-3 py-3 px-2" style={{
    borderBottom: `1px solid ${C.borderSoft}`
  }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[12px] font-semibold" style={{
      background: urgent ? C.warnBg : C.cardMuted,
      color: urgent ? C.warn : C.sub,
      border: `1px solid ${urgent ? "transparent" : C.border}`
    }}>
        {deadline.daysLeft}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-medium truncate" style={{
        color: C.text
      }}>
          {deadline.project}
        </div>
        <div className="text-[11.5px]" style={{
        color: C.faint
      }}>
          Due {deadline.due}
        </div>
      </div>
      {urgent && <span className="flex items-center gap-1 text-[11px] shrink-0" style={{
      color: C.warn
    }}>
          <AlertTriangle size={11} />
          Soon
        </span>}
    </div>;
}
function Pl_DeadlinesCard() {
  const { goals, loading } = useGoals();
  const deadlines = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return goals
      .filter(g => !g.archived && g.status !== "Completed")
      .map(g => {
        const target = new Date(g.targetDate);
        const daysLeft = Math.round((target.getTime() - today.getTime()) / 86400000);
        return {
          id: g.id,
          project: g.title,
          due: isNaN(target.getTime()) ? g.targetDate : target.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          daysLeft,
        };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 5);
  }, [goals]);
  return <Pl_Card className="p-6 lg:p-7 h-full" delay={240}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[15px] font-semibold" style={{
        color: C.text
      }}>
          Upcoming Deadlines
        </h3>
        <button className="text-[12px] flex items-center gap-1" style={{
        color: C.faint
      }}>
          View all <ChevronRight size={13} />
        </button>
      </div>
      <div className="flex flex-col">
        {!loading && deadlines.length === 0 && <p className="text-[12.5px] py-3" style={{ color: C.faint }}>No upcoming goal deadlines.</p>}
        {deadlines.map(d => <Pl_DeadlineCard key={d.id} deadline={d} />)}
      </div>
    </Pl_Card>;
}

/* ------------------------------------------------------------------ */
/* 8. Quick Notes                                                       */
/* ------------------------------------------------------------------ */
function Pl_NotesCard() {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("cortex_planner_notes");
      setNotes(saved ? JSON.parse(saved) : []);
    } catch {
      setNotes([]);
    }
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem("cortex_planner_notes", JSON.stringify(notes));
    } catch {
      /* ignore persistence errors */
    }
  }, [notes]);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const createNote = () => {
    const id = `n${Date.now()}`;
    setNotes(prev => [{
      id,
      text: ""
    }, ...prev]);
    setEditingId(id);
    setDraft("");
  };
  const startEdit = note => {
    setEditingId(note.id);
    setDraft(note.text);
  };
  const saveEdit = id => {
    setNotes(prev => prev.map(n => n.id === id ? {
      ...n,
      text: draft
    } : n));
    setEditingId(null);
  };
  const deleteNote = id => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (editingId === id) setEditingId(null);
  };
  return <Pl_Card className="p-6 lg:p-7 h-full flex flex-col" delay={280}>
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-[15px] font-semibold" style={{
        color: C.text
      }}>
          Quick Notes
        </h3>
        <button onClick={createNote} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150" style={{
        border: `1px solid ${C.divider}`
      }} aria-label="Create note">
          <Plus size={14} color={C.text} />
        </button>
      </div>

      <div className="flex flex-col gap-2.5 overflow-y-auto flex-1">
        {notes.length === 0 && <p className="text-[12.5px]" style={{
        color: C.faint
      }}>
            No notes yet — add one to jot down anything on your mind.
          </p>}
        {notes.map(n => <div key={n.id} className="p-3 rounded-lg" style={{
        background: C.cardMuted,
        border: `1px solid ${C.border}`
      }}>
            {editingId === n.id ? <div className="flex flex-col gap-2">
                <textarea autoFocus value={draft} onChange={e => setDraft(e.target.value)} rows={2} className="text-[12.5px] w-full resize-none outline-none rounded-md p-2" style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            color: C.text
          }} placeholder="Write a note…" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setEditingId(null)} className="text-[12px] px-2.5 py-1 rounded-md" style={{
              color: C.faint
            }}>
                    Cancel
                  </button>
                  <button onClick={() => saveEdit(n.id)} className="text-[12px] px-2.5 py-1 rounded-md font-medium" style={{
              background: C.glossDark,
              color: C.onInk
            }}>
                    Save
                  </button>
                </div>
              </div> : <div className="flex items-start justify-between gap-2">
                <p className="text-[12.5px] leading-relaxed flex-1" style={{
            color: C.text
          }}>
                  {n.text || <span style={{
              color: C.faint
            }}>Empty note</span>}
                </p>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEdit(n)} className="w-6 h-6 rounded-md flex items-center justify-center" style={{
              color: C.faint
            }} aria-label="Edit note">
                    <Edit3 size={13} />
                  </button>
                  <button onClick={() => deleteNote(n.id)} className="w-6 h-6 rounded-md flex items-center justify-center" style={{
              color: C.faint
            }} aria-label="Delete note">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>}
          </div>)}
      </div>
    </Pl_Card>;
}

/* ------------------------------------------------------------------ */
/* 9. Progress Summary                                                  */
/* ------------------------------------------------------------------ */
function Pl_ProgressSummary({ dateKey }) {
  const { entries } = usePlanner(dateKey);
  const { tasks } = useTasks();
  const { habits } = useHabits();
  const { data } = useDashboard();

  const todaysTasks = useMemo(() => tasks.filter(t => t.date === "Today"), [tasks]);
  const tasksDone = todaysTasks.filter(t => t.done).length;

  const focusMinutes = useMemo(() => entries
    .filter(e => e.status === "Done" || e.status === "In Progress")
    .reduce((sum, e) => sum + Pl_parseDurationToMinutes(e.duration), 0), [entries]);
  const focusHours = (focusMinutes / 60).toFixed(1);

  const todayName = new Date().toLocaleDateString(undefined, { weekday: "short" });
  const todaysProductivity = data?.productivity?.find(p => p.day === todayName)?.value;

  const habitsDone = habits.filter(h => h.doneToday).length;

  const stats = [{
    label: "Tasks Completed",
    value: `${tasksDone} / ${todaysTasks.length}`,
    sub: `${Math.max(todaysTasks.length - tasksDone, 0)} remaining today`
  }, {
    label: "Focus Time",
    value: `${focusHours}h`,
    sub: "From today's planned blocks"
  }, {
    label: "Productivity Score",
    value: todaysProductivity !== undefined ? `${todaysProductivity}%` : "—",
    sub: "From this week's trend"
  }, {
    label: "Habit Completion",
    value: `${habitsDone} / ${habits.length}`,
    sub: habits.length ? "Keep the streak going" : "No habits yet"
  }];

  return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      {stats.map((s, i) => <Pl_Card key={s.label} className="p-5" delay={320 + i * 40}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12.5px]" style={{
          color: C.faint
        }}>
              {s.label}
            </span>
            <TrendingUp size={13} color={C.faint} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[26px] font-semibold tracking-tight" style={{
          color: C.text
        }}>
              {s.value}
            </span>
          </div>
          <div className="text-[11.5px] mt-2" style={{
        color: C.faint
      }}>
            {s.sub}
          </div>
        </Pl_Card>)}
    </div>;
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */
export function PlannerBody() {
  const [range, setRange] = useState("Today");
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => Pl_fmtKey(today), [today]);
  const tomorrowKey = useMemo(() => Pl_fmtKey(Pl_addDays(today, 1)), [today]);
  const dateKey = range === "Today" ? todayKey : range === "Tomorrow" ? tomorrowKey : null;
  const { entries: todaysEntries } = usePlanner(todayKey);
  const { tasks } = useTasks();
  const taskCount = tasks.filter(t => t.date === "Today").length;
  return <>
        <Pl_PlannerHeader taskCount={taskCount} eventCount={todaysEntries.length} />
        <Pl_PlannerNav active={range} onChange={setRange} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mb-6 items-stretch">
          <Pl_Timeline range={range} dateKey={dateKey} />
          <Pl_AIPlannerCard dateKey={dateKey || todayKey} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 mb-6 items-stretch">
          <Pl_PriorityTasksCard />
          <Pl_WeeklyOverview />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-stretch">
          <Pl_DeadlinesCard />
          <Pl_NotesCard />
        </div>

        <Pl_ProgressSummary dateKey={todayKey} />
      </>;
}

export default PlannerBody;
