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
import { useHabits } from "@/hooks/useHabits";

/* ==================================================================== */
/* Habits                                                                 */
/* ==================================================================== */

/* ------------------------------------------------------------------ */
/* Mock data — shaped like a real Cortex HabitResponse schema           */
/* ------------------------------------------------------------------ */
const Hb_categoryMeta = {
  Health: {
    icon: Heart
  },
  Fitness: {
    icon: Dumbbell
  },
  Learning: {
    icon: BookOpen
  },
  Productivity: {
    icon: Briefcase
  },
  Mindfulness: {
    icon: Brain
  },
  Personal: {
    icon: User
  },
  Custom: {
    icon: Layers
  }
};
// Habit data now comes from useHabits() (real Cortex HabitResponse API).
// Achievements and AI coach insights are now derived from real habit data
// in Hb_Achievements / Hb_AiHabitCoach, instead of fixed mock arrays.
const Hb_DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const Hb_DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/* ------------------------------------------------------------------ */
/* Small building blocks                                                */
/* ------------------------------------------------------------------ */

function Hb_CategoryBadge({
  category
}) {
  const Icon = Hb_categoryMeta[category]?.icon ?? Layers;
  return <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{
    background: C.cardMuted,
    color: C.sub,
    border: `1px solid ${C.borderSoft}`
  }}>
      <Icon size={10.5} strokeWidth={1.75} />
      {category}
    </span>;
}

/* ------------------------------------------------------------------ */
/* Sidebar — identical structure/behavior to the Tasks page             */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Search bar — reusable                                                */
/* ------------------------------------------------------------------ */
function Hb_SearchBar({
  value,
  onChange,
  placeholder = "Search habits…",
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
/* 1. Header                                                            */
/* ------------------------------------------------------------------ */
function Hb_HabitsHeader({
  search,
  onSearch,
  onAddHabit,
  total,
  doneToday
}) {
  return <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-7 fade-up" style={{
    animationDelay: "20ms"
  }}>
      <div>
        <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-tight leading-tight" style={{
        color: C.text
      }}>
          <span className="font-display text-[38px] sm:text-[44px] font-normal align-middle">Habits</span>
        </h1>
        <p className="text-[13.5px] mt-1" style={{
        color: C.sub
      }}>
          {total} habits tracked · {doneToday} completed today
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Hb_SearchBar value={search} onChange={onSearch} className="w-full sm:w-[260px]" />
        <button onClick={onAddHabit} className="glossy-btn glitter-sm flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13.5px] font-medium shrink-0 transition-transform duration-150 hover:-translate-y-0.5" style={{
        background: C.glossDark,
        color: C.onInk,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`
      }}>
          <Plus size={15} strokeWidth={2} />
          Add Habit
        </button>
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* 2. Habit Categories                                                  */
/* ------------------------------------------------------------------ */
function Hb_HabitCategories({
  habits,
  active,
  onChange
}) {
  const cats = [{
    key: "All",
    label: "All"
  }, ...Object.keys(Hb_categoryMeta).map(c => ({
    key: c,
    label: c
  }))];
  const counts = useMemo(() => {
    const c = {
      All: habits.length
    };
    habits.forEach(h => {
      c[h.category] = (c[h.category] ?? 0) + 1;
    });
    return c;
  }, [habits]);
  return <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 fade-up" style={{
    animationDelay: "60ms"
  }}>
      {cats.map(c => {
      const isActive = active === c.key;
      const Icon = c.key === "All" ? Hb_ListLikeIcon : Hb_categoryMeta[c.key]?.icon;
      return <button key={c.key} onClick={() => onChange(c.key)} className="cat-pill flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium shrink-0" style={{
        background: isActive ? C.cardMuted : C.card,
        color: C.text,
        border: `1px solid ${isActive ? C.ink : C.border}`,
        boxShadow: C.shadow
      }}>
            {Icon && <Icon size={13} strokeWidth={1.75} color={C.sub} />}
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
const Hb_ListLikeIcon = Repeat;

/* ------------------------------------------------------------------ */
/* 3. Today's Habits — Habit Card                                       */
/* ------------------------------------------------------------------ */
function Hb_HabitCard({
  habit,
  delay,
  onToggleDone,
  onDelete,
  onEdit,
  onPause
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  return <Card className="p-4" delay={delay}>
      <div className="flex items-start gap-3">
        <button onClick={() => onToggleDone(habit.id)} disabled={habit.paused} className={`mt-0.5 w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 transition-colors ${habit.doneToday ? "glitter-sm" : ""}`} style={{
        border: `1px solid ${habit.doneToday ? "#000" : C.divider}`,
        background: habit.doneToday ? C.glossDark : "transparent",
        opacity: habit.paused ? 0.45 : 1
      }} aria-label="Mark habit complete">
          {habit.doneToday && <Check size={13} color={C.onInk} strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13.5px] font-medium" style={{
                color: habit.paused ? C.faint : C.text,
                textDecoration: habit.paused ? "line-through" : "none"
              }}>
                  {habit.name}
                </span>
                {habit.paused && <span className="flex items-center gap-1 text-[10.5px] font-medium px-1.5 py-0.5 rounded-full" style={{
                background: C.cardMuted,
                color: C.faint,
                border: `1px solid ${C.borderSoft}`
              }}>
                    <PauseCircle size={9} />
                    Paused
                  </span>}
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-1.5">
                <Hb_CategoryBadge category={habit.category} />
                <span className="flex items-center gap-1 text-[11.5px]" style={{
                color: C.faint
              }}>
                  <Clock size={11.5} />
                  {habit.reminder}
                </span>
              </div>
            </div>

            <div className="relative shrink-0" ref={menuRef}>
              <button onClick={() => setMenuOpen(o => !o)} className="icon-btn w-7 h-7 rounded-lg flex items-center justify-center" style={{
              color: C.faint
            }} aria-label="Habit actions">
                <MoreHorizontal size={15} />
              </button>
              {menuOpen && <div className="panel-drop absolute right-0 z-20 mt-1 min-w-[160px] rounded-xl p-1.5" style={{
              background: C.glossCard,
              border: `1px solid ${C.border}`,
              boxShadow: C.shadowLift
            }}>
                  {[{
                label: "Edit",
                icon: Pencil,
                onClick: () => onEdit(habit.id)
              }, {
                label: habit.doneToday ? "Mark incomplete" : "Mark complete",
                icon: Check,
                onClick: () => onToggleDone(habit.id)
              }, {
                label: habit.paused ? "Resume habit" : "Pause habit",
                icon: habit.paused ? PlayCircle : PauseCircle,
                onClick: () => onPause(habit.id)
              }, {
                label: "Delete",
                icon: Trash2,
                onClick: () => onDelete(habit.id),
                danger: true
              }].map(item => {
                const ItemIcon = item.icon;
                return <button key={item.label} onClick={() => {
                  item.onClick();
                  setMenuOpen(false);
                }} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] text-left" style={{
                  color: item.danger ? C.bad : C.text
                }} onMouseEnter={e => e.currentTarget.style.background = C.cardMuted} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <ItemIcon size={13} strokeWidth={1.75} />
                        {item.label}
                      </button>;
              })}
                </div>}
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-3">
            <Flame size={13} color={habit.streak > 0 ? C.text : C.faint} strokeWidth={1.9} />
            <span className="text-[12.5px] font-medium" style={{
            color: C.text
          }}>
              {habit.streak}-day streak
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2.5">
            <div className="h-1.5 rounded-full overflow-hidden flex-1" style={{
            background: C.borderSoft
          }}>
              <div className="h-full rounded-full" style={{
              background: C.glossDark,
              width: `${habit.progress}%`,
              transition: "width 400ms ease"
            }} />
            </div>
            <span className="text-[11px] shrink-0" style={{
            color: C.faint
          }}>
              {habit.progress}%
            </span>
          </div>
        </div>
      </div>
    </Card>;
}
function Hb_TodaysHabits({
  habits,
  onToggleDone,
  onDelete,
  onEdit,
  onPause
}) {
  if (habits.length === 0) {
    return <div className="flex flex-col items-center justify-center text-center py-16 rounded-xl fade-up mb-6 lg:mb-8" style={{
      border: `1px dashed ${C.divider}`,
      background: C.cardMuted
    }}>
        <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3" style={{
        background: C.card,
        border: `1px solid ${C.border}`
      }}>
          <Repeat size={18} color={C.faint} />
        </div>
        <p className="text-[13.5px] font-medium" style={{
        color: C.text
      }}>
          No habits match these filters
        </p>
        <p className="text-[12.5px] mt-1" style={{
        color: C.sub
      }}>
          Try a different category or clear your search.
        </p>
      </div>;
  }
  return <div className="mb-6 lg:mb-8">
      <h2 className="text-[15px] font-semibold mb-4 fade-up" style={{
      color: C.text,
      animationDelay: "90ms"
    }}>
        Today's Habits
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {habits.map((h, i) => <Hb_HabitCard key={h.id} habit={h} delay={110 + i * 25} onToggleDone={onToggleDone} onDelete={onDelete} onEdit={onEdit} onPause={onPause} />)}
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* 4. Habit Streaks — Streak Card                                       */
/* ------------------------------------------------------------------ */
function Hb_StreakCard({
  habit,
  delay
}) {
  return <Card className="p-5 min-w-[220px]" delay={delay}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12.5px] font-medium truncate" style={{
        color: C.text
      }}>
          {habit.name}
        </span>
        <Hb_CategoryBadge category={habit.category} />
      </div>

      <div className="flex items-baseline gap-1.5 mb-1">
        <Flame size={16} color={C.text} strokeWidth={1.9} />
        <span className="text-[24px] font-semibold tracking-tight" style={{
        color: C.text
      }}>
          {habit.streak}
        </span>
        <span className="text-[12px]" style={{
        color: C.sub
      }}>
          day streak
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4 pt-4" style={{
      borderTop: `1px solid ${C.borderSoft}`
    }}>
        <div>
          <div className="text-[10.5px] mb-0.5" style={{
          color: C.faint
        }}>
            Longest
          </div>
          <div className="text-[13.5px] font-semibold" style={{
          color: C.text
        }}>
            {habit.longestStreak}d
          </div>
        </div>
        <div>
          <div className="text-[10.5px] mb-0.5" style={{
          color: C.faint
        }}>
            Completion
          </div>
          <div className="text-[13.5px] font-semibold" style={{
          color: C.text
        }}>
            {habit.completion}%
          </div>
        </div>
        <div>
          <div className="text-[10.5px] mb-0.5" style={{
          color: C.faint
        }}>
            Missed
          </div>
          <div className="text-[13.5px] font-semibold" style={{
          color: C.text
        }}>
            {habit.missedDays}d
          </div>
        </div>
      </div>
    </Card>;
}
function Hb_HabitStreaks({
  habits
}) {
  const topStreaks = useMemo(() => [...habits].sort((a, b) => b.streak - a.streak).slice(0, 4), [habits]);
  return <div className="mb-6 lg:mb-8">
      <h2 className="text-[15px] font-semibold mb-4 fade-up" style={{
      color: C.text,
      animationDelay: "150ms"
    }}>
        Habit Streaks
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {topStreaks.map((h, i) => <Hb_StreakCard key={h.id} habit={h} delay={170 + i * 30} />)}
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* 5. Weekly Habit Tracker                                              */
/* ------------------------------------------------------------------ */
function Hb_HabitTracker({
  habits
}) {
  return <Card className="p-5" delay={230}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[560px]">
          <thead>
            <tr>
              <th className="text-left text-[11.5px] font-medium pb-3 pr-3" style={{
              color: C.faint
            }}>
                Habit
              </th>
              {Hb_DAYS.map((d, i) => <th key={i} className="text-center text-[11.5px] font-medium pb-3 px-1" style={{
              color: C.faint
            }} title={Hb_DAY_NAMES[i]}>
                  {d}
                </th>)}
            </tr>
          </thead>
          <tbody>
            {habits.map(h => <tr key={h.id} style={{
            borderTop: `1px solid ${C.borderSoft}`
          }}>
                <td className="py-3 pr-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[12.5px] font-medium truncate" style={{
                  color: C.text
                }}>
                      {h.name}
                    </span>
                  </div>
                </td>
                {h.week.map((done, i) => <td key={i} className="text-center py-3 px-1">
                    <span className={`inline-flex w-6 h-6 rounded-md items-center justify-center ${done ? "glitter-sm" : ""}`} style={{
                background: done ? C.glossDark : "transparent",
                border: `1px solid ${done ? "#000" : C.borderSoft}`
              }} aria-label={`${Hb_DAY_NAMES[i]}: ${done ? "completed" : "missed"}`}>
                      {done && <Check size={11} color={C.onInk} strokeWidth={3} />}
                    </span>
                  </td>)}
              </tr>)}
          </tbody>
        </table>
      </div>
    </Card>;
}
function Hb_WeeklyHabitTracker({
  habits
}) {
  return <div className="mb-6 lg:mb-8">
      <h2 className="text-[15px] font-semibold mb-4 fade-up" style={{
      color: C.text,
      animationDelay: "210ms"
    }}>
        Weekly Habit Tracker
      </h2>
      <Hb_HabitTracker habits={habits} />
    </div>;
}

/* ------------------------------------------------------------------ */
/* 6. AI Habit Coach                                                    */
/* ------------------------------------------------------------------ */
function Hb_AiCoachCard({
  insight,
  delay
}) {
  const [applied, setApplied] = useState(false);
  const Icon = insight.icon;
  return <Card className="p-5 flex flex-col" delay={delay}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{
        background: C.cardMuted,
        border: `1px solid ${C.border}`
      }}>
          <Icon size={15} color={C.text} strokeWidth={1.75} />
        </div>
        <div className="text-[13px] font-semibold" style={{
        color: C.text
      }}>
          {insight.title}
        </div>
      </div>
      <p className="text-[12.5px] leading-relaxed mb-4 flex-1" style={{
      color: C.sub
    }}>
        {insight.text}
      </p>
      <button onClick={() => setApplied(true)} disabled={applied} className={`px-3.5 py-2 rounded-lg text-[12px] font-medium self-start transition-all duration-150 ${!applied ? "glitter-sm" : ""}`} style={{
      background: applied ? "transparent" : C.glossDark,
      color: applied ? C.faint : C.onInk,
      border: applied ? `1px solid ${C.divider}` : "1px solid transparent"
    }}>
        {applied ? "Applied" : insight.action}
      </button>
    </Card>;
}
function Hb_AiHabitCoach({
  habits,
  onOptimize,
  onGenerate
}) {
  const insights = useMemo(() => {
    if (!habits || habits.length === 0) return [];
    const list = [];

    const needsAttention = [...habits].filter(h => h.missedDays > 0).sort((a, b) => b.missedDays - a.missedDays)[0];
    if (needsAttention) {
      list.push({
        id: "attention",
        icon: Zap,
        title: "Needs attention",
        text: `${needsAttention.name} has missed ${needsAttention.missedDays} day${needsAttention.missedDays === 1 ? "" : "s"} recently — a ${needsAttention.completion}% completion rate, the lowest in your list.`,
        action: "Review habit"
      });
    }

    const almostThere = [...habits]
      .filter(h => h.longestStreak > 0 && h.streak < h.longestStreak)
      .sort((a, b) => (a.longestStreak - a.streak) - (b.longestStreak - b.streak))[0];
    if (almostThere) {
      const diff = almostThere.longestStreak - almostThere.streak;
      list.push({
        id: "almost-there",
        icon: Sparkles,
        title: "Personalized motivation",
        text: `You're ${diff} day${diff === 1 ? "" : "s"} from tying your longest-ever streak on ${almostThere.name}. Don't break the chain now.`,
        action: "Keep going"
      });
    }

    const byReminder = {};
    habits.forEach(h => {
      if (!h.reminder) return;
      (byReminder[h.reminder] ||= []).push(h);
    });
    const stackPair = Object.values(byReminder).find(group => group.length >= 2);
    if (stackPair) {
      list.push({
        id: "stack",
        icon: Lightbulb,
        title: "Suggested improvement",
        text: `Stack ${stackPair[1].name} right after ${stackPair[0].name} — both set for ${stackPair[0].reminder}, and pairing habits raises follow-through.`,
        action: "Stack habits"
      });
    }

    const mostConsistent = [...habits].sort((a, b) => (b.completion || 0) - (a.completion || 0))[0];
    if (mostConsistent) {
      list.push({
        id: "consistent",
        icon: Sunrise,
        title: "Consistency highlight",
        text: `${mostConsistent.name} has a ${mostConsistent.completion}% completion rate — your most consistent habit right now.`,
        action: "See details"
      });
    }

    return list.slice(0, 4);
  }, [habits]);

  return <div className="mb-6 lg:mb-8">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-2 fade-up" style={{
        animationDelay: "270ms"
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
            AI Habit Coach
          </h2>
        </div>
        <div className="flex items-center gap-2.5 fade-up" style={{
        animationDelay: "280ms"
      }}>
          <button onClick={onOptimize} className="icon-btn flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12.5px] font-medium" style={{
          border: `1px solid ${C.border}`,
          background: C.card,
          color: C.text,
          boxShadow: C.shadow
        }}>
            <RotateCcw size={13} strokeWidth={1.75} />
            Optimize Routine
          </button>
          <button onClick={onGenerate} className="glossy-btn glitter-sm flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12.5px] font-medium" style={{
          background: C.glossDark,
          color: C.onInk,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`
        }}>
            <Wand2 size={13} strokeWidth={1.75} />
            Generate Suggestions
          </button>
        </div>
      </div>
      {insights.length === 0 ? <p className="text-[12.5px]" style={{ color: C.faint }}>Track a few habits and Cortex will start coaching you here.</p> : <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
        {insights.map((s, i) => <Hb_AiCoachCard key={s.id} insight={s} delay={300 + i * 40} />)}
      </div>}
    </div>;
}

/* ------------------------------------------------------------------ */
/* 7. Habit Statistics                                                  */
/* ------------------------------------------------------------------ */
function Hb_HabitStatistics({
  habits
}) {
  const total = habits.length;
  const completedToday = habits.filter(h => h.doneToday).length;
  const activeStreaks = habits.filter(h => h.streak > 0 && !h.paused).length;
  const rate = total ? Math.round(habits.reduce((s, h) => s + h.completion, 0) / total) : 0;
  const best = useMemo(() => [...habits].sort((a, b) => b.completion - a.completion)[0], [habits]);
  const stats = [{
    label: "Total Habits",
    value: total,
    icon: Repeat
  }, {
    label: "Completed Today",
    value: completedToday,
    icon: Check
  }, {
    label: "Active Streaks",
    value: activeStreaks,
    icon: Flame
  }];
  return <div className="mb-6 lg:mb-8">
      <h2 className="text-[15px] font-semibold mb-4 fade-up" style={{
      color: C.text,
      animationDelay: "460ms"
    }}>
        Habit Statistics
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
        {stats.map((s, i) => {
        const Icon = s.icon;
        return <Card key={s.label} className="p-5" delay={480 + i * 30}>
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

        <Card className="p-5" delay={480 + 3 * 30}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px]" style={{
            color: C.faint
          }}>
              Success Rate
            </span>
            <Percent size={14} color={C.sub} strokeWidth={1.75} />
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

        <Card className="p-5" delay={480 + 4 * 30}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px]" style={{
            color: C.faint
          }}>
              Best Performing
            </span>
            <TrendingUp size={14} color={C.sub} strokeWidth={1.75} />
          </div>
          <div className="text-[15px] font-semibold leading-snug truncate" style={{
          color: C.text
        }}>
            {best?.name ?? "—"}
          </div>
          <div className="text-[11.5px] mt-1" style={{
          color: C.sub
        }}>
            {best?.completion ?? 0}% completion rate
          </div>
        </Card>
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* 8. Achievements — Achievement Card                                   */
/* ------------------------------------------------------------------ */
function Hb_AchievementCard({
  achievement,
  delay
}) {
  const Icon = achievement.icon;
  return <Card className="p-5" delay={delay}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${achievement.isNew ? "glitter-sm" : ""}`} style={{
        background: C.glossDark
      }}>
          <Icon size={17} color={C.onInk} strokeWidth={1.75} />
        </div>
        {achievement.isNew && <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full" style={{
        background: C.ink,
        color: C.onInk
      }}>
            New
          </span>}
      </div>
      <div className="text-[13.5px] font-semibold" style={{
      color: C.text
    }}>
        {achievement.title}
      </div>
      <p className="text-[12px] leading-relaxed mt-1.5" style={{
      color: C.sub
    }}>
        {achievement.detail}
      </p>
      <div className="flex items-center gap-1 mt-3 text-[11px]" style={{
      color: C.faint
    }}>
        <Award size={11} />
        {achievement.date}
      </div>
    </Card>;
}
function Hb_Achievements({ habits }) {
  const achievements = useMemo(() => {
    if (!habits || habits.length === 0) return [];
    const list = [];

    const topStreak = [...habits].sort((a, b) => (b.longestStreak || 0) - (a.longestStreak || 0))[0];
    if (topStreak && topStreak.longestStreak >= 7) {
      list.push({
        id: "streak",
        icon: Medal,
        title: `${topStreak.longestStreak}-Day Streak`,
        detail: `Longest streak on record — ${topStreak.name}`,
        date: "Personal best",
        isNew: topStreak.streak === topStreak.longestStreak && topStreak.streak > 0
      });
    }

    const mostConsistent = [...habits].sort((a, b) => (b.completion || 0) - (a.completion || 0))[0];
    if (mostConsistent && mostConsistent.completion >= 80) {
      list.push({
        id: "consistency",
        icon: Star,
        title: "Consistency Champion",
        detail: `${mostConsistent.completion}% completion rate on ${mostConsistent.name}`,
        date: "Current",
        isNew: false
      });
    }

    const perfectHabit = habits.find(h => h.missedDays === 0 && (h.week || []).length > 0 && (h.week || []).every(Boolean));
    if (perfectHabit) {
      list.push({
        id: "perfect-week",
        icon: Sunrise,
        title: "Perfect Week",
        detail: `Completed ${perfectHabit.name} every day this week`,
        date: "This week",
        isNew: true
      });
    }

    if (habits.length >= 3) {
      list.push({
        id: "builder",
        icon: Trophy,
        title: "Habit Builder",
        detail: `Actively tracking ${habits.length} habits`,
        date: "Ongoing",
        isNew: false
      });
    }

    if (list.length === 0) {
      list.push({
        id: "starting",
        icon: Trophy,
        title: "Just Getting Started",
        detail: "Keep logging your habits to start unlocking achievements.",
        date: "Welcome",
        isNew: false
      });
    }

    return list.slice(0, 4);
  }, [habits]);

  return <div className="mb-6 lg:mb-8">
      <h2 className="text-[15px] font-semibold mb-4 fade-up" style={{
      color: C.text,
      animationDelay: "580ms"
    }}>
        Achievements
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {achievements.map((a, i) => <Hb_AchievementCard key={a.id} achievement={a} delay={600 + i * 30} />)}
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* 9. Quick Actions                                                     */
/* ------------------------------------------------------------------ */
function Hb_QuickActions({
  onCreate,
  onGenerate,
  onImport,
  onReset,
  onArchive
}) {
  const actions = [{
    label: "Create Habit",
    icon: Plus,
    onClick: onCreate
  }, {
    label: "AI Habit Generator",
    icon: Wand2,
    onClick: onGenerate
  }, {
    label: "Import Habits",
    icon: Upload,
    onClick: onImport
  }, {
    label: "Reset Streak",
    icon: RotateCcw,
    onClick: onReset
  }, {
    label: "Archive Habit",
    icon: Archive,
    onClick: onArchive
  }];
  return <div className="mb-2">
      <h2 className="text-[15px] font-semibold mb-4 fade-up" style={{
      color: C.text,
      animationDelay: "700ms"
    }}>
        Quick Actions
      </h2>
      <div className="flex items-center gap-2.5 flex-wrap fade-up" style={{
      animationDelay: "720ms"
    }}>
        {actions.map(a => {
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
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* 9b. Create / Edit habit modal                                        */
/* ------------------------------------------------------------------ */
function Hb_HabitFormModal({ mode, initial, onClose, onSubmit }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? Object.keys(Hb_categoryMeta)[0]);
  const [reminder, setReminder] = useState(initial?.reminder ?? "8:00 AM");
  const canSave = name.trim().length > 0;

  return <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{
    background: "rgba(13,13,12,0.5)",
    backdropFilter: "blur(6px)"
  }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="fade-up w-full max-w-[440px] rounded-2xl p-6" style={{
      background: C.glossCard,
      border: `1px solid ${C.border}`,
      boxShadow: C.shadowLift
    }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-semibold" style={{
          color: C.text
        }}>
            {mode === "edit" ? "Edit Habit" : "Create Habit"}
          </h3>
          <button onClick={onClose} className="icon-btn w-7 h-7 rounded-lg flex items-center justify-center" style={{
          color: C.faint
        }}>
            <X size={15} />
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="text-[12px] font-medium block mb-1.5" style={{
            color: C.sub
          }}>
              Habit name
            </label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Drink 8 glasses of water" className="w-full px-3 py-2.5 rounded-lg text-[13.5px] outline-none" style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            color: C.text
          }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium block mb-1.5" style={{
              color: C.sub
            }}>
                Category
              </label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-[13.5px] outline-none" style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              color: C.text
            }}>
                {Object.keys(Hb_categoryMeta).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium block mb-1.5" style={{
              color: C.sub
            }}>
                Reminder
              </label>
              <input value={reminder} onChange={e => setReminder(e.target.value)} placeholder="e.g. 8:00 AM" className="w-full px-3 py-2.5 rounded-lg text-[13.5px] outline-none" style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              color: C.text
            }} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="icon-btn px-3.5 py-2 rounded-lg text-[12.5px] font-medium" style={{
          border: `1px solid ${C.border}`,
          color: C.text
        }}>
            Cancel
          </button>
          <button onClick={() => canSave && onSubmit({
          name: name.trim(),
          category,
          reminder: reminder.trim(),
          doneToday: initial?.doneToday ?? false,
          paused: initial?.paused ?? false
        })} className="glossy-btn glitter-sm flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12.5px] font-medium" style={{
          background: C.glossDark,
          color: C.onInk,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`
        }}>
            {mode === "edit" ? <Save size={13} /> : <Plus size={13} />}
            {mode === "edit" ? "Save Changes" : "Create Habit"}
          </button>
        </div>
      </div>
    </div>;
}

/* ------------------------------------------------------------------ */
/* Habits page body                                                     */
/* ------------------------------------------------------------------ */
export function HabitsBody() {
  const { habits, loading, error, add, update, toggleToday, remove } = useHabits();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [formModal, setFormModal] = useState(null); // { mode: "create" | "edit", habit? }
  const [toast, setToast] = useState("");

  const showToast = useCallback(msg => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  }, []);

  const toggleDone = id => {
    const h = habits.find(h => h.id === id);
    if (!h) return;
    toggleToday(id, !h.doneToday).catch(() => {});
  };
  const deleteHabit = id => remove(id).catch(() => {});
  const editHabit = id => {
    const h = habits.find(h => h.id === id);
    if (!h) return;
    setFormModal({ mode: "edit", habit: h });
  };
  const pauseHabit = id => {
    const h = habits.find(h => h.id === id);
    if (!h) return;
    update(id, { paused: !h.paused }).catch(() => {});
  };
  const handleCreateHabit = data => {
    add(data)
      .then(() => showToast("Habit created"))
      .catch(() => showToast("Couldn't create habit"));
    setFormModal(null);
  };
  const handleEditHabitSubmit = data => {
    const habitId = formModal.habit.id;
    update(habitId, data)
      .then(() => showToast("Habit updated"))
      .catch(() => showToast("Couldn't update habit"));
    setFormModal(null);
  };
  const filtered = useMemo(() => {
    return habits.filter(h => {
      const matchesCategory = activeCategory === "All" || h.category === activeCategory;
      const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [habits, activeCategory, search]);
  const doneToday = habits.filter(h => h.doneToday).length;
  if (loading) return <Loader label="Loading your habits…" />;
  if (error) return <EmptyState title="Couldn't load habits" description={error} />;
  return <>
      <Hb_HabitsHeader search={search} onSearch={setSearch} onAddHabit={() => setFormModal({ mode: "create" })} total={habits.length} doneToday={doneToday} />
      <Hb_HabitCategories habits={habits} active={activeCategory} onChange={setActiveCategory} />
      <Hb_TodaysHabits habits={filtered} onToggleDone={toggleDone} onDelete={deleteHabit} onEdit={editHabit} onPause={pauseHabit} />
      <Hb_HabitStreaks habits={habits} />
      <Hb_WeeklyHabitTracker habits={habits.slice(0, 6)} />
      <Hb_AiHabitCoach habits={habits} onOptimize={() => {}} onGenerate={() => {}} />
      <Hb_HabitStatistics habits={habits} />
      <Hb_Achievements habits={habits} />
      <Hb_QuickActions onCreate={() => setFormModal({ mode: "create" })} onGenerate={() => {}} onImport={() => {}} onReset={() => {}} onArchive={() => {}} />

      {formModal && <Hb_HabitFormModal mode={formModal.mode} initial={formModal.habit} onClose={() => setFormModal(null)} onSubmit={formModal.mode === "edit" ? handleEditHabitSubmit : handleCreateHabit} />}

      {toast && <div className="fixed bottom-6 right-6 fade-up px-4 py-3 rounded-xl text-[13px] font-medium flex items-center gap-2 z-[110]" style={{
      background: C.glossDark,
      color: C.onInk,
      boxShadow: C.shadowLift
    }}>
          <Check size={14} /> {toast}
        </div>}
    </>;
}

/* ------------------------------------------------------------------ */
/* App shell — identical layout/animations to the Tasks page            */
/* ------------------------------------------------------------------ */

export default HabitsBody;
