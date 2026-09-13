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
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

/* ==================================================================== */
/* Calendar                                                               */
/* ==================================================================== */

function Cl_PriorityBadge({
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
function Cl_StatusBadge({
  status
}) {
  const styles = {
    Upcoming: {
      border: `1px solid ${C.ink}`,
      color: C.onInk,
      background: C.ink
    },
    "In Progress": {
      border: `1px solid ${C.divider}`,
      color: C.sub,
      background: C.cardMuted
    },
    Done: {
      border: `1px solid ${C.borderSoft}`,
      color: C.faint,
      background: "transparent"
    }
  };
  return <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full tracking-wide inline-block" style={styles[status] || styles.Upcoming}>
      {status}
    </span>;
}

/* ------------------------------------------------------------------ */
/* Sidebar — identical to Tasks page                                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Date helpers                                                         */
/* ------------------------------------------------------------------ */
const Cl_MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const Cl_DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const Cl_DAY_NAMES_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
function Cl_pad2(n) {
  return String(n).padStart(2, "0");
}
function Cl_fmtKey(d) {
  return `${d.getFullYear()}-${Cl_pad2(d.getMonth() + 1)}-${Cl_pad2(d.getDate())}`;
}
function Cl_parseKey(k) {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function Cl_addDays(d, n) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + n);
  return nd;
}
function Cl_addMonths(d, n) {
  const nd = new Date(d);
  nd.setMonth(nd.getMonth() + n);
  return nd;
}
function Cl_sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function Cl_startOfWeekMon(d) {
  const nd = new Date(d);
  const day = (nd.getDay() + 6) % 7; // 0 = Monday
  nd.setDate(nd.getDate() - day);
  return nd;
}
function Cl_monthMatrix(cursor) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const gridStart = Cl_startOfWeekMon(first);
  const weeks = [];
  let d = gridStart;
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let i = 0; i < 7; i++) {
      row.push(d);
      d = Cl_addDays(d, 1);
    }
    weeks.push(row);
  }
  return weeks;
}
function Cl_fmtHour(hourDecimal) {
  let h = Math.floor(hourDecimal);
  const m = Math.round((hourDecimal - h) * 60);
  const ampm = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${Cl_pad2(m)} ${ampm}`;
}
function Cl_fmtDuration(hrs) {
  if (hrs < 1) return `${Math.round(hrs * 60)} min`;
  const h = Math.floor(hrs);
  const m = Math.round((hrs - h) * 60);
  return m === 0 ? `${h} hr${h > 1 ? "s" : ""}` : `${h}h ${m}m`;
}

/* ------------------------------------------------------------------ */
/* Reference "today" — kept fixed so the mock data always reads well    */
/* ------------------------------------------------------------------ */
const Cl_TODAY = new Date();
const Cl_TODAY_KEY = Cl_fmtKey(Cl_TODAY);

/* ------------------------------------------------------------------ */
/* Categories                                                           */
/* ------------------------------------------------------------------ */
const Cl_CATEGORY_META = {
  Work: {
    icon: ClipboardList
  },
  Meetings: {
    icon: Users
  },
  Study: {
    icon: BookOpen
  },
  Personal: {
    icon: Coffee
  },
  Fitness: {
    icon: Dumbbell
  },
  Goals: {
    icon: Target
  }
};
const Cl_CATEGORY_LIST = Object.keys(Cl_CATEGORY_META);

/* ------------------------------------------------------------------ */
/* Calendar events now come from useCalendarEvents() (real Cortex      */
/* EventResponse API) instead of a fixed mock array.                   */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* AI schedule assistant — recommendation pools                        */
/* ------------------------------------------------------------------ */
const Cl_AI_SUGGESTIONS_POOL = [{
  id: "s1",
  icon: Sun,
  title: "Best time for deep work",
  text: "Your focus scores peak 9:00–11:00 AM. Two open hours tomorrow morning are unscheduled — a good window for your API redesign work.",
  action: "Schedule deep work"
}, {
  id: "s2",
  icon: Coffee,
  title: "Suggested break",
  text: "You have back-to-back blocks from 1:30–3:30 PM today with no buffer. A 15-minute break before Family Video Call is recommended.",
  action: "Add break"
}, {
  id: "s3",
  icon: AlertTriangle,
  title: "Schedule conflict",
  text: "\"Study: ML Course\" overlaps with your usual wind-down time. Consider moving it earlier to 6:00 PM to protect your evening.",
  action: "Resolve conflict"
}, {
  id: "s4",
  icon: Hourglass,
  title: "Free time available",
  text: "Sunday afternoon (2:00–6:00 PM) is fully open. It's a good window to get ahead on Monday's roadmap prep.",
  action: "Fill free time"
}, {
  id: "s5",
  icon: BarChart3,
  title: "Workload balancing",
  text: "Thursday has 5.5 hrs scheduled but only 4 focus hours available. Consider shifting one task to Wednesday.",
  action: "Rebalance week"
}, {
  id: "s6",
  icon: TrendingUp,
  title: "Daily productivity advice",
  text: "You complete 32% more tasks on days that start with a fitness block. Keep the morning run before high-priority work.",
  action: "Keep this habit"
}];

/* ------------------------------------------------------------------ */
/* Priority → dot color                                                 */
/* ------------------------------------------------------------------ */
const Cl_PRIORITY_DOT = {
  High: C.ink,
  Medium: C.sub,
  Low: C.divider
};

/* ------------------------------------------------------------------ */
/* Calendar Header — title, month/year, nav, today, add event           */
/* ------------------------------------------------------------------ */
function Cl_CalendarHeader({
  cursor,
  onPrev,
  onNext,
  onToday,
  onAddEvent,
  view,
  onViewChange,
  eventCount
}) {
  const label = view === "Day" ? cursor.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }) : view === "Week" ? (() => {
    const s = Cl_startOfWeekMon(cursor);
    const e = Cl_addDays(s, 6);
    const sameMonth = s.getMonth() === e.getMonth();
    return sameMonth ? `${Cl_MONTH_NAMES[s.getMonth()]} ${s.getDate()}–${e.getDate()}, ${e.getFullYear()}` : `${Cl_MONTH_NAMES[s.getMonth()].slice(0, 3)} ${s.getDate()} – ${Cl_MONTH_NAMES[e.getMonth()].slice(0, 3)} ${e.getDate()}, ${e.getFullYear()}`;
  })() : `${Cl_MONTH_NAMES[cursor.getMonth()]} ${cursor.getFullYear()}`;
  return <div className="flex flex-col gap-4 mb-6 lg:mb-7 fade-up" style={{
    animationDelay: "20ms"
  }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-tight leading-tight" style={{
          color: C.text
        }}>
            <span className="font-display text-[38px] sm:text-[44px] font-normal align-middle">Calendar</span>
          </h1>
          <p className="text-[13.5px] mt-1" style={{
          color: C.sub
        }}>
            {eventCount} events scheduled this month
          </p>
        </div>
        <button onClick={onAddEvent} className="glossy-btn glitter-sm flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13.5px] font-medium shrink-0 transition-transform duration-150 hover:-translate-y-0.5 self-start sm:self-auto" style={{
        background: C.glossDark,
        color: C.onInk,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`
      }}>
          <Plus size={15} strokeWidth={2} />
          Add Event
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={onPrev} className="icon-btn w-8 h-8 rounded-lg flex items-center justify-center" style={{
          border: `1px solid ${C.border}`,
          background: C.card,
          boxShadow: C.shadow,
          color: C.text
        }} aria-label="Previous">
            <ChevronLeft size={15} strokeWidth={1.75} />
          </button>
          <button onClick={onNext} className="icon-btn w-8 h-8 rounded-lg flex items-center justify-center" style={{
          border: `1px solid ${C.border}`,
          background: C.card,
          boxShadow: C.shadow,
          color: C.text
        }} aria-label="Next">
            <ChevronRight size={15} strokeWidth={1.75} />
          </button>
          <span className="text-[15px] font-semibold ml-1" style={{
          color: C.text
        }}>
            {label}
          </span>
          <button onClick={onToday} className="ml-2 px-3 py-1.5 rounded-lg text-[12.5px] font-medium" style={{
          border: `1px solid ${C.border}`,
          background: C.card,
          boxShadow: C.shadow,
          color: C.text
        }}>
            Today
          </button>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg shrink-0" style={{
        border: `1px solid ${C.border}`,
        background: C.card,
        boxShadow: C.shadow
      }}>
          {["Day", "Week", "Month"].map(v => {
          const isActive = view === v;
          return <button key={v} onClick={() => onViewChange(v)} className="px-3.5 py-1.5 rounded-md text-[12.5px] font-medium transition-colors duration-150" style={{
            background: isActive ? C.glossDark : "transparent",
            color: isActive ? C.onInk : C.sub
          }}>
                {v}
              </button>;
        })}
        </div>
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Event pill — used inside month-view day cells (draggable)            */
/* ------------------------------------------------------------------ */
function Cl_EventPill({
  event,
  onOpen,
  onDragStart
}) {
  const Icon = Cl_CATEGORY_META[event.category]?.icon || ClipboardList;
  return <button draggable onDragStart={e => onDragStart(e, event)} onClick={e => {
    e.stopPropagation();
    onOpen(event);
  }} className="drag-handle w-full flex items-center gap-1 px-1.5 py-[3px] rounded-md text-[10.5px] font-medium text-left truncate" style={{
    background: event.priority === "High" ? C.glossDark : C.cardMuted,
    color: event.priority === "High" ? C.onInk : C.text,
    border: `1px solid ${event.priority === "High" ? C.ink : C.border}`
  }} title={`${event.title} · ${Cl_fmtHour(event.startHour)}`}>
      <Icon size={9.5} strokeWidth={2} className="shrink-0" />
      <span className="truncate">{event.title}</span>
    </button>;
}

/* ------------------------------------------------------------------ */
/* Month grid                                                           */
/* ------------------------------------------------------------------ */
function Cl_MonthGrid({
  cursor,
  eventsByDate,
  selectedDate,
  onSelectDate,
  onDropEvent,
  onOpenEvent,
  onDragStart
}) {
  const weeks = useMemo(() => Cl_monthMatrix(cursor), [cursor]);
  return <Card className="p-0 overflow-hidden" delay={80}>
      <div className="grid grid-cols-7" style={{
      borderBottom: `1px solid ${C.borderSoft}`
    }}>
        {Cl_DAY_NAMES.map(d => <div key={d} className="text-[11px] font-medium text-center py-2.5" style={{
        color: C.faint
      }}>
            {d}
          </div>)}
      </div>
      <div className="grid grid-cols-7">
        {weeks.flat().map((date, i) => {
        const key = Cl_fmtKey(date);
        const inMonth = date.getMonth() === cursor.getMonth();
        const isToday = key === Cl_TODAY_KEY;
        const isSelected = Cl_fmtKey(selectedDate) === key;
        const dayEvents = (eventsByDate[key] || []).slice().sort((a, b) => a.startHour - b.startHour);
        const visible = dayEvents.slice(0, 3);
        const overflow = dayEvents.length - visible.length;
        return <div key={i} onClick={() => onSelectDate(date)} onDragOver={e => e.preventDefault()} onDrop={e => {
          e.preventDefault();
          onDropEvent(key);
        }} className="min-h-[92px] sm:min-h-[108px] p-1.5 flex flex-col gap-1 cursor-pointer" style={{
          borderRight: (i + 1) % 7 !== 0 ? `1px solid ${C.borderSoft}` : "none",
          borderBottom: i < 35 ? `1px solid ${C.borderSoft}` : "none",
          background: isSelected ? C.cardMuted : "transparent",
          opacity: inMonth ? 1 : 0.4
        }}>
              <span className="text-[11.5px] font-medium w-5 h-5 rounded-full flex items-center justify-center" style={{
            color: isToday ? C.onInk : C.text,
            background: isToday ? C.glossDark : "transparent"
          }}>
                {date.getDate()}
              </span>
              <div className="flex flex-col gap-1">
                {visible.map(ev => <Cl_EventPill key={ev.id} event={ev} onOpen={onOpenEvent} onDragStart={onDragStart} />)}
                {overflow > 0 && <span className="text-[10px] px-1.5" style={{
              color: C.faint
            }}>
                    +{overflow} more
                  </span>}
              </div>
            </div>;
      })}
      </div>
    </Card>;
}

/* ------------------------------------------------------------------ */
/* Time grid (Week / Day) — draggable move + resizable duration         */
/* ------------------------------------------------------------------ */
const Cl_GRID_START_HOUR = 6;
const Cl_GRID_END_HOUR = 22;
const Cl_HOUR_HEIGHT = 56;
function Cl_TimeEventBlock({
  event,
  onOpen,
  onMove,
  onResize
}) {
  const Icon = Cl_CATEGORY_META[event.category]?.icon || ClipboardList;
  const dragState = useRef(null);
  const blockRef = useRef(null);
  const top = (event.startHour - Cl_GRID_START_HOUR) * Cl_HOUR_HEIGHT;
  const height = Math.max(event.duration * Cl_HOUR_HEIGHT, 22);
  const onMoveMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
    dragState.current = {
      startY: e.clientY,
      origStart: event.startHour,
      mode: "move"
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  const onResizeMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
    dragState.current = {
      startY: e.clientY,
      origDuration: event.duration,
      mode: "resize"
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  const onMouseMove = e => {
    if (!dragState.current || !blockRef.current) return;
    const deltaY = e.clientY - dragState.current.startY;
    const deltaHours = Math.round(deltaY / Cl_HOUR_HEIGHT * 4) / 4; // snap to 15 min
    if (dragState.current.mode === "move") {
      blockRef.current.style.transform = `translateY(${deltaHours * Cl_HOUR_HEIGHT}px)`;
    } else {
      const newDuration = Math.max(0.25, dragState.current.origDuration + deltaHours);
      blockRef.current.style.height = `${newDuration * Cl_HOUR_HEIGHT}px`;
    }
  };
  const onMouseUp = e => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    if (!dragState.current) return;
    const deltaY = e.clientY - dragState.current.startY;
    const deltaHours = Math.round(deltaY / Cl_HOUR_HEIGHT * 4) / 4;
    if (blockRef.current) {
      blockRef.current.style.transform = "";
      blockRef.current.style.height = `${height}px`;
    }
    if (dragState.current.mode === "move" && deltaHours !== 0) {
      let newStart = dragState.current.origStart + deltaHours;
      newStart = Math.min(Math.max(newStart, Cl_GRID_START_HOUR), Cl_GRID_END_HOUR - event.duration);
      onMove(event.id, newStart);
    } else if (dragState.current.mode === "resize" && deltaHours !== 0) {
      const newDuration = Math.max(0.25, dragState.current.origDuration + deltaHours);
      onResize(event.id, newDuration);
    }
    dragState.current = null;
  };
  return <div ref={blockRef} onClick={e => {
    e.stopPropagation();
    onOpen(event);
  }} onMouseDown={onMoveMouseDown} className="task-row absolute left-1 right-1 rounded-lg px-2 py-1 overflow-hidden cursor-grab select-none" style={{
    top,
    height,
    background: event.priority === "High" ? C.glossDark : C.glossCard,
    color: event.priority === "High" ? C.onInk : C.text,
    border: `1px solid ${event.priority === "High" ? C.ink : C.border}`,
    boxShadow: C.shadow,
    zIndex: 2
  }}>
      <div className="flex items-center gap-1 text-[11px] font-semibold truncate">
        <Icon size={10.5} strokeWidth={2} className="shrink-0" />
        <span className="truncate">{event.title}</span>
      </div>
      {height > 34 && <div className="text-[10px] mt-0.5 truncate" style={{
      color: event.priority === "High" ? C.onInkSub : C.sub
    }}>
          {Cl_fmtHour(event.startHour)} · {Cl_fmtDuration(event.duration)}
        </div>}
      <div onMouseDown={onResizeMouseDown} className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize flex items-center justify-center">
        <div className="w-6 h-[3px] rounded-full" style={{
        background: event.priority === "High" ? "rgba(244,244,242,0.4)" : C.divider
      }} />
      </div>
    </div>;
}
function Cl_TimeGridView({
  days,
  eventsByDate,
  onOpen,
  onMove,
  onResize
}) {
  const hours = [];
  for (let h = Cl_GRID_START_HOUR; h < Cl_GRID_END_HOUR; h++) hours.push(h);
  return <Card className="p-0 overflow-hidden" delay={80}>
      <div className="flex" style={{
      borderBottom: `1px solid ${C.borderSoft}`
    }}>
        <div style={{
        width: 56
      }} />
        {days.map(d => {
        const isToday = Cl_fmtKey(d) === Cl_TODAY_KEY;
        return <div key={Cl_fmtKey(d)} className="flex-1 text-center py-2.5" style={{
          borderLeft: `1px solid ${C.borderSoft}`
        }}>
              <div className="text-[11px]" style={{
            color: C.faint
          }}>
                {Cl_DAY_NAMES[(d.getDay() + 6) % 7]}
              </div>
              <div className="text-[13px] font-semibold w-6 h-6 rounded-full flex items-center justify-center mx-auto mt-0.5" style={{
            color: isToday ? C.onInk : C.text,
            background: isToday ? C.glossDark : "transparent"
          }}>
                {d.getDate()}
              </div>
            </div>;
      })}
      </div>
      <div className="flex overflow-y-auto" style={{
      maxHeight: 560
    }}>
        <div style={{
        width: 56
      }}>
          {hours.map(h => <div key={h} style={{
          height: Cl_HOUR_HEIGHT
        }} className="relative">
              <span className="absolute -top-2 right-2 text-[10px]" style={{
            color: C.faint
          }}>
                {Cl_fmtHour(h)}
              </span>
            </div>)}
        </div>
        {days.map(d => {
        const key = Cl_fmtKey(d);
        const dayEvents = eventsByDate[key] || [];
        return <div key={key} className="relative flex-1" style={{
          borderLeft: `1px solid ${C.borderSoft}`,
          height: hours.length * Cl_HOUR_HEIGHT
        }}>
              {hours.map(h => <div key={h} style={{
            height: Cl_HOUR_HEIGHT,
            borderBottom: `1px solid ${C.borderSoft}`
          }} />)}
              {dayEvents.map(ev => <Cl_TimeEventBlock key={ev.id} event={ev} onOpen={onOpen} onMove={onMove} onResize={onResize} />)}
            </div>;
      })}
      </div>
    </Card>;
}

/* ------------------------------------------------------------------ */
/* Mini calendar                                                        */
/* ------------------------------------------------------------------ */
function Cl_MiniCalendar({
  cursor,
  onCursorChange,
  selectedDate,
  onSelectDate,
  eventsByDate
}) {
  const weeks = useMemo(() => Cl_monthMatrix(cursor), [cursor]);
  return <Card className="p-4" delay={100}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-semibold" style={{
        color: C.text
      }}>
          {Cl_MONTH_NAMES[cursor.getMonth()]} {cursor.getFullYear()}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => onCursorChange(Cl_addMonths(cursor, -1))} className="icon-btn w-6 h-6 rounded-md flex items-center justify-center" style={{
          color: C.sub
        }} aria-label="Previous month">
            <ChevronLeft size={13} strokeWidth={1.75} />
          </button>
          <button onClick={() => onCursorChange(Cl_addMonths(cursor, 1))} className="icon-btn w-6 h-6 rounded-md flex items-center justify-center" style={{
          color: C.sub
        }} aria-label="Next month">
            <ChevronRight size={13} strokeWidth={1.75} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {Cl_DAY_NAMES.map(d => <div key={d} className="text-[9.5px] font-medium text-center py-1" style={{
        color: C.faint
      }}>
            {d[0]}
          </div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {weeks.flat().map((date, i) => {
        const key = Cl_fmtKey(date);
        const inMonth = date.getMonth() === cursor.getMonth();
        const isToday = key === Cl_TODAY_KEY;
        const isSelected = Cl_fmtKey(selectedDate) === key;
        const hasEvents = (eventsByDate[key] || []).length > 0;
        return <button key={i} onClick={() => onSelectDate(date)} className="relative flex items-center justify-center mx-auto text-[11px] font-medium w-7 h-7 rounded-full" style={{
          color: isSelected ? C.onInk : isToday ? C.text : inMonth ? C.text : C.faint,
          background: isSelected ? C.glossDark : isToday ? C.cardMuted : "transparent",
          border: isToday && !isSelected ? `1px solid ${C.ink}` : "1px solid transparent",
          opacity: inMonth ? 1 : 0.45
        }}>
              {date.getDate()}
              {hasEvents && <span className="absolute bottom-0.5 w-1 h-1 rounded-full" style={{
            background: isSelected ? C.onInk : C.sub
          }} />}
            </button>;
      })}
      </div>
    </Card>;
}

/* ------------------------------------------------------------------ */
/* Event categories filter                                              */
/* ------------------------------------------------------------------ */
function Cl_CategoryFilter({
  active,
  onToggle
}) {
  return <Card className="p-4" delay={120}>
      <div className="flex items-center gap-1.5 mb-3 text-[13px] font-semibold" style={{
      color: C.text
    }}>
        <Filter size={13} strokeWidth={1.75} color={C.sub} />
        Event Categories
      </div>
      <div className="flex flex-col gap-1">
        {Cl_CATEGORY_LIST.map(cat => {
        const Icon = Cl_CATEGORY_META[cat].icon;
        const isActive = active.includes(cat);
        return <button key={cat} onClick={() => onToggle(cat)} className="cat-pill flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] font-medium text-left" style={{
          background: isActive ? C.cardMuted : "transparent",
          color: C.text,
          border: `1px solid ${isActive ? C.ink : "transparent"}`
        }}>
              <span className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{
            background: isActive ? C.glossDark : C.cardMuted,
            border: `1px solid ${C.border}`
          }}>
                <Icon size={12} strokeWidth={1.75} color={isActive ? C.onInk : C.sub} />
              </span>
              {cat}
              {isActive && <Check size={12} strokeWidth={2.5} color={C.text} className="ml-auto" />}
            </button>;
      })}
      </div>
    </Card>;
}

/* ------------------------------------------------------------------ */
/* Upcoming schedule                                                    */
/* ------------------------------------------------------------------ */
function Cl_UpcomingSchedule({
  date,
  events,
  onOpen
}) {
  const sorted = events.slice().sort((a, b) => a.startHour - b.startHour);
  const isToday = Cl_fmtKey(date) === Cl_TODAY_KEY;
  return <Card className="p-4" delay={140}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-semibold" style={{
        color: C.text
      }}>
          {isToday ? "Today's Schedule" : `Schedule — ${date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        })}`}
        </span>
        <Clock size={13} strokeWidth={1.75} color={C.faint} />
      </div>
      {sorted.length === 0 ? <p className="text-[12.5px]" style={{
      color: C.faint
    }}>
          Nothing scheduled for this day.
        </p> : <div className="flex flex-col">
          {sorted.map((ev, i) => {
        const Icon = Cl_CATEGORY_META[ev.category]?.icon || ClipboardList;
        return <button key={ev.id} onClick={() => onOpen(ev)} className="task-row flex items-start gap-3 py-2.5 text-left" style={{
          borderTop: i === 0 ? "none" : `1px solid ${C.borderSoft}`
        }}>
                <div className="w-[3px] self-stretch rounded-full shrink-0" style={{
            background: Cl_PRIORITY_DOT[ev.priority]
          }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-medium" style={{
                color: C.text
              }}>
                      {Cl_fmtHour(ev.startHour)}
                    </span>
                    <span className="text-[10.5px]" style={{
                color: C.faint
              }}>
                      · {Cl_fmtDuration(ev.duration)}
                    </span>
                  </div>
                  <div className="text-[12.5px] font-medium truncate mt-0.5" style={{
              color: C.text
            }}>
                    {ev.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-[10.5px]" style={{
                color: C.sub
              }}>
                      <Icon size={10} strokeWidth={1.75} />
                      {ev.category}
                    </span>
                    {ev.location && <span className="flex items-center gap-1 text-[10.5px]" style={{
                color: C.faint
              }}>
                        <MapPin size={10} strokeWidth={1.75} />
                        {ev.location}
                      </span>}
                  </div>
                </div>
                {ev.reminder ? <BellRing size={13} strokeWidth={1.75} color={C.sub} className="shrink-0 mt-0.5" /> : <BellOff size={13} strokeWidth={1.75} color={C.borderSoft} className="shrink-0 mt-0.5" />}
              </button>;
      })}
        </div>}
    </Card>;
}

/* ------------------------------------------------------------------ */
/* AI Schedule Assistant                                                */
/* ------------------------------------------------------------------ */
function Cl_AiScheduleAssistant({
  suggestions,
  onOptimize,
  onRegenerate,
  optimizing
}) {
  return <Card className="p-4" delay={60}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="pulse-ping absolute inline-flex h-full w-full rounded-full" style={{
            background: "rgba(13,13,12,0.35)"
          }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{
            background: C.ink
          }} />
          </span>
          <span className="text-[13px] font-semibold" style={{
          color: C.text
        }}>
            AI Schedule Assistant
          </span>
        </div>
        <Sparkles size={14} strokeWidth={1.75} color={C.sub} />
      </div>

      <div className="flex flex-col gap-2.5 mb-3">
        {suggestions.map(s => {
        const Icon = s.icon;
        return <div key={s.id} className="flex items-start gap-2.5 p-2.5 rounded-lg" style={{
          background: C.cardMuted,
          border: `1px solid ${C.borderSoft}`
        }}>
              <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{
            background: C.card,
            border: `1px solid ${C.border}`
          }}>
                <Icon size={12} strokeWidth={1.75} color={C.text} />
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold" style={{
              color: C.text
            }}>
                  {s.title}
                </div>
                <p className="text-[11.5px] leading-relaxed mt-0.5" style={{
              color: C.sub
            }}>
                  {s.text}
                </p>
              </div>
            </div>;
      })}
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onOptimize} className="glossy-btn glitter-sm flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium" style={{
        background: C.glossDark,
        color: C.onInk,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`
      }}>
          <Zap size={12.5} strokeWidth={2} />
          Optimize Schedule
        </button>
        <button onClick={onRegenerate} className="icon-btn flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium" style={{
        border: `1px solid ${C.border}`,
        background: C.card,
        color: C.text
      }}>
          <RefreshCw size={12.5} strokeWidth={1.75} className={optimizing ? "animate-spin" : ""} />
          Regenerate
        </button>
      </div>
    </Card>;
}

/* ------------------------------------------------------------------ */
/* Reminders                                                            */
/* ------------------------------------------------------------------ */
function Cl_RemindersPanel({
  events
}) {
  const withReminders = events.filter(e => e.reminder);
  const todays = withReminders.filter(e => e.date === Cl_TODAY_KEY && e.status !== "Done");
  const upcoming = withReminders.filter(e => e.date > Cl_TODAY_KEY).slice(0, 4);
  const missed = withReminders.filter(e => {
    if (e.date !== Cl_TODAY_KEY) return false;
    const eventEndHour = e.startHour + e.duration;
    const nowHour = 17; // reference "current time" for the mock
    return eventEndHour < nowHour && e.status !== "Done";
  });
  const Row = ({
    ev,
    tone
  }) => {
    const Icon = Cl_CATEGORY_META[ev.category]?.icon || ClipboardList;
    return <div className="flex items-center gap-2.5 py-2" style={{
      borderTop: `1px solid ${C.borderSoft}`
    }}>
        <span className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{
        background: tone === "missed" ? "transparent" : C.cardMuted,
        border: `1px solid ${tone === "missed" ? C.divider : C.border}`
      }}>
          <Icon size={11.5} strokeWidth={1.75} color={tone === "missed" ? C.faint : C.text} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-medium truncate" style={{
          color: tone === "missed" ? C.faint : C.text
        }}>
            {ev.title}
          </div>
          <div className="text-[10.5px]" style={{
          color: C.faint
        }}>
            {ev.date === Cl_TODAY_KEY ? "Today" : Cl_parseKey(ev.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          })} · {Cl_fmtHour(ev.startHour)}
          </div>
        </div>
        {tone === "missed" ? <AlertTriangle size={13} strokeWidth={1.75} color={C.faint} className="shrink-0" /> : <BellRing size={13} strokeWidth={1.75} color={C.sub} className="shrink-0" />}
      </div>;
  };
  return <Card className="p-4" delay={160}>
      <div className="flex items-center gap-1.5 mb-1 text-[13px] font-semibold" style={{
      color: C.text
    }}>
        <Bell size={13} strokeWidth={1.75} color={C.sub} />
        Reminders
      </div>

      <div className="mt-2">
        <div className="text-[10.5px] font-medium uppercase tracking-wide" style={{
        color: C.faint
      }}>
          Today
        </div>
        {todays.length === 0 ? <p className="text-[11.5px] mt-1.5" style={{
        color: C.faint
      }}>No reminders due today.</p> : todays.map(ev => <Row key={ev.id} ev={ev} tone="today" />)}
      </div>

      <div className="mt-3">
        <div className="text-[10.5px] font-medium uppercase tracking-wide" style={{
        color: C.faint
      }}>
          Upcoming
        </div>
        {upcoming.length === 0 ? <p className="text-[11.5px] mt-1.5" style={{
        color: C.faint
      }}>Nothing coming up.</p> : upcoming.map(ev => <Row key={ev.id} ev={ev} tone="upcoming" />)}
      </div>

      <div className="mt-3">
        <div className="text-[10.5px] font-medium uppercase tracking-wide" style={{
        color: C.faint
      }}>
          Missed
        </div>
        {missed.length === 0 ? <p className="text-[11.5px] mt-1.5" style={{
        color: C.faint
      }}>No missed reminders.</p> : missed.map(ev => <Row key={ev.id} ev={ev} tone="missed" />)}
      </div>
    </Card>;
}

/* ------------------------------------------------------------------ */
/* Productivity summary                                                 */
/* ------------------------------------------------------------------ */
function Cl_SummaryCards({
  date,
  events
}) {
  const dayEvents = events.filter(e => e.date === Cl_fmtKey(date));
  const meetings = dayEvents.filter(e => e.category === "Meetings").length;
  const focusHours = dayEvents.filter(e => e.category === "Work").reduce((sum, e) => sum + e.duration, 0);
  const goalDeadlines = dayEvents.filter(e => e.category === "Goals").length;
  const scheduledHours = dayEvents.reduce((sum, e) => sum + e.duration, 0);
  const freeHours = Math.max(0, Cl_GRID_END_HOUR - Cl_GRID_START_HOUR - scheduledHours);
  const stats = [{
    label: "Events Today",
    value: dayEvents.length,
    icon: CalendarDays
  }, {
    label: "Free Hours",
    value: freeHours.toFixed(1),
    icon: Hourglass
  }, {
    label: "Meetings",
    value: meetings,
    icon: Users
  }, {
    label: "Focus Time",
    value: `${focusHours.toFixed(1)}h`,
    icon: Zap
  }, {
    label: "Goal Deadlines",
    value: goalDeadlines,
    icon: Target
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
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Event detail / edit / add panel                                      */
/* ------------------------------------------------------------------ */
function Cl_EventPanel({
  event,
  mode,
  onClose,
  onSave,
  onDelete
}) {
  const [form, setForm] = useState(event || {
    title: "",
    category: "Work",
    date: Cl_TODAY_KEY,
    startHour: 9,
    duration: 1,
    priority: "Medium",
    status: "Upcoming",
    location: "",
    reminder: true
  });
  const [editing, setEditing] = useState(mode === "add");
  const set = (k, v) => setForm(f => ({
    ...f,
    [k]: v
  }));
  return <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{
    background: "rgba(13,13,12,0.45)",
    backdropFilter: "blur(6px)"
  }} onClick={onClose}>
      <div className="panel-drop w-full max-w-md rounded-2xl p-5 max-h-[85vh] overflow-y-auto" style={{
      background: C.glossCard,
      border: `1px solid ${C.border}`,
      boxShadow: C.shadowLift
    }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[16px] font-semibold" style={{
          color: C.text
        }}>
            {mode === "add" ? "Add Event" : editing ? "Edit Event" : "Event Details"}
          </span>
          <button onClick={onClose} className="icon-btn w-7 h-7 rounded-lg flex items-center justify-center" style={{
          color: C.faint
        }}>
            <X size={15} />
          </button>
        </div>

        {editing ? <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium" style={{
            color: C.faint
          }}>Title</span>
              <input value={form.title} onChange={e => set("title", e.target.value)} className="px-3 py-2 rounded-lg text-[13px] outline-none" style={{
            border: `1px solid ${C.border}`,
            background: C.card,
            color: C.text
          }} placeholder="Event title" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-[11px] font-medium" style={{
              color: C.faint
            }}>Category</span>
                <select value={form.category} onChange={e => set("category", e.target.value)} className="px-3 py-2 rounded-lg text-[13px] outline-none" style={{
              border: `1px solid ${C.border}`,
              background: C.card,
              color: C.text
            }}>
                  {Cl_CATEGORY_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] font-medium" style={{
              color: C.faint
            }}>Priority</span>
                <select value={form.priority} onChange={e => set("priority", e.target.value)} className="px-3 py-2 rounded-lg text-[13px] outline-none" style={{
              border: `1px solid ${C.border}`,
              background: C.card,
              color: C.text
            }}>
                  {["High", "Medium", "Low"].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-[11px] font-medium" style={{
              color: C.faint
            }}>Date</span>
                <input type="date" value={form.date} onChange={e => set("date", e.target.value)} className="px-2.5 py-2 rounded-lg text-[12.5px] outline-none" style={{
              border: `1px solid ${C.border}`,
              background: C.card,
              color: C.text
            }} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] font-medium" style={{
              color: C.faint
            }}>Start</span>
                <input type="number" step="0.25" min={0} max={23.75} value={form.startHour} onChange={e => set("startHour", parseFloat(e.target.value) || 0)} className="px-2.5 py-2 rounded-lg text-[12.5px] outline-none" style={{
              border: `1px solid ${C.border}`,
              background: C.card,
              color: C.text
            }} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] font-medium" style={{
              color: C.faint
            }}>Duration (h)</span>
                <input type="number" step="0.25" min={0.25} value={form.duration} onChange={e => set("duration", parseFloat(e.target.value) || 0.25)} className="px-2.5 py-2 rounded-lg text-[12.5px] outline-none" style={{
              border: `1px solid ${C.border}`,
              background: C.card,
              color: C.text
            }} />
              </label>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium" style={{
            color: C.faint
          }}>Location (optional)</span>
              <input value={form.location} onChange={e => set("location", e.target.value)} className="px-3 py-2 rounded-lg text-[13px] outline-none" style={{
            border: `1px solid ${C.border}`,
            background: C.card,
            color: C.text
          }} placeholder="e.g. Zoom, Conference Room A" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-[11px] font-medium" style={{
              color: C.faint
            }}>Status</span>
                <select value={form.status} onChange={e => set("status", e.target.value)} className="px-3 py-2 rounded-lg text-[13px] outline-none" style={{
              border: `1px solid ${C.border}`,
              background: C.card,
              color: C.text
            }}>
                  {["Upcoming", "In Progress", "Done"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 mt-5">
                <input type="checkbox" checked={form.reminder} onChange={e => set("reminder", e.target.checked)} />
                <span className="text-[12.5px]" style={{
              color: C.text
            }}>Set reminder</span>
              </label>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => {
            if (!form.title.trim()) return;
            onSave({
              ...form,
              id: form.id ?? Date.now()
            });
          }} className="glossy-btn glitter-sm flex-1 px-4 py-2.5 rounded-lg text-[13px] font-medium" style={{
            background: C.glossDark,
            color: C.onInk,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`
          }}>
                Save Event
              </button>
              <button onClick={onClose} className="px-4 py-2.5 rounded-lg text-[13px] font-medium" style={{
            border: `1px solid ${C.border}`,
            background: C.card,
            color: C.text
          }}>
                Cancel
              </button>
            </div>
          </div> : <div className="flex flex-col gap-4">
            <div>
              <div className="text-[17px] font-semibold" style={{
            color: C.text
          }}>{form.title}</div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Cl_PriorityBadge priority={form.priority} />
                <Cl_StatusBadge status={form.status} />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-[13px]" style={{
          color: C.sub
        }}>
              <div className="flex items-center gap-2">
                <CalendarClock size={14} strokeWidth={1.75} color={C.faint} />
                {Cl_parseKey(form.date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric"
            })} · {Cl_fmtHour(form.startHour)} · {Cl_fmtDuration(form.duration)}
              </div>
              {form.location && <div className="flex items-center gap-2">
                  <MapPin size={14} strokeWidth={1.75} color={C.faint} />
                  {form.location}
                </div>}
              <div className="flex items-center gap-2">
                {React.createElement(Cl_CATEGORY_META[form.category]?.icon || ClipboardList, {
              size: 14,
              strokeWidth: 1.75,
              color: C.faint
            })}
                {form.category}
              </div>
              <div className="flex items-center gap-2">
                {form.reminder ? <BellRing size={14} strokeWidth={1.75} color={C.faint} /> : <BellOff size={14} strokeWidth={1.75} color={C.faint} />}
                {form.reminder ? "Reminder set" : "No reminder"}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => setEditing(true)} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-medium" style={{
            border: `1px solid ${C.border}`,
            background: C.card,
            color: C.text
          }}>
                <Pencil size={13} strokeWidth={1.75} />
                Edit
              </button>
              <button onClick={() => onDelete(form.id)} className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-medium" style={{
            border: `1px solid ${C.divider}`,
            background: "transparent",
            color: C.sub
          }}>
                <Trash2 size={13} strokeWidth={1.75} />
                Delete
              </button>
            </div>
          </div>}
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Calendar page                                                        */
/* ------------------------------------------------------------------ */
export function CalendarBody() {
  const [cursor, setCursor] = useState(new Date(Cl_TODAY));
  const [selectedDate, setSelectedDate] = useState(new Date(Cl_TODAY));
  const monthKey = `${cursor.getFullYear()}-${Cl_pad2(cursor.getMonth() + 1)}`;
  const { events, loading, error, add, update, remove } = useCalendarEvents(monthKey);
  const [view, setView] = useState("Month");
  const [activeCategories, setActiveCategories] = useState([]);
  const [panel, setPanel] = useState(null); // { mode: 'view'|'edit'|'add', event }
  const [suggestions, setSuggestions] = useState(Cl_AI_SUGGESTIONS_POOL.slice(0, 4));
  const [optimizing, setOptimizing] = useState(false);
  const filteredEvents = useMemo(() => {
    if (activeCategories.length === 0) return events;
    return events.filter(e => activeCategories.includes(e.category));
  }, [events, activeCategories]);
  const eventsByDate = useMemo(() => {
    const map = {};
    filteredEvents.forEach(e => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [filteredEvents]);
  const eventsThisMonth = useMemo(() => filteredEvents.filter(e => {
    const d = Cl_parseKey(e.date);
    return d.getMonth() === cursor.getMonth() && d.getFullYear() === cursor.getFullYear();
  }).length, [filteredEvents, cursor]);
  const weekDays = useMemo(() => {
    const s = Cl_startOfWeekMon(cursor);
    return Array.from({
      length: 7
    }, (_, i) => Cl_addDays(s, i));
  }, [cursor]);
  const toggleCategory = cat => {
    setActiveCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };
  const handlePrev = () => {
    if (view === "Month") setCursor(c => Cl_addMonths(c, -1));else if (view === "Week") setCursor(c => Cl_addDays(c, -7));else setCursor(c => Cl_addDays(c, -1));
  };
  const handleNext = () => {
    if (view === "Month") setCursor(c => Cl_addMonths(c, 1));else if (view === "Week") setCursor(c => Cl_addDays(c, 7));else setCursor(c => Cl_addDays(c, 1));
  };
  const handleToday = () => {
    setCursor(new Date(Cl_TODAY));
    setSelectedDate(new Date(Cl_TODAY));
  };
  const handleSelectDate = date => {
    setSelectedDate(date);
    if (view === "Day") setCursor(date);
    if (date.getMonth() !== cursor.getMonth() || date.getFullYear() !== cursor.getFullYear()) {
      setCursor(date);
    }
  };
  const handleDropEvent = dateKey => {
    const id = window.__dragEventId;
    if (id == null) return;
    update(id, { date: dateKey }).catch(() => {});
  };
  const handleDragStart = (e, event) => {
    window.__dragEventId = event.id;
    e.dataTransfer.effectAllowed = "move";
  };
  const handleMove = (id, newStartHour) => {
    update(id, { startHour: Math.round(newStartHour * 4) / 4 }).catch(() => {});
  };
  const handleResize = (id, newDuration) => {
    update(id, { duration: Math.round(newDuration * 4) / 4 }).catch(() => {});
  };
  const openEvent = event => setPanel({
    mode: "view",
    event
  });
  const addEvent = () => setPanel({
    mode: "add",
    event: {
      date: Cl_fmtKey(selectedDate)
    }
  });
  const saveEvent = form => {
    const isExisting = events.some(e => e.id === form.id);
    const action = isExisting ? update(form.id, form) : add(form);
    action.then(() => setPanel(null)).catch(() => {});
  };
  const deleteCalendarEvent = id => {
    remove(id).catch(() => {});
    setPanel(null);
  };
  const shuffleSuggestions = () => {
    setOptimizing(true);
    setTimeout(() => {
      const shuffled = [...Cl_AI_SUGGESTIONS_POOL].sort(() => Math.random() - 0.5).slice(0, 4);
      setSuggestions(shuffled);
      setOptimizing(false);
    }, 700);
  };
  if (loading && events.length === 0) return <Loader label="Loading your calendar…" />;
  if (error) return <EmptyState title="Couldn't load calendar events" description={error} />;
  return <>
      <Cl_CalendarHeader cursor={cursor} onPrev={handlePrev} onNext={handleNext} onToday={handleToday} onAddEvent={addEvent} view={view} onViewChange={setView} eventCount={eventsThisMonth} />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 lg:gap-6">
        <div className="min-w-0 fade-up" style={{
        animationDelay: "100ms"
      }}>
          {view === "Month" && <Cl_MonthGrid cursor={cursor} eventsByDate={eventsByDate} selectedDate={selectedDate} onSelectDate={handleSelectDate} onDropEvent={handleDropEvent} onOpenEvent={openEvent} onDragStart={handleDragStart} />}
          {view === "Week" && <Cl_TimeGridView days={weekDays} eventsByDate={eventsByDate} onOpen={openEvent} onMove={handleMove} onResize={handleResize} />}
          {view === "Day" && <Cl_TimeGridView days={[cursor]} eventsByDate={eventsByDate} onOpen={openEvent} onMove={handleMove} onResize={handleResize} />}
        </div>

        <div className="flex flex-col gap-5 lg:gap-6">
          <Cl_AiScheduleAssistant suggestions={suggestions} onOptimize={shuffleSuggestions} onRegenerate={shuffleSuggestions} optimizing={optimizing} />
          <Cl_MiniCalendar cursor={cursor} onCursorChange={setCursor} selectedDate={selectedDate} onSelectDate={handleSelectDate} eventsByDate={eventsByDate} />
          <Cl_UpcomingSchedule date={selectedDate} events={eventsByDate[Cl_fmtKey(selectedDate)] || []} onOpen={openEvent} />
          <Cl_CategoryFilter active={activeCategories} onToggle={toggleCategory} />
          <Cl_RemindersPanel events={filteredEvents} />
        </div>
      </div>

      <Cl_SummaryCards date={selectedDate} events={filteredEvents} />

      {panel && <Cl_EventPanel event={panel.event} mode={panel.mode} onClose={() => setPanel(null)} onSave={saveEvent} onDelete={deleteCalendarEvent} />}
    </>;
}

/* ------------------------------------------------------------------ */
/* App shell — identical styling/animation system to the Tasks page     */
/* ------------------------------------------------------------------ */

export default CalendarBody;
