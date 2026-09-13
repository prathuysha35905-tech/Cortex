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
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { useGoals } from "@/hooks/useGoals";
import { useHabits } from "@/hooks/useHabits";
import { getInsights } from "@/services/ai.service";

/* ==================================================================== */
/* Dashboard                                                              */
/* ==================================================================== */

/* ------------------------------------------------------------------ */
/* Mock data — shaped like the real Cortex API (TaskResponse,          */
/* GoalResponse, HabitResponse, DashboardAnalytics, MorningPlan, etc.) */
/* ------------------------------------------------------------------ */
// Dashboard widgets now pull from useDashboard() / useTasks() / useGoals() /
// useHabits() (real Cortex API data) instead of fixed mock arrays.
function Db_PriorityBadge({
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
/* Hero                                                                  */
/* ------------------------------------------------------------------ */
function Db_Hero({
  onOpenAssistant,
  name
}) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = name ? name.split(" ")[0] : "there";
  return <Card className="p-8 lg:p-10 mb-6 lg:mb-8" delay={40}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="text-[13px] mb-2" style={{
          color: C.faint
        }}>
            {greeting} 👋
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-tight leading-tight" style={{
          color: C.text
        }}>
            Welcome back, <span className="font-display text-[40px] sm:text-[46px] font-normal align-middle">{firstName}</span>.
          </h1>
          <p className="text-[14.5px] mt-2" style={{
          color: C.sub
        }}>
            Let's make today productive.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button className="glossy-btn glitter-sm px-4 py-2.5 rounded-lg text-[13.5px] font-medium transition-transform duration-150 hover:-translate-y-0.5" style={{
          background: C.glossDark,
          color: C.onInk,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`
        }}>
            Plan My Day
          </button>
          <button onClick={onOpenAssistant} className="px-4 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors duration-150 flex items-center gap-1.5" style={{
          border: `1px solid ${C.divider}`,
          color: C.text
        }}>
            Open AI Assistant
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </Card>;
}

/* ------------------------------------------------------------------ */
/* Quick stats                                                          */
/* ------------------------------------------------------------------ */
function Db_StatsRow({ stats }) {
  return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-6 lg:mb-8">
      {stats.map((s, i) => <Card key={s.label} className="p-5" delay={80 + i * 40}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12.5px]" style={{
          color: C.faint
        }}>
              {s.label}
            </span>
            {s.trendUp !== undefined ? (s.trendUp ? <TrendingUp size={14} color={C.sub} /> : <TrendingDown size={14} color={C.sub} />) : null}
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
            {s.delta}
          </div>
        </Card>)}
    </div>;
}

/* ------------------------------------------------------------------ */
/* Today's tasks + schedule                                             */
/* ------------------------------------------------------------------ */
function Db_TasksCard({ tasks, onToggle }) {
  return <Card className="p-6 lg:p-7" delay={220}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-semibold" style={{
        color: C.text
      }}>
          Today's Tasks
        </h3>
        <button className="text-[12px] flex items-center gap-1" style={{
        color: C.faint
      }}>
          View all <ChevronRight size={13} />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {tasks.length === 0 && <div className="text-[13px] py-6 text-center" style={{ color: C.faint }}>No tasks for today.</div>}
        {tasks.map(t => <div key={t.id} className="flex items-center gap-3 py-2.5 px-2 rounded-lg transition-colors duration-150" style={{
        borderBottom: `1px solid ${C.borderSoft}`
      }}>
            <button onClick={() => onToggle(t.id, !t.done)} className={`w-[18px] h-[18px] rounded-md flex items-center justify-center shrink-0 transition-colors ${t.done ? "glitter-sm" : ""}`} style={{
          border: `1px solid ${t.done ? "#000" : C.divider}`,
          background: t.done ? C.glossDark : "transparent"
        }}>
              {t.done && <Check size={12} color={C.onInk} strokeWidth={3} />}
            </button>
            <span className="text-[13.5px] flex-1 truncate" style={{
          color: t.done ? C.faint : C.text,
          textDecoration: t.done ? "line-through" : "none"
        }}>
              {t.title}
            </span>
            <span className="text-[11.5px] shrink-0" style={{
          color: C.faint
        }}>
              {t.time}
            </span>
            <Db_PriorityBadge priority={t.priority} />
          </div>)}
      </div>
    </Card>;
}
function Db_ScheduleCard({ schedule }) {
  return <Card className="p-6 lg:p-7" delay={260}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-semibold" style={{
        color: C.text
      }}>
          Today's Schedule
        </h3>
        <Clock size={14} color={C.faint} />
      </div>
      <div className="relative pl-5">
        <div className="absolute left-[3px] top-1 bottom-1 w-px" style={{
        background: C.divider
      }} />
        <div className="flex flex-col gap-5">
          {schedule.length === 0 && <div className="text-[13px]" style={{ color: C.faint }}>Nothing scheduled today.</div>}
          {schedule.map(s => <div key={s.time} className="relative flex items-center gap-4">
              <span className="absolute -left-5 w-2 h-2 rounded-full" style={{
            background: C.ink
          }} />
              <span className="text-[12.5px] w-11 shrink-0" style={{
            color: C.faint
          }}>
                {s.time}
              </span>
              <span className="text-[13.5px]" style={{
            color: C.text
          }}>
                {s.title}
              </span>
            </div>)}
        </div>
      </div>
    </Card>;
}

/* ------------------------------------------------------------------ */
/* Weekly productivity chart                                            */
/* ------------------------------------------------------------------ */
function Db_ProductivityChart({ productivity }) {
  const [active, setActive] = useState(null);
  const avg = productivity.length ? Math.round(productivity.reduce((s, d) => s + d.value, 0) / productivity.length) : 0;
  return <Card className="p-6 lg:p-7 mb-6 lg:mb-8" delay={300}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-baseline gap-2.5">
          <h3 className="text-[15px] font-semibold" style={{
          color: C.text
        }}>
            Weekly Productivity
          </h3>
          <span className="font-display font-medium text-[22px] leading-none relative -top-0.5" style={{
          color: C.faint
        }}>
            your rhythm
          </span>
        </div>
        <span className="text-[12px]" style={{
        color: C.faint
      }}>
          Avg {avg}%
        </span>
      </div>
      <p className="text-[12.5px] mb-6" style={{
      color: C.sub
    }}>
        Track your consistency throughout the week.
      </p>
      <div style={{
      width: "100%",
      height: 220
    }}>
        <ResponsiveContainer>
          <BarChart data={productivity} onMouseMove={s => setActive(s?.activeTooltipIndex ?? null)} onMouseLeave={() => setActive(null)} margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0
        }}>
            <defs>
              <linearGradient id="barShine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2E2E2A" />
                <stop offset="55%" stopColor="#0D0D0C" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{
            fill: C.faint,
            fontSize: 12
          }} dy={8} />
            <Tooltip cursor={{
            fill: "rgba(13,13,12,0.04)"
          }} contentStyle={{
            background: C.ink,
            border: `1px solid ${C.ink3}`,
            borderRadius: 10,
            fontSize: 12
          }} labelStyle={{
            color: C.onInkSub
          }} itemStyle={{
            color: C.onInk
          }} />
            <Bar dataKey="value" radius={[6, 6, 6, 6]} maxBarSize={34}>
              {productivity.map((_, i) => <Cell key={i} fill={active === i ? "url(#barShine)" : "#BFBFB7"} style={{
              transition: "fill 150ms ease"
            }} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>;
}

/* ------------------------------------------------------------------ */
/* Goals / Habits / AI Insight row                                      */
/* ------------------------------------------------------------------ */
function Db_GoalsCard({ goals }) {
  return <Card className="p-6 lg:p-7" delay={340}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-semibold" style={{
        color: C.text
      }}>
          Goals
        </h3>
        <Plus size={14} color={C.faint} />
      </div>
      <div className="flex flex-col gap-5">
        {goals.length === 0 && <div className="text-[13px]" style={{ color: C.faint }}>No active goals yet.</div>}
        {goals.map(g => <div key={g.id}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-medium" style={{
            color: C.text
          }}>
                {g.title}
              </span>
              <span className="text-[12px]" style={{
            color: C.faint
          }}>
                {g.progress}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{
          background: C.borderSoft
        }}>
              <div className="h-full rounded-full bar-grow glitter-sm" style={{
            background: C.glossDark,
            "--w": `${g.progress}%`
          }} />
            </div>
            <div className="text-[11px]" style={{
          color: C.faint
        }}>
              Due {g.targetDate}
            </div>
          </div>)}
      </div>
    </Card>;
}
function Db_HabitsCard({ habits, onToggle }) {
  const doneCount = habits.filter(h => h.doneToday).length;
  return <Card className="p-6 lg:p-7" delay={380}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-semibold" style={{
        color: C.text
      }}>
          Habits
        </h3>
        <span className="text-[12px]" style={{
        color: C.faint
      }}>
          {doneCount}/{habits.length}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {habits.length === 0 && <div className="text-[13px]" style={{ color: C.faint }}>No habits tracked yet.</div>}
        {habits.map(h => <div key={h.id} className="flex items-center justify-between">
            <div>
              <div className="text-[13px] font-medium" style={{
            color: C.text
          }}>
                {h.name}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Flame size={11} color={C.faint} />
                <span className="text-[11px]" style={{
              color: C.faint
            }}>
                  {h.streak}-day streak
                </span>
              </div>
            </div>
            <button onClick={() => onToggle(h.id, !h.doneToday)} className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${h.doneToday ? "glitter-sm" : ""}`} style={{
          border: `1px solid ${h.doneToday ? "#000" : C.divider}`,
          background: h.doneToday ? C.glossDark : "transparent"
        }}>
              {h.doneToday && <Check size={13} color={C.onInk} strokeWidth={3} />}
            </button>
          </div>)}
      </div>
    </Card>;
}
function Db_InsightCard({ insight }) {
  const [applied, setApplied] = useState(false);
  return <Card className="p-6 lg:p-7 flex flex-col" delay={420}>
      <div className="flex items-center gap-2 mb-5">
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
          AI Insight
        </h3>
      </div>

      <div className="flex items-start gap-3 mb-6">
        <Sparkles size={16} color={C.sub} className="mt-0.5 shrink-0" />
        <p className="text-[13.5px] leading-relaxed" style={{
        color: C.sub
      }}>
          {insight ? insight.body : "Keep using Cortex and your AI insights will show up here."}
        </p>
      </div>

      <button onClick={() => setApplied(true)} disabled={applied || !insight} className={`mt-auto px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${!applied ? "glitter-sm" : ""}`} style={{
      background: applied ? "transparent" : C.glossDark,
      color: applied ? C.faint : C.onInk,
      border: applied ? `1px solid ${C.divider}` : "1px solid transparent",
      boxShadow: applied ? "none" : `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`
    }}>
        {applied ? "Suggestion applied" : "Apply Suggestion"}
      </button>
    </Card>;
}

/* ------------------------------------------------------------------ */
/* Recent activity — derived from real completed tasks and habits       */
/* ------------------------------------------------------------------ */
function Db_ActivityCard({ activity }) {
  return <Card className="p-6 lg:p-7 mt-6 lg:mt-8" delay={460}>
      <h3 className="text-[15px] font-semibold mb-5" style={{
      color: C.text
    }}>
        Recent Activity
      </h3>
      <div className="flex flex-col">
        {activity.length === 0 && <div className="text-[13px] py-3" style={{ color: C.faint }}>Nothing completed yet — check things off your tasks and habits to see them here.</div>}
        {activity.map((a, i) => <div key={a.id} className="flex items-center gap-3 py-3" style={{
        borderBottom: i < activity.length - 1 ? `1px solid ${C.borderSoft}` : "none"
      }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{
          background: C.cardMuted,
          border: `1px solid ${C.border}`
        }}>
              <Check size={12} color={C.sub} strokeWidth={2.5} />
            </div>
            <span className="text-[13.5px] flex-1" style={{
          color: C.text
        }}>
              {a.text}
            </span>
            <span className="text-[11.5px]" style={{
          color: C.faint
        }}>
              {a.time}
            </span>
          </div>)}
      </div>
    </Card>;
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* AI Assistant page                                                    */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Assembled dashboard body (Hero -> Stats -> Tasks/Schedule -> Chart -> */
/* Goals/Habits/Insight -> Activity)                                    */
/* ------------------------------------------------------------------ */
export function DashboardBody({ onOpenAssistant }) {
  const { data, loading, error } = useDashboard();
  const { user } = useAuth();
  const { tasks, toggleDone } = useTasks();
  const { goals } = useGoals();
  const { habits, toggleToday } = useHabits();
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    getInsights()
      .then(list => setInsight(list?.[0] ?? null))
      .catch(() => setInsight(null));
  }, []);

  const todaysTasks = useMemo(() => tasks.filter(t => t.date === "Today"), [tasks]);
  const activeGoals = useMemo(() => goals.filter(g => g.status === "Active" && !g.archived).slice(0, 3), [goals]);

  const activity = useMemo(() => {
    const fromTasks = tasks.filter(t => t.done).map(t => ({ id: `task-${t.id}`, text: `Completed "${t.title}"`, time: t.date }));
    const fromHabits = habits.filter(h => h.doneToday).map(h => ({ id: `habit-${h.id}`, text: `${h.name} completed`, time: "Today" }));
    return [...fromTasks, ...fromHabits].slice(0, 6);
  }, [tasks, habits]);

  if (loading) return <Loader label="Loading your dashboard…" />;
  if (error) return <EmptyState title="Couldn't load your dashboard" description={error} />;

  return (
    <>
      <Db_Hero onOpenAssistant={onOpenAssistant} name={user?.name} />
      <Db_StatsRow stats={data?.stats ?? []} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-7 mb-6 lg:mb-8">
        <Db_TasksCard tasks={todaysTasks} onToggle={(id, done) => toggleDone(id, done).catch(() => {})} />
        <Db_ScheduleCard schedule={data?.schedule ?? []} />
      </div>

      <Db_ProductivityChart productivity={data?.productivity ?? []} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7">
        <Db_GoalsCard goals={activeGoals} />
        <Db_HabitsCard habits={habits.slice(0, 6)} onToggle={toggleToday} />
        <Db_InsightCard insight={insight} />
      </div>

      <Db_ActivityCard activity={activity} />
    </>
  );
}


export default DashboardBody;
