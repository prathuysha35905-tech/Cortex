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
import { useAnalytics } from "@/hooks/useAnalytics";
import { useTasks } from "@/hooks/useTasks";
import { useGoals } from "@/hooks/useGoals";
import { useHabits } from "@/hooks/useHabits";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { getInsights, sendMessage } from "@/services/ai.service";

/* ==================================================================== */
/* Analytics                                                              */
/* ==================================================================== */

function An_TrendBadge({
  up,
  value
}) {
  const color = up ? C.good : C.bad;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return <span className="inline-flex items-center gap-0.5 text-[11.5px] font-medium px-1.5 py-0.5 rounded-full" style={{
    color,
    background: up ? "rgba(63,107,78,0.09)" : "rgba(140,74,58,0.09)"
  }}>
      <Icon size={12} strokeWidth={2} />
      {value}
    </span>;
}
function An_SectionHeading({
  eyebrow,
  title,
  delay = 0
}) {
  return <div className="mb-4 fade-up" style={{
    animationDelay: `${delay}ms`
  }}>
      {eyebrow && <div className="text-[11px] font-medium tracking-[0.08em] uppercase mb-1" style={{
      color: C.faint
    }}>
          {eyebrow}
        </div>}
      <h2 className="text-[15px] font-semibold" style={{
      color: C.text
    }}>
        {title}
      </h2>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Sidebar — identical to Tasks page                                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Mock data — shaped like a realistic Cortex analytics payload         */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Analytics data now comes from real hooks (useAnalytics, useTasks,   */
/* useGoals, useHabits, useCalendarEvents) instead of fixed mock data. */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Header — title, date range selector, export / download              */
/* ------------------------------------------------------------------ */
function An_AnalyticsHeader({
  range,
  onRange
}) {
  const ranges = ["Today", "Week", "Month", "Year", "Custom"];
  return <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 lg:mb-7 fade-up" style={{
    animationDelay: "20ms"
  }}>
      <div>
        <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-tight leading-tight" style={{
        color: C.text
      }}>
          <span className="font-display text-[38px] sm:text-[44px] font-normal align-middle">Analytics</span>
        </h1>
        <p className="text-[13.5px] mt-1" style={{
        color: C.sub
      }}>
          Deep insight into your productivity, habits, goals, and time
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-0.5 p-1 rounded-lg" style={{
        border: `1px solid ${C.border}`,
        background: C.card,
        boxShadow: C.shadow
      }}>
          {ranges.map(r => {
          const active = r === range;
          return <button key={r} onClick={() => onRange(r)} className="px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors duration-150" style={{
            color: active ? C.onInk : C.sub,
            background: active ? C.glossDark : "transparent"
          }}>
                {r}
              </button>;
        })}
        </div>

        <button className="icon-btn flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-[13px] font-medium shrink-0" style={{
        border: `1px solid ${C.border}`,
        background: C.card,
        color: C.text,
        boxShadow: C.shadow
      }}>
          <Share2 size={14} strokeWidth={1.75} />
          Export Report
        </button>
        <button className="glossy-btn glitter-sm flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-[13px] font-medium shrink-0 transition-transform duration-150 hover:-translate-y-0.5" style={{
        background: C.glossDark,
        color: C.onInk,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`
      }}>
          <Download size={14} strokeWidth={2} />
          Download PDF
        </button>
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Overview cards (Statistics Cards)                                    */
/* ------------------------------------------------------------------ */
function An_OverviewCards({ productivityAvg, tasksCompleted, tasksTotal, goalsAchieved, goalsTotal, habitCompletionAvg, focusHoursTotal, habitsCount }) {
  const stats = [{
    label: "Productivity Score",
    value: `${productivityAvg}`,
    suffix: "/100",
    icon: Zap
  }, {
    label: "Tasks Completed",
    value: `${tasksCompleted}`,
    suffix: `/${tasksTotal}`,
    icon: CheckSquare
  }, {
    label: "Goals Achieved",
    value: `${goalsAchieved}`,
    suffix: `/${goalsTotal}`,
    icon: Target
  }, {
    label: "Habit Completion",
    value: `${habitCompletionAvg}`,
    suffix: "%",
    icon: Flame
  }, {
    label: "Focus Hours",
    value: `${focusHoursTotal}`,
    suffix: "h",
    icon: Clock
  }, {
    label: "Habits Tracked",
    value: `${habitsCount}`,
    suffix: "",
    icon: BookOpen
  }];
  return <div className="mb-6 lg:mb-8">
      <An_SectionHeading eyebrow="This week" title="Overview" delay={40} />
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-5">
        {stats.map((s, i) => {
        const Icon = s.icon;
        return <Card key={s.label} className="p-5" delay={60 + i * 30}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px]" style={{
              color: C.faint
            }}>
                  {s.label}
                </span>
                <Icon size={14} color={C.sub} strokeWidth={1.75} />
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[24px] font-semibold tracking-tight" style={{
              color: C.text
            }}>
                  {s.value}
                </span>
                {s.suffix && <span className="text-[12.5px]" style={{
              color: C.sub
            }}>
                    {s.suffix}
                  </span>}
              </div>
            </Card>;
      })}
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Shared chart tooltip — styled like a mini Card                      */
/* ------------------------------------------------------------------ */
function An_ChartTooltip({
  active,
  payload,
  label,
  unit = ""
}) {
  if (!active || !payload || !payload.length) return null;
  return <div className="px-3 py-2 rounded-lg text-[12px]" style={{
    background: C.glossDark,
    color: C.onInk,
    boxShadow: C.shadowLift,
    border: `1px solid ${C.ink3}`
  }}>
      <div className="font-medium mb-0.5" style={{
      color: C.onInkSub
    }}>
        {label}
      </div>
      {payload.map(p => <div key={p.dataKey} className="font-semibold">
          {p.value}
          {unit}
        </div>)}
    </div>;
}

/* ------------------------------------------------------------------ */
/* Productivity dashboard — daily / weekly / monthly × line/bar/area   */
/* ------------------------------------------------------------------ */
function An_ProductivityDashboard() {
  const [period, setPeriod] = useState("Daily");
  const [chartType, setChartType] = useState("Line");
  const rangeForPeriod = period === "Daily" ? "week" : period === "Weekly" ? "month" : "year";
  const { data, loading } = useAnalytics(rangeForPeriod);
  const chartData = (data?.productivity || []).map(p => ({ label: p.day, score: p.value }));
  return <div className="mb-6 lg:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <An_SectionHeading eyebrow="Trends" title="Productivity Dashboard" delay={260} />
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-0.5 p-1 rounded-lg" style={{
          border: `1px solid ${C.border}`,
          background: C.card
        }}>
            {["Daily", "Weekly", "Monthly"].map(p => <button key={p} onClick={() => setPeriod(p)} className="px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors" style={{
            color: period === p ? C.onInk : C.sub,
            background: period === p ? C.glossDark : "transparent"
          }}>
                {p}
              </button>)}
          </div>
          <div className="flex items-center gap-0.5 p-1 rounded-lg" style={{
          border: `1px solid ${C.border}`,
          background: C.card
        }}>
            {["Line", "Bar", "Area"].map(t => <button key={t} onClick={() => setChartType(t)} className="px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors" style={{
            color: chartType === t ? C.onInk : C.sub,
            background: chartType === t ? C.glossDark : "transparent"
          }}>
                {t}
              </button>)}
          </div>
        </div>
      </div>

      <Card className="p-5 pt-6" delay={280}>
        {loading && <div className="text-[13px] py-10 text-center" style={{ color: C.faint }}>Loading…</div>}
        {!loading && chartData.length === 0 && <div className="text-[13px] py-10 text-center" style={{ color: C.faint }}>No data for this range yet.</div>}
        {!loading && chartData.length > 0 && <div style={{
        height: 300
      }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "Line" ? <LineChart data={chartData} margin={{
            top: 4,
            right: 8,
            left: -18,
            bottom: 0
          }}>
                <CartesianGrid stroke={C.borderSoft} vertical={false} />
                <XAxis dataKey="label" tick={{
              fill: C.faint,
              fontSize: 12
            }} axisLine={{
              stroke: C.border
            }} tickLine={false} />
                <YAxis tick={{
              fill: C.faint,
              fontSize: 12
            }} axisLine={false} tickLine={false} />
                <Tooltip content={<An_ChartTooltip />} cursor={{
              stroke: C.divider
            }} />
                <Line type="monotone" dataKey="score" stroke={C.ink} strokeWidth={2.5} dot={{
              r: 3.5,
              fill: C.ink
            }} activeDot={{
              r: 5
            }} />
              </LineChart> : chartType === "Bar" ? <BarChart data={chartData} margin={{
            top: 4,
            right: 8,
            left: -18,
            bottom: 0
          }}>
                <CartesianGrid stroke={C.borderSoft} vertical={false} />
                <XAxis dataKey="label" tick={{
              fill: C.faint,
              fontSize: 12
            }} axisLine={{
              stroke: C.border
            }} tickLine={false} />
                <YAxis tick={{
              fill: C.faint,
              fontSize: 12
            }} axisLine={false} tickLine={false} />
                <Tooltip content={<An_ChartTooltip />} cursor={{
              fill: C.cardMuted
            }} />
                <Bar dataKey="score" fill={C.ink} radius={[5, 5, 0, 0]} maxBarSize={36} />
              </BarChart> : <AreaChart data={chartData} margin={{
            top: 4,
            right: 8,
            left: -18,
            bottom: 0
          }}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.ink} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={C.ink} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.borderSoft} vertical={false} />
                <XAxis dataKey="label" tick={{
              fill: C.faint,
              fontSize: 12
            }} axisLine={{
              stroke: C.border
            }} tickLine={false} />
                <YAxis tick={{
              fill: C.faint,
              fontSize: 12
            }} axisLine={false} tickLine={false} />
                <Tooltip content={<An_ChartTooltip />} cursor={{
              stroke: C.divider
            }} />
                <Area type="monotone" dataKey="score" stroke={C.ink} strokeWidth={2.5} fill="url(#scoreFill)" />
              </AreaChart>}
          </ResponsiveContainer>
        </div>}
      </Card>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Task analytics — pie chart + progress cards                         */
/* ------------------------------------------------------------------ */
function An_ProgressStat({
  label,
  value,
  sublabel,
  icon: Icon,
  delay
}) {
  return <Card className="p-5" delay={delay}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px]" style={{
        color: C.faint
      }}>
          {label}
        </span>
        <Icon size={14} color={C.sub} strokeWidth={1.75} />
      </div>
      <span className="text-[22px] font-semibold tracking-tight" style={{
      color: C.text
    }}>
        {value}
      </span>
      {sublabel && <p className="text-[12px] mt-1" style={{
      color: C.sub
    }}>
          {sublabel}
        </p>}
    </Card>;
}
function An_TaskAnalyticsSection({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.done).length;
  const overdue = tasks.filter(t => t.overdue && !t.done).length;
  const pending = Math.max(0, total - completed - overdue);
  const highPriorityOpen = tasks.filter(t => !t.done && t.priority === "High").length;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;
  const breakdown = [
    { name: "Completed", value: completed, color: C.ink },
    { name: "Pending", value: pending, color: C.divider },
    { name: "Overdue", value: overdue, color: C.bad },
  ];
  return <div className="mb-6 lg:mb-8">
      <An_SectionHeading eyebrow="Tasks" title="Task Analytics" delay={420} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <Card className="p-5 lg:col-span-2" delay={440}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-medium" style={{
            color: C.text
          }}>
              Task Breakdown
            </span>
            <PieChartIcon size={14} color={C.sub} strokeWidth={1.75} />
          </div>
          {total === 0 ? <div className="text-[13px] py-10 text-center" style={{ color: C.faint }}>No tasks yet.</div> : <>
          <div style={{
          height: 210
        }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {breakdown.map(entry => <Cell key={entry.name} fill={entry.color} stroke={C.card} strokeWidth={2} />)}
                </Pie>
                <Tooltip content={<An_ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 -mt-2">
            {breakdown.map(t => <div key={t.name} className="flex items-center gap-1.5 text-[11.5px]" style={{
            color: C.sub
          }}>
                <span className="w-2 h-2 rounded-full" style={{
              background: t.color
            }} />
                {t.name}
              </div>)}
          </div>
          </>}
        </Card>

        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-5">
          <An_ProgressStat label="Tasks Created" value={`${total}`} icon={ListChecks} delay={460} />
          <An_ProgressStat label="Tasks Completed" value={`${completed}`} icon={Check} delay={490} />
          <An_ProgressStat label="Overdue Tasks" value={`${overdue}`} sublabel={overdue > 0 ? "Needs attention" : "All clear"} icon={AlertTriangle} delay={520} />
          <An_ProgressStat label="Completion Rate" value={`${completionRate}%`} icon={TrendingUp} delay={550} />
          <An_ProgressStat label="High Priority Open" value={`${highPriorityOpen}`} icon={Timer} delay={580} />
          <Card className="p-5" delay={610}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px]" style={{
              color: C.faint
            }}>
                Completion Rate
              </span>
              <TrendingUp size={14} color={C.sub} strokeWidth={1.75} />
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{
            background: C.borderSoft
          }}>
              <div className="h-full rounded-full bar-grow glitter-sm" style={{
              background: C.glossDark,
              "--w": `${completionRate}%`
            }} />
            </div>
            <span className="text-[12px]" style={{
            color: C.sub
          }}>
              {completionRate}% of created tasks finished
            </span>
          </Card>
        </div>
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Goal progress — progress rings + bars                               */
/* ------------------------------------------------------------------ */
function An_ProgressRing({
  value,
  size = 96,
  strokeWidth = 9,
  label,
  sublabel
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  return <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={C.borderSoft} strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={C.ink} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{
        transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)"
      }} />
        <text x="50%" y="47%" textAnchor="middle" fontSize="20" fontWeight="600" fill={C.text}>
          {value}%
        </text>
        <text x="50%" y="63%" textAnchor="middle" fontSize="10.5" fill={C.faint}>
          {sublabel}
        </text>
      </svg>
      <span className="text-[12.5px] font-medium mt-1" style={{
      color: C.sub
    }}>
        {label}
      </span>
    </div>;
}
function An_GoalProgressSection({ goals }) {
  const activeGoals = goals.filter(g => !g.archived && g.status === "Active");
  const completedGoals = goals.filter(g => g.status === "Completed");
  const avgProgress = activeGoals.length ? Math.round(activeGoals.reduce((s, g) => s + g.progress, 0) / activeGoals.length) : 0;
  const successRate = goals.length ? Math.round((completedGoals.length / goals.length) * 100) : 0;
  const topGoals = [...goals].filter(g => !g.archived).sort((a, b) => b.progress - a.progress).slice(0, 5);
  return <div className="mb-6 lg:mb-8">
      <An_SectionHeading eyebrow="Goals" title="Goal Progress Analytics" delay={660} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <Card className="p-6 lg:col-span-2" delay={680}>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <An_ProgressStat label="Active Goals" value={`${activeGoals.length}`} icon={Target} delay={0} />
            <An_ProgressStat label="Completed Goals" value={`${completedGoals.length}`} icon={Trophy} delay={0} />
          </div>
          <div className="flex items-center justify-around">
            <An_ProgressRing value={avgProgress} label="Avg. Progress" sublabel="active goals" />
            <An_ProgressRing value={successRate} label="Success Rate" sublabel="of goals" />
          </div>
        </Card>

        <Card className="p-5 lg:col-span-3" delay={720}>
          <span className="text-[13px] font-medium mb-4 block" style={{
          color: C.text
        }}>
            Active Goals
          </span>
          {topGoals.length === 0 && <p className="text-[12.5px]" style={{ color: C.faint }}>No goals yet.</p>}
          <div className="flex flex-col gap-4">
            {topGoals.map((g, i) => <div key={g.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px]" style={{
                color: C.text
              }}>
                    {g.title}
                  </span>
                  <span className="text-[12px] font-medium" style={{
                color: C.sub
              }}>
                    {g.progress}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{
              background: C.borderSoft
            }}>
                  <div className="h-full rounded-full bar-grow" style={{
                background: C.glossDark,
                "--w": `${g.progress}%`,
                animationDelay: `${740 + i * 60}ms`
              }} />
                </div>
              </div>)}
          </div>
        </Card>
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Habit analytics — heatmap calendar + streak cards                   */
/* ------------------------------------------------------------------ */
function An_HabitHeatmap({
  habits
}) {
  const levelColor = l => [C.borderSoft, C.ink][l];
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return <div className="overflow-x-auto">
      <div className="grid gap-[3px]" style={{
      gridTemplateColumns: `repeat(7, 16px)`,
      gridTemplateRows: `repeat(${Math.max(habits.length, 1)}, 16px)`,
      gridAutoFlow: "row",
      width: "max-content"
    }}>
        {habits.map((h, hi) => (h.week || Array(7).fill(false)).map((done, di) => <div key={`${h.id}-${di}`} title={`${h.name} — ${dayLabels[di]}: ${done ? "done" : "missed"}`} className="rounded-[3px] fade-up" style={{
        width: 16,
        height: 16,
        background: levelColor(done ? 1 : 0),
        animationDelay: `${800 + hi * 20}ms`
      }} />))}
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-[11px]" style={{
        color: C.faint
      }}>
          Missed
        </span>
        {[0, 1].map(l => <div key={l} className="rounded-[3px]" style={{
        width: 10,
        height: 10,
        background: levelColor(l)
      }} />)}
        <span className="text-[11px]" style={{
        color: C.faint
      }}>
          Done
        </span>
      </div>
    </div>;
}
function An_HabitAnalyticsSection({ habits, habitConsistency }) {
  const streakIcons = [Flame, Sunrise, Brain, Coffee, Activity, Sunrise];
  const topStreaks = [...habits].sort((a, b) => b.streak - a.streak).slice(0, 4);
  const avgCompletion = habits.length ? Math.round(habits.reduce((s, h) => s + (h.completion || 0), 0) / habits.length) : 0;
  const totalCells = habits.length * 7;
  const doneCells = habits.reduce((s, h) => s + (h.week || []).filter(Boolean).length, 0);
  const weeklyConsistency = totalCells ? Math.round((doneCells / totalCells) * 100) : 0;
  const monthlyConsistencyAvg = habitConsistency.length ? Math.round(habitConsistency.reduce((s, p) => s + p.value, 0) / habitConsistency.length) : 0;
  const longestStreak = habits.length ? Math.max(...habits.map(h => h.longestStreak || 0)) : 0;
  return <div className="mb-6 lg:mb-8">
      <An_SectionHeading eyebrow="Habits" title="Habit Analytics" delay={780} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <Card className="p-5 lg:col-span-3" delay={800}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium" style={{
            color: C.text
          }}>
              Consistency Heatmap
            </span>
            <span className="text-[11.5px]" style={{
            color: C.faint
          }}>
              This week, per habit
            </span>
          </div>
          {habits.length === 0 ? <p className="text-[12.5px] py-6" style={{ color: C.faint }}>No habits tracked yet.</p> : <An_HabitHeatmap habits={habits} />}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5" style={{
          borderTop: `1px solid ${C.borderSoft}`
        }}>
            {[{
            label: "Completion",
            value: `${avgCompletion}%`
          }, {
            label: "Weekly Consistency",
            value: `${weeklyConsistency}%`
          }, {
            label: "Consistency Trend",
            value: `${monthlyConsistencyAvg}%`
          }, {
            label: "Longest Streak",
            value: `${longestStreak}d`
          }].map(s => <div key={s.label}>
                <div className="text-[18px] font-semibold" style={{
              color: C.text
            }}>
                  {s.value}
                </div>
                <div className="text-[11.5px]" style={{
              color: C.faint
            }}>
                  {s.label}
                </div>
              </div>)}
          </div>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {topStreaks.length === 0 && <p className="text-[12.5px] col-span-2" style={{ color: C.faint }}>No habits yet.</p>}
          {topStreaks.map((s, i) => {
          const Icon = streakIcons[i % streakIcons.length];
          return <Card key={s.id} className="p-4" delay={820 + i * 40}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{
                background: C.cardMuted,
                border: `1px solid ${C.border}`
              }}>
                    <Icon size={13.5} color={C.text} strokeWidth={1.75} />
                  </div>
                  <span className="text-[12px] font-medium leading-tight" style={{
                color: C.text
              }}>
                    {s.name}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[20px] font-semibold" style={{
                color: C.text
              }}>
                    {s.streak}
                  </span>
                  <span className="text-[11.5px]" style={{
                color: C.sub
              }}>
                    day streak
                  </span>
                </div>
                <span className="text-[11px]" style={{
              color: C.faint
            }}>
                  Longest: {s.longestStreak} days
                </span>
              </Card>;
        })}
        </div>
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Focus & time insights — hourly graph + weekly timeline               */
/* ------------------------------------------------------------------ */
function An_FocusTimeSection({ focusHours, monthEvents }) {
  const totalFocus = focusHours.reduce((s, d) => s + d.hours, 0);
  const avgDaily = focusHours.length ? totalFocus / focusHours.length : 0;
  const deepWorkSessions = monthEvents.filter(e => ["Work", "Learning"].includes(e.category)).length;
  const meetingHours = monthEvents.filter(e => e.category === "Meetings").reduce((s, e) => s + e.duration, 0);

  const hourlyActivity = useMemo(() => {
    const buckets = Array.from({ length: 24 }, (_, hour) => ({ hour, activity: 0 }));
    monthEvents.forEach(e => {
      const h = Math.floor(e.startHour);
      if (h >= 0 && h < 24) buckets[h].activity += 1;
    });
    return buckets;
  }, [monthEvents]);
  const peakHour = hourlyActivity.reduce((best, b) => b.activity > best.activity ? b : best, hourlyActivity[0] || { hour: 9, activity: 0 });
  const peakLabel = peakHour.activity > 0 ? `${peakHour.hour % 12 || 12}${peakHour.hour < 12 ? "AM" : "PM"}` : "—";

  const timeStats = [{
    label: "Total Focus Hours",
    value: `${totalFocus.toFixed(1)}h`,
    icon: Clock
  }, {
    label: "Avg. Daily Focus",
    value: `${avgDaily.toFixed(1)}h`,
    icon: Activity
  }, {
    label: "Work/Learning Events",
    value: `${deepWorkSessions}`,
    icon: Brain
  }, {
    label: "Meeting Hours",
    value: `${meetingHours.toFixed(1)}h`,
    icon: Coffee
  }, {
    label: "Busiest Hour",
    value: peakLabel,
    icon: Sunrise
  }];

  const segColors = {
    deep: C.ink,
    meetings: C.sub,
    admin: C.faint,
    breaks: C.borderSoft
  };
  const categoryGroup = cat => ["Work", "Learning"].includes(cat) ? "deep" : cat === "Meetings" ? "meetings" : cat === "Fitness" ? "breaks" : "admin";
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyTimeline = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    return dayNames.map((day, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const dayEvents = monthEvents.filter(e => e.date === key);
      const row = { day, deep: 0, meetings: 0, admin: 0, breaks: 0 };
      dayEvents.forEach(e => { row[categoryGroup(e.category)] += e.duration; });
      return row;
    });
  }, [monthEvents]);

  return <div className="mb-6 lg:mb-8">
      <An_SectionHeading eyebrow="Time" title="Focus & Time Insights" delay={900} />
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-5">
        {timeStats.map((s, i) => <An_ProgressStat key={s.label} label={s.label} value={s.value} icon={s.icon} delay={920 + i * 30} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <Card className="p-5 lg:col-span-3" delay={1080}>
          <span className="text-[13px] font-medium mb-3 block" style={{
          color: C.text
        }}>
            Hourly Activity (this month's events)
          </span>
          <div style={{
          height: 220
        }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyActivity} margin={{
              top: 4,
              right: 4,
              left: -22,
              bottom: 0
            }}>
                <CartesianGrid stroke={C.borderSoft} vertical={false} />
                <XAxis dataKey="hour" tick={{
                fill: C.faint,
                fontSize: 10.5
              }} axisLine={{
                stroke: C.border
              }} tickLine={false} interval={2} />
                <YAxis tick={{
                fill: C.faint,
                fontSize: 11
              }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<An_ChartTooltip />} cursor={{
                fill: C.cardMuted
              }} />
                <Bar dataKey="activity" radius={[3, 3, 0, 0]} maxBarSize={14}>
                  {hourlyActivity.map(h => <Cell key={h.hour} fill={h.hour === peakHour.hour && h.activity > 0 ? C.ink : C.divider} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2" delay={1110}>
          <span className="text-[13px] font-medium mb-4 block" style={{
          color: C.text
        }}>
            Weekly Timeline
          </span>
          <div className="flex flex-col gap-3">
            {weeklyTimeline.map(row => {
            const total = row.deep + row.meetings + row.admin + row.breaks;
            return <div key={row.day} className="flex items-center gap-3">
                  <span className="text-[11.5px] w-8 shrink-0" style={{
                color: C.sub
              }}>
                    {row.day}
                  </span>
                  <div className="flex-1 h-3 rounded-full overflow-hidden flex" style={{
                background: C.borderSoft
              }}>
                    {total > 0 && ["deep", "meetings", "admin", "breaks"].map(k => <div key={k} style={{
                  width: `${row[k] / total * 100}%`,
                  background: segColors[k]
                }} />)}
                  </div>
                </div>;
          })}
          </div>
          <div className="flex flex-wrap gap-3 mt-4 pt-4" style={{
          borderTop: `1px solid ${C.borderSoft}`
        }}>
            {[{
            k: "deep",
            label: "Deep work"
          }, {
            k: "meetings",
            label: "Meetings"
          }, {
            k: "admin",
            label: "Admin"
          }, {
            k: "breaks",
            label: "Breaks"
          }].map(l => <div key={l.k} className="flex items-center gap-1.5 text-[11px]" style={{
            color: C.sub
          }}>
                <span className="w-2 h-2 rounded-full" style={{
              background: segColors[l.k]
            }} />
                {l.label}
              </div>)}
          </div>
        </Card>
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Calendar insights                                                    */
/* ------------------------------------------------------------------ */
function An_CalendarInsightsSection({ monthEvents }) {
  const eventsCompleted = monthEvents.filter(e => e.status === "Done").length;
  const meetingsAttended = monthEvents.filter(e => e.category === "Meetings" && e.status === "Done").length;
  const studySessions = monthEvents.filter(e => e.category === "Learning").length;
  const scheduledHours = monthEvents.reduce((s, e) => s + e.duration, 0);
  const distinctDays = new Set(monthEvents.map(e => e.date)).size;
  const gridHoursPerDay = 16; // 6am–10pm, matches the calendar's visible grid
  const utilization = distinctDays ? Math.min(100, Math.round((scheduledHours / (distinctDays * gridHoursPerDay)) * 100)) : 0;
  const stats = [{
    label: "Events Completed",
    value: `${eventsCompleted}`,
    icon: CalendarCheck
  }, {
    label: "Meetings Attended",
    value: `${meetingsAttended}`,
    icon: Users
  }, {
    label: "Study Sessions",
    value: `${studySessions}`,
    icon: BookOpen
  }, {
    label: "Scheduled Hours",
    value: `${scheduledHours.toFixed(1)}h`,
    icon: Clock
  }, {
    label: "Schedule Utilization",
    value: `${utilization}%`,
    icon: PieChartIcon
  }];
  return <div className="mb-6 lg:mb-8">
      <An_SectionHeading eyebrow="Calendar" title="Calendar Insights" delay={1160} />
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {stats.map((s, i) => <An_ProgressStat key={s.label} label={s.label} value={s.value} icon={s.icon} delay={1180 + i * 30} />)}
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* AI productivity insights                                             */
/* ------------------------------------------------------------------ */
function An_AiInsightCard({
  icon: Icon,
  title,
  text,
  delay,
  tone = "default"
}) {
  const toneStyles = {
    default: {
      iconBg: C.cardMuted,
      iconColor: C.text,
      border: C.border
    },
    warn: {
      iconBg: "rgba(154,106,46,0.12)",
      iconColor: C.warn,
      border: "rgba(154,106,46,0.35)"
    }
  };
  const t = toneStyles[tone];
  return <Card className="p-5" delay={delay} style={tone === "warn" ? {
    borderColor: t.border
  } : {}}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{
        background: t.iconBg
      }}>
          <Icon size={14.5} color={t.iconColor} strokeWidth={1.75} />
        </div>
        <div>
          <span className="text-[13px] font-medium block mb-1" style={{
          color: C.text
        }}>
            {title}
          </span>
          <p className="text-[12.5px] leading-relaxed" style={{
          color: C.sub
        }}>
            {text}
          </p>
        </div>
      </div>
    </Card>;
}
function An_AiInsightsSection() {
  const [asked, setAsked] = useState(false);
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [askError, setAskError] = useState(null);
  const [insights, setInsights] = useState([]);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const insightIcons = [Star, Sunrise, AlertTriangle, Rocket, FileText, ShieldAlert];

  useEffect(() => {
    getInsights()
      .then(setInsights)
      .catch(() => setInsights([]))
      .finally(() => setInsightsLoading(false));
  }, []);

  function askAi() {
    setAsked(true);
    setAsking(true);
    setAskError(null);
    sendMessage("Give me a brief analysis of my productivity analytics — what's trending well and what should I watch out for?")
      .then(reply => setAnswer(reply.content))
      .catch(err => setAskError(err instanceof Error ? err.message : "Couldn't reach the assistant"))
      .finally(() => setAsking(false));
  }

  return <div className="mb-6 lg:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <An_SectionHeading eyebrow="Cortex AI" title="AI Productivity Insights" delay={1300} />
        <button onClick={askAi} disabled={asking} className="glossy-btn glitter-sm flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-medium shrink-0 transition-transform duration-150 hover:-translate-y-0.5" style={{
        background: C.glossDark,
        color: C.onInk,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`
      }}>
          <Wand2 size={14.5} strokeWidth={1.75} />
          Ask AI About My Analytics
        </button>
      </div>

      {asked && <Card className="p-5 mb-5 panel-drop" style={{
      borderColor: C.ink
    }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 glitter-sm" style={{
          background: C.glossDark
        }}>
              <Sparkles size={14.5} color={C.onInk} strokeWidth={1.75} />
            </div>
            <p className="text-[13px] leading-relaxed" style={{
          color: askError ? C.warn : C.text
        }}>
              {asking ? "Thinking…" : askError ? askError : answer}
            </p>
          </div>
        </Card>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {!insightsLoading && insights.length === 0 && <p className="text-[12.5px]" style={{ color: C.faint }}>No insights yet — check back after you've used Cortex a bit more.</p>}
        {insights.map((ins, i) => <An_AiInsightCard key={ins.id} icon={insightIcons[i % insightIcons.length]} title={ins.title} text={ins.body} delay={1320 + i * 30} />)}
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Achievements                                                        */
/* ------------------------------------------------------------------ */
function An_AchievementCard({
  icon: Icon,
  title,
  desc,
  date,
  rare,
  delay
}) {
  return <Card className={`p-5 ${rare ? "glitter-sm" : ""}`} delay={delay} style={rare ? {
    background: C.glossDark
  } : {}}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{
        background: rare ? "rgba(244,244,242,0.12)" : C.cardMuted,
        border: `1px solid ${rare ? "rgba(244,244,242,0.25)" : C.border}`
      }}>
          <Icon size={15} color={rare ? C.onInk : C.text} strokeWidth={1.75} />
        </div>
        <div>
          <span className="text-[13px] font-medium block" style={{
          color: rare ? C.onInk : C.text
        }}>
            {title}
          </span>
          <p className="text-[12px] mt-0.5 leading-relaxed" style={{
          color: rare ? C.onInkSub : C.sub
        }}>
            {desc}
          </p>
          <span className="text-[11px] mt-1.5 block" style={{
          color: rare ? C.onInkSub : C.faint
        }}>
            {date}
          </span>
        </div>
      </div>
    </Card>;
}
function An_AchievementsSection({ tasks, goals, habits }) {
  const completedTasks = tasks.filter(t => t.done).length;
  const completedGoals = goals.filter(g => g.status === "Completed").length;
  const bestHabit = habits.reduce((best, h) => (h.streak > (best?.streak || 0) ? h : best), null);
  const longestEver = habits.length ? Math.max(...habits.map(h => h.longestStreak || 0)) : 0;

  const achievements = [];
  if (bestHabit && bestHabit.streak >= 3) {
    achievements.push({
      icon: Flame,
      title: `${bestHabit.streak}-Day Streak`,
      desc: `You've kept up "${bestHabit.name}" for ${bestHabit.streak} days straight.`,
      date: "Current streak",
      rare: bestHabit.streak >= 14
    });
  }
  if (longestEver >= 14) {
    achievements.push({
      icon: Trophy,
      title: "Consistency Master",
      desc: `Your longest habit streak ever is ${longestEver} days.`,
      date: "Personal best",
      rare: longestEver >= 30
    });
  }
  if (completedGoals > 0) {
    achievements.push({
      icon: Target,
      title: "Goal Crusher",
      desc: `You've completed ${completedGoals} goal${completedGoals === 1 ? "" : "s"} so far.`,
      date: "All-time",
      rare: completedGoals >= 5
    });
  }
  if (completedTasks >= 10) {
    achievements.push({
      icon: CheckSquare,
      title: "Task Milestone",
      desc: `You've checked off ${completedTasks} tasks.`,
      date: "All-time",
      rare: completedTasks >= 100
    });
  }
  if (achievements.length === 0) {
    achievements.push({
      icon: Rocket,
      title: "Just Getting Started",
      desc: "Complete tasks, build habit streaks, and finish goals to start unlocking achievements.",
      date: "Welcome to Cortex",
      rare: false
    });
  }

  return <div className="mb-6 lg:mb-8">
      <An_SectionHeading eyebrow="Milestones" title="Achievements" delay={1520} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {achievements.map((a, i) => <An_AchievementCard key={a.title} {...a} delay={1540 + i * 40} />)}
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Comparison section                                                   */
/* ------------------------------------------------------------------ */
function An_Sparkline({
  points
}) {
  const w = 100,
    h = 32;
  const min = Math.min(...points),
    max = Math.max(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p - min) / range * h}`).join(" ");
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="overflow-visible">
      <path d={d} fill="none" stroke={C.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>;
}
function An_ComparisonCard({
  item,
  delay
}) {
  const change = ((item.current - item.previous) / item.previous * 100).toFixed(1);
  const up = change >= 0;
  return <Card className="p-5" delay={delay}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px]" style={{
        color: C.faint
      }}>
          {item.label}
        </span>
        <An_TrendBadge up={up} value={`${up ? "+" : ""}${change}%`} />
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-[22px] font-semibold tracking-tight" style={{
            color: C.text
          }}>
              {item.current}
              {item.unit}
            </span>
          </div>
          <span className="text-[11.5px]" style={{
          color: C.faint
        }}>
            vs {item.previous}
            {item.unit} previously
          </span>
        </div>
        <An_Sparkline points={item.spark} />
      </div>
    </Card>;
}
function An_ComparisonSection() {
  const [period, setPeriod] = useState("week");
  const { data, loading } = useAnalytics(period);
  const tabs = [{
    key: "week",
    label: "This Week vs Last Week"
  }, {
    key: "month",
    label: "This Month vs Last Month"
  }, {
    key: "year",
    label: "This Year vs Last Year"
  }];

  const comparisonData = useMemo(() => {
    if (!data) return [];
    const splitAvg = (arr, valueKey) => {
      if (!arr || arr.length < 2) return { previous: 0, current: 0, spark: arr ? arr.map(a => a[valueKey]) : [] };
      const mid = Math.ceil(arr.length / 2);
      const first = arr.slice(0, mid);
      const second = arr.slice(mid);
      const avg = list => list.length ? list.reduce((s, a) => s + a[valueKey], 0) / list.length : 0;
      return { previous: Math.round(avg(first) * 10) / 10, current: Math.round(avg(second) * 10) / 10, spark: arr.map(a => a[valueKey]) };
    };
    const productivity = splitAvg(data.productivity, "value");
    const taskCompletion = splitAvg(data.taskCompletion, "value");
    const habitConsistency = splitAvg(data.habitConsistency, "value");
    const focusHours = splitAvg(data.focusHours, "hours");
    return [
      { label: "Productivity Score", unit: "", current: productivity.current, previous: productivity.previous || 1, spark: productivity.spark },
      { label: "Task Completion", unit: "%", current: taskCompletion.current, previous: taskCompletion.previous || 1, spark: taskCompletion.spark },
      { label: "Habit Consistency", unit: "%", current: habitConsistency.current, previous: habitConsistency.previous || 1, spark: habitConsistency.spark },
      { label: "Focus Hours", unit: "h", current: focusHours.current, previous: focusHours.previous || 1, spark: focusHours.spark },
    ];
  }, [data]);

  return <div className="mb-6 lg:mb-8">
      <An_SectionHeading eyebrow="Comparison" title="Trend Comparison" delay={1780} />
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map(t => <button key={t.key} onClick={() => setPeriod(t.key)} className="px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors" style={{
        color: period === t.key ? C.onInk : C.sub,
        background: period === t.key ? C.glossDark : C.card,
        border: `1px solid ${period === t.key ? C.ink : C.border}`
      }}>
            {t.label}
          </button>)}
      </div>
      {loading && <div className="text-[13px]" style={{ color: C.faint }}>Loading…</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {!loading && comparisonData.map((item, i) => <An_ComparisonCard key={item.label} item={item} delay={1800 + i * 40} />)}
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Quick actions                                                       */
/* ------------------------------------------------------------------ */
function An_QuickActionsSection() {
  const actions = [{
    label: "Export Analytics",
    icon: Download
  }, {
    label: "Share Report",
    icon: Share2
  }, {
    label: "Generate AI Report",
    icon: Wand2
  }, {
    label: "View Detailed Insights",
    icon: Layers
  }, {
    label: "Reset Filters",
    icon: RotateCcw
  }];
  return <div className="mb-2">
      <An_SectionHeading eyebrow="Shortcuts" title="Quick Actions" delay={1960} />
      <Card className="p-4" delay={1980}>
        <div className="flex flex-wrap gap-3">
          {actions.map(a => {
          const Icon = a.icon;
          return <button key={a.label} className="icon-btn flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[13px] font-medium" style={{
            border: `1px solid ${C.border}`,
            background: C.cardMuted,
            color: C.text
          }} onMouseEnter={e => {
            e.currentTarget.style.background = C.glossDark;
            e.currentTarget.style.color = C.onInk;
          }} onMouseLeave={e => {
            e.currentTarget.style.background = C.cardMuted;
            e.currentTarget.style.color = C.text;
          }}>
                <Icon size={14.5} strokeWidth={1.75} />
                {a.label}
              </button>;
        })}
        </div>
      </Card>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Page composition                                                     */
/* ------------------------------------------------------------------ */
export function AnalyticsBody() {
  const [range, setRange] = useState("Week");
  const { data, loading, error } = useAnalytics("week");
  const { tasks } = useTasks();
  const { goals } = useGoals();
  const { habits } = useHabits();
  const monthKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);
  const { events: monthEvents } = useCalendarEvents(monthKey);

  const productivityAvg = data?.productivity?.length ? Math.round(data.productivity.reduce((s, p) => s + p.value, 0) / data.productivity.length) : 0;
  const tasksCompleted = tasks.filter(t => t.done).length;
  const goalsAchieved = goals.filter(g => g.status === "Completed").length;
  const habitCompletionAvg = habits.length ? Math.round(habits.reduce((s, h) => s + (h.completion || 0), 0) / habits.length) : 0;
  const focusHoursTotal = data?.focusHours?.length ? Math.round(data.focusHours.reduce((s, d) => s + d.hours, 0) * 10) / 10 : 0;

  if (loading) return <><An_AnalyticsHeader range={range} onRange={setRange} /><Loader label="Loading your analytics…" /></>;
  if (error) return <><An_AnalyticsHeader range={range} onRange={setRange} /><EmptyState title="Couldn't load analytics" description={error} /></>;

  return <>
      <An_AnalyticsHeader range={range} onRange={setRange} />
      <An_OverviewCards productivityAvg={productivityAvg} tasksCompleted={tasksCompleted} tasksTotal={tasks.length} goalsAchieved={goalsAchieved} goalsTotal={goals.length} habitCompletionAvg={habitCompletionAvg} focusHoursTotal={focusHoursTotal} habitsCount={habits.length} />
      <An_ProductivityDashboard />
      <An_TaskAnalyticsSection tasks={tasks} />
      <An_GoalProgressSection goals={goals} />
      <An_HabitAnalyticsSection habits={habits} habitConsistency={data?.habitConsistency || []} />
      <An_FocusTimeSection focusHours={data?.focusHours || []} monthEvents={monthEvents} />
      <An_CalendarInsightsSection monthEvents={monthEvents} />
      <An_AiInsightsSection />
      <An_AchievementsSection tasks={tasks} goals={goals} habits={habits} />
      <An_ComparisonSection />
      <An_QuickActionsSection />
    </>;
}

export default AnalyticsBody;
