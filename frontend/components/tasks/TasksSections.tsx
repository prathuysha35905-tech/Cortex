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
import { useTasks } from "@/hooks/useTasks";

/* ==================================================================== */
/* Tasks                                                                  */
/* ==================================================================== */

/* ------------------------------------------------------------------ */
/* Task data now comes from useTasks() (real Cortex TaskResponse API). */
/* ------------------------------------------------------------------ */
// AI suggestions are now derived from real tasks in Tk_AiSuggestionsPanel.
function Tk_PriorityBadge({
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
  return <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full tracking-wide inline-block ${priority === "High" ? "glitter-sm" : ""}`} style={styles[priority]}>
      {priority}
    </span>;
}

/* ------------------------------------------------------------------ */
/* Sidebar — deepest ink shade, anchors the light canvas                */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Priority → dot color, used on the task's left accent + filter chips */
/* ------------------------------------------------------------------ */
const Tk_PRIORITY_DOT = {
  High: C.ink,
  Medium: C.sub,
  Low: C.divider
};
const Tk_CATEGORY_OPTIONS = ["Work", "Engineering", "Meetings", "Learning", "Personal"];
const Tk_PRIORITY_OPTIONS = ["High", "Medium", "Low"];
const Tk_STATUS_OPTIONS = ["Completed", "Pending", "Overdue"];
const Tk_DEADLINE_OPTIONS = ["Today", "Tomorrow", "This week", "Overdue"];

/* ------------------------------------------------------------------ */
/* Search bar — standalone, reusable                                    */
/* ------------------------------------------------------------------ */
function Tk_SearchBar({
  value,
  onChange,
  placeholder = "Search tasks…",
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

/* ------------------------------------------------------------------ */
/* Page header — title, search, add task                               */
/* ------------------------------------------------------------------ */
function Tk_TasksHeader({
  search,
  onSearch,
  onAddTask
}) {
  return <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-7 fade-up" style={{
    animationDelay: "20ms"
  }}>
      <div>
        <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-tight leading-tight" style={{
        color: C.text
      }}>
          <span className="font-display text-[38px] sm:text-[44px] font-normal align-middle">Tasks</span>
        </h1>
        <p className="text-[13.5px] mt-1" style={{
        color: C.sub
      }}>
          10 tasks total · 3 due today
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Tk_SearchBar value={search} onChange={onSearch} className="w-full sm:w-[260px]" />
        <button onClick={onAddTask} className="glossy-btn glitter-sm flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13.5px] font-medium shrink-0 transition-transform duration-150 hover:-translate-y-0.5" style={{
        background: C.glossDark,
        color: C.onInk,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`
      }}>
          <Plus size={15} strokeWidth={2} />
          Add Task
        </button>
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Category tabs                                                       */
/* ------------------------------------------------------------------ */
function Tk_TaskCategories({
  counts,
  active,
  onChange
}) {
  const cats = [{
    key: "All",
    label: "All"
  }, {
    key: "Today",
    label: "Today"
  }, {
    key: "Upcoming",
    label: "Upcoming"
  }, {
    key: "Completed",
    label: "Completed"
  }, {
    key: "Overdue",
    label: "Overdue"
  }];
  return <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 fade-up justify-end" style={{
    animationDelay: "60ms"
  }}>
      {[...cats].reverse().map(c => {
      const isActive = active === c.key;
      return <button key={c.key} onClick={() => onChange(c.key)} className="cat-pill flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium shrink-0" style={{
        background: isActive ? C.cardMuted : C.card,
        color: C.text,
        border: `1px solid ${isActive ? C.ink : C.border}`,
        boxShadow: C.shadow
      }}>
            {c.label}
            <span className="text-[11px] px-1.5 py-0.5 rounded-full" style={{
          background: isActive ? C.ink : C.borderSoft,
          color: isActive ? C.onInk : C.faint
        }}>
              {counts[c.key] ?? 0}
            </span>
          </button>;
    })}
    </div>;
}

/* ------------------------------------------------------------------ */
/* Filters — priority / category / deadline / status                   */
/* ------------------------------------------------------------------ */
function Tk_FilterDropdown({
  label,
  options,
  selected,
  onToggle,
  icon: Icon,
  align = "left"
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const hasSelection = selected.length > 0;
  React.useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  return <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="icon-btn flex items-center gap-2 px-3 py-2 rounded-lg text-[12.5px] font-medium" style={{
      border: `1px solid ${hasSelection ? C.ink : C.border}`,
      background: hasSelection ? C.cardMuted : C.card,
      color: C.text
    }}>
        <Icon size={13} color={C.sub} strokeWidth={1.75} />
        {label}
        {hasSelection && <span className="text-[10.5px] w-4 h-4 rounded-full flex items-center justify-center" style={{
        background: C.ink,
        color: C.onInk
      }}>
            {selected.length}
          </span>}
        <ChevronDown size={12} color={C.faint} />
      </button>
      {open && <div className={`panel-drop absolute z-20 mt-2 min-w-[170px] rounded-xl p-1.5 ${align === "right" ? "right-0" : "left-0"}`} style={{
      background: C.glossCard,
      border: `1px solid ${C.border}`,
      boxShadow: C.shadowLift
    }}>
          {options.map(opt => {
        const isChecked = selected.includes(opt);
        return <button key={opt} onClick={() => onToggle(opt)} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] text-left" style={{
          color: C.text
        }} onMouseEnter={e => e.currentTarget.style.background = C.cardMuted} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span className="w-[15px] h-[15px] rounded-[4px] flex items-center justify-center shrink-0" style={{
            border: `1px solid ${isChecked ? "#000" : C.divider}`,
            background: isChecked ? C.glossDark : "transparent"
          }}>
                  {isChecked && <Check size={10} color={C.onInk} strokeWidth={3} />}
                </span>
                {opt}
              </button>;
      })}
        </div>}
    </div>;
}
function Tk_TaskFilters({
  filters,
  onToggle,
  onClear
}) {
  const totalActive = filters.priority.length + filters.category.length + filters.deadline.length + filters.status.length;
  return <div className="flex items-center gap-2.5 flex-wrap mb-5 fade-up justify-end" style={{
    animationDelay: "90ms"
  }}>
      {totalActive > 0 && <button onClick={onClear} className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-[12.5px] font-medium" style={{
      color: C.sub
    }}>
          <X size={12} />
          Clear all
        </button>}
      <Tk_FilterDropdown label="Status" icon={CheckSquare} options={Tk_STATUS_OPTIONS} selected={filters.status} onToggle={v => onToggle("status", v)} />
      <Tk_FilterDropdown label="Deadline" icon={CalendarClock} options={Tk_DEADLINE_OPTIONS} selected={filters.deadline} onToggle={v => onToggle("deadline", v)} />
      <Tk_FilterDropdown label="Category" icon={ListChecks} options={Tk_CATEGORY_OPTIONS} selected={filters.category} onToggle={v => onToggle("category", v)} align="right" />
      <Tk_FilterDropdown label="Priority" icon={CircleAlert} options={Tk_PRIORITY_OPTIONS} selected={filters.priority} onToggle={v => onToggle("priority", v)} align="right" />
      <div className="flex items-center gap-1.5 text-[12.5px] font-medium ml-1" style={{
      color: C.faint
    }}>
        <Filter size={13} strokeWidth={1.75} />
        Filters
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Quick actions bar                                                    */
/* ------------------------------------------------------------------ */
function Tk_QuickActions({
  onAddTask,
  onSort,
  sortLabel,
  onArchive
}) {
  const actions = [{
    label: "Import Tasks",
    icon: Upload
  }, {
    label: "Generate with AI",
    icon: Wand2
  }, {
    label: sortLabel,
    icon: ArrowUpDown,
    onClick: onSort
  }, {
    label: "Archive Completed",
    icon: Archive,
    onClick: onArchive
  }];
  return <div className="flex items-center gap-2.5 flex-wrap mb-6 lg:mb-7 fade-up justify-end" style={{
    animationDelay: "110ms"
  }}>
      {[...actions].reverse().map(a => {
      const Icon = a.icon;
      return <button key={a.label} onClick={a.onClick} className="icon-btn flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[12.5px] font-medium" style={{
        border: `1px solid ${C.border}`,
        background: C.card,
        color: C.text,
        boxShadow: C.shadow
      }}>
            <Icon size={13.5} strokeWidth={1.75} />
            {a.label}
          </button>;
    })}
    </div>;
}

/* ------------------------------------------------------------------ */
/* AI Suggestions                                                       */
/* ------------------------------------------------------------------ */
function Tk_AiSuggestionCard({
  suggestion,
  delay
}) {
  const [applied, setApplied] = useState(false);
  const Icon = suggestion.icon;
  return <Card className="p-5 flex flex-col" delay={delay}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{
        background: C.cardMuted,
        border: `1px solid ${C.border}`
      }}>
          <Icon size={15} color={C.text} strokeWidth={1.75} />
        </div>
        <div>
          <div className="text-[13px] font-semibold" style={{
          color: C.text
        }}>
            {suggestion.title}
          </div>
        </div>
      </div>
      <p className="text-[12.5px] leading-relaxed mb-4 flex-1" style={{
      color: C.sub
    }}>
        {suggestion.text}
      </p>
      <button onClick={() => setApplied(true)} disabled={applied} className={`px-3.5 py-2 rounded-lg text-[12px] font-medium self-start transition-all duration-150 ${!applied ? "glitter-sm" : ""}`} style={{
      background: applied ? "transparent" : C.glossDark,
      color: applied ? C.faint : C.onInk,
      border: applied ? `1px solid ${C.divider}` : "1px solid transparent"
    }}>
        {applied ? "Applied" : suggestion.action}
      </button>
    </Card>;
}
function Tk_AiSuggestionsPanel({ tasks }) {
  const suggestions = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    const list = [];

    const topOverdue = [...tasks].filter(t => t.overdue && !t.done).sort((a, b) => (a.priority === "High" ? -1 : 1))[0];
    if (topOverdue) {
      list.push({
        id: "priority",
        type: "priority",
        icon: Zap,
        title: "Do this first",
        text: `"${topOverdue.title}" is overdue — tackle it before anything else today.`,
        action: "Start task"
      });
    }

    const safeToPostpone = [...tasks].find(t => !t.done && !t.overdue && t.priority === "Low");
    if (safeToPostpone) {
      list.push({
        id: "postpone",
        type: "postpone",
        icon: Hourglass,
        title: "Safe to postpone",
        text: `"${safeToPostpone.title}" is low priority with no urgency — safe to push to later this week.`,
        action: "Reschedule"
      });
    }

    const byCategory = {};
    tasks.filter(t => !t.done).forEach(t => { (byCategory[t.category] ||= []).push(t); });
    const batchable = Object.entries(byCategory).find(([, list]) => list.length >= 2);
    if (batchable) {
      const [category, group] = batchable;
      list.push({
        id: "time",
        type: "time",
        icon: Sparkles,
        title: "Time-saving suggestion",
        text: `Group "${group[0].title}" and "${group[1].title}" — both are ${category} context, saving time on switching.`,
        action: "Batch tasks"
      });
    }

    const todayCount = tasks.filter(t => t.date === "Today" && !t.done).length;
    if (todayCount >= 3) {
      list.push({
        id: "workload",
        type: "workload",
        icon: BarChart3,
        title: "Workload check",
        text: `You have ${todayCount} open tasks today. Consider moving lower-priority ones to tomorrow.`,
        action: "Rebalance day"
      });
    }

    return list.slice(0, 4);
  }, [tasks]);

  if (suggestions.length === 0) return null;
  return <div className="mb-6 lg:mb-8">
      <div className="flex items-center gap-2 mb-4 fade-up" style={{
      animationDelay: "130ms"
    }}>
        <span className="relative flex h-2 w-2">
          <span className="pulse-ping absolute inline-flex h-full w-full rounded-full" style={{
          background: "rgba(13,13,12,0.35)"
        }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{
          background: C.ink
        }} />
        </span>
        <h2 className="text-[15px] font-semibold" style={{
        color: C.text
      }}>
          AI Suggestions
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
        {suggestions.map((s, i) => <Tk_AiSuggestionCard key={s.id} suggestion={s} delay={150 + i * 40} />)}
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Productivity summary                                                 */
/* ------------------------------------------------------------------ */
function Tk_SummaryCards({
  tasks
}) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.done).length;
  const overdue = tasks.filter(t => t.overdue && !t.done).length;
  const pending = total - completed;
  const rate = total ? Math.round(completed / total * 100) : 0;
  const stats = [{
    label: "Total Tasks",
    value: total,
    icon: ListChecks
  }, {
    label: "Completed",
    value: completed,
    icon: Check
  }, {
    label: "Pending",
    value: pending,
    icon: Clock
  }, {
    label: "Overdue",
    value: overdue,
    icon: AlertTriangle
  }];
  return <div className="mb-6 lg:mb-8">
      <h2 className="text-[15px] font-semibold mb-4 fade-up" style={{
      color: C.text,
      animationDelay: "310ms"
    }}>
        Productivity Summary
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
        {stats.map((s, i) => {
        const Icon = s.icon;
        return <Card key={s.label} className="p-5" delay={330 + i * 30}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px]" style={{
              color: C.faint
            }}>
                  {s.label}
                </span>
                <Icon size={14} color={C.sub} strokeWidth={1.75} />
              </div>
              <span className="text-[26px] font-semibold tracking-tight" style={{
            color: C.text
          }}>
                {s.value}
              </span>
            </Card>;
      })}
        <Card className="p-5" delay={330 + 4 * 30}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px]" style={{
            color: C.faint
          }}>
              Completion Rate
            </span>
            <TrendingUp size={14} color={C.sub} strokeWidth={1.75} />
          </div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-[26px] font-semibold tracking-tight" style={{
            color: C.text
          }}>
              {rate}
            </span>
            <span className="text-[13px]" style={{
            color: C.sub
          }}>
              %
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{
          background: C.borderSoft
        }}>
            <div className="h-full rounded-full bar-grow glitter-sm" style={{
            background: C.glossDark,
            "--w": `${rate}%`
          }} />
          </div>
        </Card>
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Task card / row                                                      */
/* ------------------------------------------------------------------ */
function Tk_TaskCard({
  task,
  onToggleDone,
  onDelete,
  onDuplicate,
  onEdit,
  dragHandlers,
  isDragging,
  isDragOver
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  React.useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  return <div {...dragHandlers} className={`task-row fade-up flex items-start gap-3 p-4 rounded-xl relative ${isDragging ? "dragging" : ""} ${isDragOver ? "drag-over" : ""}`} style={{
    background: C.card,
    border: `1px solid ${C.border}`,
    boxShadow: C.shadow
  }}>
      <span className="drag-handle mt-1 shrink-0" style={{
      color: C.faint
    }} aria-label="Drag to reorder">
        <GripVertical size={15} />
      </span>

      <button onClick={() => onToggleDone(task.id)} className={`mt-0.5 w-[19px] h-[19px] rounded-md flex items-center justify-center shrink-0 transition-colors ${task.done ? "glitter-sm" : ""}`} style={{
      border: `1px solid ${task.done ? "#000" : C.divider}`,
      background: task.done ? C.glossDark : "transparent"
    }} aria-label="Toggle complete">
        {task.done && <Check size={12} color={C.onInk} strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13.5px] font-medium" style={{
              color: task.done ? C.faint : C.text,
              textDecoration: task.done ? "line-through" : "none"
            }}>
                {task.title}
              </span>
              {task.overdue && !task.done && <span className="flex items-center gap-1 text-[10.5px] font-medium px-1.5 py-0.5 rounded-full" style={{
              background: "#3A1414",
              color: "#F4B8B8"
            }}>
                  <AlertTriangle size={9} />
                  Overdue
                </span>}
            </div>
            <p className="text-[12.5px] mt-1 leading-snug" style={{
            color: task.done ? C.faint : C.sub
          }}>
              {task.description}
            </p>

            <div className="flex items-center gap-3 flex-wrap mt-2.5">
              <span className="flex items-center gap-1 text-[11.5px]" style={{
              color: C.faint
            }}>
                <CalendarDays size={12} />
                {task.date} · {task.time}
              </span>
              <span className="flex items-center gap-1 text-[11.5px]" style={{
              color: C.faint
            }}>
                <Clock size={12} />
                {task.duration}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{
              background: C.cardMuted,
              color: C.sub,
              border: `1px solid ${C.borderSoft}`
            }}>
                {task.category}
              </span>
              <Tk_PriorityBadge priority={task.priority} />
            </div>

            {!task.done && <div className="flex items-center gap-2 mt-3 max-w-[220px]">
                <div className="h-1.5 rounded-full overflow-hidden flex-1" style={{
              background: C.borderSoft
            }}>
                  <div className="h-full rounded-full" style={{
                background: C.glossDark,
                width: `${task.progress}%`,
                transition: "width 400ms ease"
              }} />
                </div>
                <span className="text-[11px] shrink-0" style={{
              color: C.faint
            }}>
                  {task.progress}%
                </span>
              </div>}
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button onClick={() => setMenuOpen(o => !o)} className="icon-btn w-7 h-7 rounded-lg flex items-center justify-center" style={{
            color: C.faint
          }} aria-label="Task actions">
              <MoreHorizontal size={15} />
            </button>
            {menuOpen && <div className="panel-drop absolute right-0 z-20 mt-1 min-w-[150px] rounded-xl p-1.5" style={{
            background: C.glossCard,
            border: `1px solid ${C.border}`,
            boxShadow: C.shadowLift
          }}>
                {[{
              label: "Edit",
              icon: Pencil,
              onClick: () => onEdit(task.id)
            }, {
              label: "Duplicate",
              icon: Copy,
              onClick: () => onDuplicate(task.id)
            }, {
              label: task.done ? "Mark incomplete" : "Mark complete",
              icon: Check,
              onClick: () => onToggleDone(task.id)
            }, {
              label: "Delete",
              icon: Trash2,
              onClick: () => onDelete(task.id),
              danger: true
            }].map(item => {
              const ItemIcon = item.icon;
              return <button key={item.label} onClick={() => {
                item.onClick();
                setMenuOpen(false);
              }} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] text-left" style={{
                color: item.danger ? "#B84545" : C.text
              }} onMouseEnter={e => e.currentTarget.style.background = C.cardMuted} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <ItemIcon size={13} strokeWidth={1.75} />
                      {item.label}
                    </button>;
            })}
              </div>}
          </div>
        </div>
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Task list — owns drag & drop reordering                             */
/* ------------------------------------------------------------------ */
function Tk_TaskList({
  tasks,
  onReorder,
  onToggleDone,
  onDelete,
  onDuplicate,
  onEdit
}) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  if (tasks.length === 0) {
    return <div className="flex flex-col items-center justify-center text-center py-16 rounded-xl fade-up" style={{
      border: `1px dashed ${C.divider}`,
      background: C.cardMuted
    }}>
        <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3" style={{
        background: C.card,
        border: `1px solid ${C.border}`
      }}>
          <ListChecks size={18} color={C.faint} />
        </div>
        <p className="text-[13.5px] font-medium" style={{
        color: C.text
      }}>
          No tasks match these filters
        </p>
        <p className="text-[12.5px] mt-1" style={{
        color: C.faint
      }}>
          Try clearing a filter or searching something else.
        </p>
      </div>;
  }
  return <div className="flex flex-col gap-3">
      {tasks.map((task, i) => <Tk_TaskCard key={task.id} task={task} onToggleDone={onToggleDone} onDelete={onDelete} onDuplicate={onDuplicate} onEdit={onEdit} isDragging={dragIndex === i} isDragOver={overIndex === i && dragIndex !== i} dragHandlers={{
      draggable: true,
      onDragStart: () => setDragIndex(i),
      onDragEnter: () => setOverIndex(i),
      onDragOver: e => e.preventDefault(),
      onDragEnd: () => {
        if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
          onReorder(dragIndex, overIndex);
        }
        setDragIndex(null);
        setOverIndex(null);
      }
    }} />)}
    </div>;
}

/* ------------------------------------------------------------------ */
/* Full Tasks page composition                                          */
/* ------------------------------------------------------------------ */
export function TasksBody() {
  const { tasks, loading, error, add, update, toggleDone: toggleDoneRemote, remove } = useTasks();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);
  const [filters, setFilters] = useState({
    priority: [],
    category: [],
    deadline: [],
    status: []
  });
  // Backend has no manual ordering endpoint, so drag-reorder / sort-by-priority
  // are tracked locally as a display order layered on top of the real tasks.
  const [order, setOrder] = useState([]);
  useEffect(() => {
    setOrder(prev => {
      const known = new Set(prev);
      const stillValid = prev.filter(id => tasks.some(t => t.id === id));
      const added = tasks.map(t => t.id).filter(id => !known.has(id));
      return [...added, ...stillValid];
    });
  }, [tasks]);
  const orderedTasks = useMemo(() => {
    const map = new Map(tasks.map(t => [t.id, t]));
    return order.map(id => map.get(id)).filter(Boolean);
  }, [order, tasks]);
  const counts = useMemo(() => ({
    All: orderedTasks.length,
    Today: orderedTasks.filter(t => t.date === "Today").length,
    Upcoming: orderedTasks.filter(t => ["Tomorrow", "Fri, Aug 1"].includes(t.date) && !t.done).length,
    Completed: orderedTasks.filter(t => t.done).length,
    Overdue: orderedTasks.filter(t => t.overdue && !t.done).length
  }), [orderedTasks]);
  const toggleFilter = (group, value) => {
    setFilters(prev => {
      const set = new Set(prev[group]);
      set.has(value) ? set.delete(value) : set.add(value);
      return {
        ...prev,
        [group]: Array.from(set)
      };
    });
  };
  const clearFilters = () => setFilters({
    priority: [],
    category: [],
    deadline: [],
    status: []
  });
  const filteredTasks = useMemo(() => {
    let list = [...orderedTasks];
    if (category === "Today") list = list.filter(t => t.date === "Today");else if (category === "Upcoming") list = list.filter(t => ["Tomorrow", "Fri, Aug 1"].includes(t.date) && !t.done);else if (category === "Completed") list = list.filter(t => t.done);else if (category === "Overdue") list = list.filter(t => t.overdue && !t.done);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    if (filters.priority.length) list = list.filter(t => filters.priority.includes(t.priority));
    if (filters.category.length) list = list.filter(t => filters.category.includes(t.category));
    if (filters.deadline.length) list = list.filter(t => {
      if (filters.deadline.includes("Overdue") && t.overdue && !t.done) return true;
      return filters.deadline.includes(t.date);
    });
    if (filters.status.length) list = list.filter(t => {
      if (filters.status.includes("Completed") && t.done) return true;
      if (filters.status.includes("Pending") && !t.done && !t.overdue) return true;
      if (filters.status.includes("Overdue") && t.overdue && !t.done) return true;
      return false;
    });
    return list;
  }, [orderedTasks, category, search, filters]);
  const toggleDone = id => {
    const t = tasks.find(t => t.id === id);
    if (!t) return;
    toggleDoneRemote(id, !t.done).catch(() => {});
  };
  const deleteTask = id => {
    setOrder(prev => prev.filter(oid => oid !== id));
    remove(id).catch(() => {});
  };
  const duplicateTask = id => {
    const t = tasks.find(t => t.id === id);
    if (!t) return;
    add({
      title: `${t.title} (copy)`,
      description: t.description,
      date: t.date,
      time: t.time,
      priority: t.priority,
      category: t.category,
      duration: t.duration
    }).catch(() => {});
  };
  const editTask = () => {
    /* Editing opens a form in the full product — omitted here. */
  };
  const addTask = () => {
    add({
      title: "New task",
      description: "Add a description…",
      date: "Today",
      time: "5:00 PM",
      priority: "Medium",
      category: "Work",
      duration: "30 min"
    }).catch(() => {});
  };
  const reorder = (from, to) => {
    setOrder(prev => {
      // Reorder within the currently filtered view, mapped back to the full order.
      const ids = filteredTasks.map(t => t.id);
      const [movedId] = ids.splice(from, 1);
      ids.splice(to, 0, movedId);
      const visibleSet = new Set(ids);
      const reorderedVisible = [...ids];
      let vi = 0;
      return prev.map(id => visibleSet.has(id) ? reorderedVisible[vi++] : id);
    });
  };
  const sortTasks = () => {
    setSortAsc(prevAsc => {
      const rank = {
        High: 0,
        Medium: 1,
        Low: 2
      };
      setOrder(prev => {
        const map = new Map(tasks.map(t => [t.id, t]));
        return [...prev].sort((a, b) => {
          const ta = map.get(a), tb = map.get(b);
          if (!ta || !tb) return 0;
          return prevAsc ? rank[ta.priority] - rank[tb.priority] : rank[tb.priority] - rank[ta.priority];
        });
      });
      return !prevAsc;
    });
  };
  const archiveCompleted = () => {
    const done = tasks.filter(t => t.done);
    setOrder(prev => prev.filter(id => !done.some(t => t.id === id)));
    done.forEach(t => remove(t.id).catch(() => {}));
  };
  if (loading) return <Loader label="Loading your tasks…" />;
  if (error) return <EmptyState title="Couldn't load tasks" description={error} />;
  return <>
      <Tk_TasksHeader search={search} onSearch={setSearch} onAddTask={addTask} />
      <Tk_TaskCategories counts={counts} active={category} onChange={setCategory} />
      <Tk_TaskFilters filters={filters} onToggle={toggleFilter} onClear={clearFilters} />
      <Tk_QuickActions onAddTask={addTask} onSort={sortTasks} sortLabel={sortAsc ? "Sort by priority" : "Sort by priority ↓"} onArchive={archiveCompleted} />

      <Tk_AiSuggestionsPanel tasks={tasks} />

      <div className="mb-6 lg:mb-8">
        <div className="flex items-center justify-between mb-4 fade-up" style={{
        animationDelay: "290ms"
      }}>
          <h2 className="text-[15px] font-semibold" style={{
          color: C.text
        }}>
            {category === "All" ? "All Tasks" : category}
          </h2>
          <span className="text-[12px]" style={{
          color: C.faint
        }}>
            {filteredTasks.length} shown
          </span>
        </div>
        <Tk_TaskList tasks={filteredTasks} onReorder={reorder} onToggleDone={toggleDone} onDelete={deleteTask} onDuplicate={duplicateTask} onEdit={editTask} />
      </div>

      <Tk_SummaryCards tasks={tasks} />
    </>;
}

export default TasksBody;
