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
import { useGoals } from "@/hooks/useGoals";

/* ==================================================================== */
/* Goals                                                                  */
/* ==================================================================== */

/* ------------------------------------------------------------------ */
/* Mock data — shaped like the real Cortex GoalResponse                 */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Local copies of a few cross-section helpers (SearchBar / buttons /   */
/* confirmation modal) that the original single-file app shared         */
/* between pages. Duplicated here so this file has no cross-feature     */
/* imports.                                                              */
/* ------------------------------------------------------------------ */
function Gl_SearchBar({ value, onChange, placeholder = "Search…", className = "" }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg ${className}`}
      style={{ border: `1px solid ${C.border}`, background: C.card, boxShadow: C.shadow }}
    >
      <Search size={15} color={C.faint} strokeWidth={1.75} className="shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-[13.5px] outline-none bg-transparent min-w-0"
        style={{ color: C.text }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="icon-btn w-5 h-5 rounded-full flex items-center justify-center shrink-0"
          style={{ color: C.faint }}
          aria-label="Clear search"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
function Gl_GhostButton({ children, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150"
      style={{ border: `1px solid ${C.divider}`, color: C.text }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}
function Gl_DarkButton({ children, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className="glossy-btn glitter-sm flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-transform duration-150 hover:-translate-y-0.5"
      style={{ background: C.glossDark, color: C.onInk, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}` }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}
function Gl_ConfirmationModal({ modal, onClose, onConfirm }) {
  if (!modal) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(13,13,12,0.5)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-up w-full max-w-[420px] rounded-2xl p-6"
        style={{ background: C.glossCard, border: `1px solid ${C.border}`, boxShadow: C.shadowLift }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: modal.danger ? C.dangerBg : C.cardMuted, border: `1px solid ${modal.danger ? C.danger : C.border}` }}
          >
            <AlertTriangle size={16} color={modal.danger ? C.danger : C.sub} />
          </div>
          <h3 className="text-[16px] font-semibold" style={{ color: C.text }}>
            {modal.title}
          </h3>
        </div>
        <p className="text-[13.5px] leading-relaxed mb-6" style={{ color: C.sub }}>
          {modal.body}
        </p>
        <div className="flex justify-end gap-3">
          <Gl_GhostButton onClick={onClose}>Cancel</Gl_GhostButton>
          <Gl_DarkButton onClick={onConfirm} icon={modal.icon}>
            {modal.confirmLabel}
          </Gl_DarkButton>
        </div>
      </div>
    </div>
  );
}

const Gl_categoryMeta = {
  Career: { icon: Briefcase },
  Health: { icon: Heart },
  Finance: { icon: TrendingUp },
  Learning: { icon: BookOpen },
  Fitness: { icon: Dumbbell },
  Personal: { icon: User },
};

// Goal data now comes from useGoals() (real Cortex GoalResponse API).

/* ------------------------------------------------------------------ */
/* 1. Goals header — title, description, Create Goal                   */
/* ------------------------------------------------------------------ */
function Gl_GoalsHeader({ onCreate }) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-7 fade-up"
      style={{ animationDelay: "20ms" }}
    >
      <div>
        <h1
          className="text-[26px] sm:text-[30px] font-semibold tracking-tight leading-tight"
          style={{ color: C.text }}
        >
          <span className="font-display text-[38px] sm:text-[44px] font-normal align-middle">Goals</span>
        </h1>
        <p className="text-[13.5px] mt-1" style={{ color: C.sub }}>
          Set meaningful goals, track momentum, and see how far you've come.
        </p>
      </div>
      <button
        onClick={onCreate}
        className="glossy-btn glitter-sm flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13.5px] font-medium shrink-0 transition-transform duration-150 hover:-translate-y-0.5"
        style={{
          background: C.glossDark,
          color: C.onInk,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`,
        }}
      >
        <Plus size={15} strokeWidth={2} />
        Create Goal
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Summary statistics                                                */
/* ------------------------------------------------------------------ */
function Gl_SummaryCards({ total, active, completed, overallProgress }) {
  const stats = [
    { label: "Total Goals", value: total, icon: Target },
    { label: "Active Goals", value: active, icon: Circle },
    { label: "Completed Goals", value: completed, icon: CheckCircle2 },
  ];
  return (
    <div className="mb-6 lg:mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5" delay={40 + i * 30}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px]" style={{ color: C.faint }}>
                  {s.label}
                </span>
                <Icon size={14} color={C.sub} strokeWidth={1.75} />
              </div>
              <span className="text-[26px] font-semibold tracking-tight" style={{ color: C.text }}>
                {s.value}
              </span>
            </Card>
          );
        })}
        <Card className="p-5" delay={40 + 3 * 30}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px]" style={{ color: C.faint }}>
              Overall Progress
            </span>
            <TrendingUp size={14} color={C.sub} strokeWidth={1.75} />
          </div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-[26px] font-semibold tracking-tight" style={{ color: C.text }}>
              {overallProgress}
            </span>
            <span className="text-[13px]" style={{ color: C.sub }}>
              %
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.borderSoft }}>
            <div
              className="h-full rounded-full bar-grow glitter-sm"
              style={{ background: C.glossDark, "--w": `${overallProgress}%` }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Status tabs — All / Active / Completed                            */
/* ------------------------------------------------------------------ */
function Gl_StatusTabs({ counts, active, onChange }) {
  const tabs = [
    { key: "All", label: "All" },
    { key: "Active", label: "Active" },
    { key: "Completed", label: "Completed" },
  ];
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 fade-up" style={{ animationDelay: "60ms" }}>
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className="cat-pill flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium shrink-0"
            style={{
              background: isActive ? C.cardMuted : C.card,
              color: C.text,
              border: `1px solid ${isActive ? C.ink : C.border}`,
              boxShadow: C.shadow,
            }}
          >
            {t.label}
            <span
              className="text-[11px] px-1.5 py-0.5 rounded-full"
              style={{ background: isActive ? C.ink : C.borderSoft, color: isActive ? C.onInk : C.faint }}
            >
              {counts[t.key] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Category filter — single-select dropdown                          */
/* ------------------------------------------------------------------ */
function Gl_CategoryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  React.useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  const options = ["All", ...Object.keys(Gl_categoryMeta)];
  const hasSelection = value !== "All";
  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="icon-btn flex items-center gap-2 px-3 py-2 rounded-lg text-[12.5px] font-medium"
        style={{
          border: `1px solid ${hasSelection ? C.ink : C.border}`,
          background: hasSelection ? C.cardMuted : C.card,
          color: C.text,
        }}
      >
        <ListChecks size={13} color={C.sub} strokeWidth={1.75} />
        {value === "All" ? "Category" : value}
        <ChevronDown size={12} color={C.faint} />
      </button>
      {open && (
        <div
          className="panel-drop absolute z-20 mt-2 min-w-[170px] rounded-xl p-1.5"
          style={{ background: C.glossCard, border: `1px solid ${C.border}`, boxShadow: C.shadowLift }}
        >
          {options.map((opt) => {
            const Icon = opt === "All" ? ListChecks : Gl_categoryMeta[opt]?.icon;
            const isSelected = value === opt;
            return (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] text-left"
                style={{ color: isSelected ? C.text : C.sub, fontWeight: isSelected ? 600 : 500 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.cardMuted)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {Icon && <Icon size={13} strokeWidth={1.75} />}
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Filter bar — status tabs + category + search                      */
/* ------------------------------------------------------------------ */
function Gl_FilterBar({
  counts,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  search,
  onSearch,
}) {
  return (
    <div
      className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5 fade-up"
      style={{ animationDelay: "90ms" }}
    >
      <Gl_StatusTabs counts={counts} active={statusFilter} onChange={onStatusChange} />
      <div className="flex items-center gap-2.5 shrink-0">
        <Gl_CategoryDropdown value={categoryFilter} onChange={onCategoryChange} />
        <Gl_SearchBar
          value={search}
          onChange={onSearch}
          placeholder="Search goals by title or description…"
          className="w-full sm:w-[260px]"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Small shared bits — progress bar, status badge, category chip     */
/* ------------------------------------------------------------------ */
function Gl_ProgressBar({ progress, tone = "default" }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 rounded-full overflow-hidden flex-1" style={{ background: C.borderSoft }}>
        <div
          className="h-full rounded-full bar-grow"
          style={{ background: tone === "done" ? C.good : C.glossDark, "--w": `${progress}%` }}
        />
      </div>
      <span className="text-[11.5px] font-medium shrink-0 w-8 text-right" style={{ color: C.faint }}>
        {progress}%
      </span>
    </div>
  );
}

function Gl_StatusBadge({ status }) {
  const done = status === "Completed";
  return (
    <span
      className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0"
      style={{
        background: done ? C.goodBg : C.cardMuted,
        color: done ? C.good : C.text,
        border: `1px solid ${done ? C.good : C.border}`,
      }}
    >
      {done ? <CheckCircle2 size={11} strokeWidth={2} /> : <Circle size={11} strokeWidth={2.5} />}
      {status}
    </span>
  );
}

function Gl_CategoryChip({ category }) {
  const Icon = Gl_categoryMeta[category]?.icon ?? Layers;
  return (
    <span
      className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0"
      style={{ background: C.cardMuted, color: C.sub, border: `1px solid ${C.borderSoft}` }}
    >
      <Icon size={11} strokeWidth={1.75} />
      {category}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Goal card                                                         */
/* ------------------------------------------------------------------ */
function Gl_GoalCard({ goal, delay, onView, onEdit, onUpdateProgress, onArchive, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  React.useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  const isDone = goal.status === "Completed";

  return (
    <Card className="p-5" delay={delay} style={isDone ? { background: C.card, opacity: 0.85 } : {}}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <Gl_CategoryChip category={goal.category} />
          <Gl_StatusBadge status={goal.status} />
        </div>
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="icon-btn w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ color: C.faint }}
            aria-label="Goal actions"
          >
            <MoreHorizontal size={15} />
          </button>
          {menuOpen && (
            <div
              className="panel-drop absolute right-0 z-20 mt-1 min-w-[170px] rounded-xl p-1.5"
              style={{ background: C.glossCard, border: `1px solid ${C.border}`, boxShadow: C.shadowLift }}
            >
              {[
                { label: "View details", icon: Eye, onClick: () => onView(goal) },
                { label: "Edit goal", icon: Pencil, onClick: () => onEdit(goal) },
                { label: "Update progress", icon: TrendingUp, onClick: () => onUpdateProgress(goal) },
                { label: "Archive goal", icon: Archive, onClick: () => onArchive(goal) },
                { label: "Delete goal", icon: Trash2, onClick: () => onDelete(goal), danger: true },
              ].map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.onClick();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] text-left"
                    style={{ color: item.danger ? "#B84545" : C.text }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = C.cardMuted)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <ItemIcon size={13} strokeWidth={1.75} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <h3
        className="text-[15px] font-semibold mb-1.5 leading-snug"
        style={{ color: isDone ? C.faint : C.text, textDecoration: isDone ? "line-through" : "none" }}
      >
        {goal.title}
      </h3>
      <p className="text-[12.5px] leading-relaxed mb-4" style={{ color: C.sub }}>
        {goal.description}
      </p>

      <div className="flex items-center gap-1.5 text-[11.5px] mb-4" style={{ color: C.faint }}>
        <CalendarDays size={12} />
        Target: {goal.targetDate}
      </div>

      <Gl_ProgressBar progress={goal.progress} tone={isDone ? "done" : "default"} />
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Goals list — grid + empty-filtered state                          */
/* ------------------------------------------------------------------ */
function Gl_GoalsList({ goals, onView, onEdit, onUpdateProgress, onArchive, onDelete }) {
  if (goals.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center py-16 rounded-xl fade-up"
        style={{ border: `1px dashed ${C.divider}`, background: C.cardMuted }}
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center mb-3"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
        >
          <Target size={18} color={C.faint} />
        </div>
        <p className="text-[13.5px] font-medium" style={{ color: C.text }}>
          No goals match these filters
        </p>
        <p className="text-[12.5px] mt-1" style={{ color: C.faint }}>
          Try clearing a filter or searching something else.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
      {goals.map((goal, i) => (
        <Gl_GoalCard
          key={goal.id}
          goal={goal}
          delay={140 + i * 30}
          onView={onView}
          onEdit={onEdit}
          onUpdateProgress={onUpdateProgress}
          onArchive={onArchive}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 9. Empty / loading / error states                                    */
/* ------------------------------------------------------------------ */
function Gl_EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 fade-up">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-5 glitter-sm"
        style={{ background: C.glossDark }}
      >
        <Target size={22} color={C.onInk} strokeWidth={1.75} />
      </div>
      <h2 className="text-[22px] font-semibold mb-2" style={{ color: C.text }}>
        <span className="font-display text-[30px] font-normal align-middle">No goals yet</span>
      </h2>
      <p className="text-[13.5px] max-w-sm mb-6" style={{ color: C.sub }}>
        Create your first goal to start tracking progress toward what matters most.
      </p>
      <button
        onClick={onCreate}
        className="glossy-btn glitter-sm flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13.5px] font-medium"
        style={{
          background: C.glossDark,
          color: C.onInk,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), ${C.shadow}`,
        }}
      >
        <Plus size={15} strokeWidth={2} />
        Create Goal
      </button>
    </div>
  );
}

function Gl_LoadingState() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6 fade-up" style={{ color: C.faint }}>
        <RefreshCw size={14} className="animate-spin" />
        <span className="text-[13px] font-medium">Loading your goals…</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="fade-up rounded-2xl p-5"
            style={{ background: C.card, border: `1px solid ${C.border}`, animationDelay: `${i * 40}ms` }}
          >
            <div className="h-4 w-24 rounded-full mb-4" style={{ background: C.cardMuted }} />
            <div className="h-4 w-3/4 rounded-md mb-2" style={{ background: C.cardMuted }} />
            <div className="h-3 w-full rounded-md mb-1.5" style={{ background: C.cardMuted }} />
            <div className="h-3 w-5/6 rounded-md mb-5" style={{ background: C.cardMuted }} />
            <div className="h-1.5 w-full rounded-full" style={{ background: C.cardMuted }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Gl_ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 fade-up">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
        style={{ background: C.dangerBg, border: `1px solid ${C.danger}` }}
      >
        <AlertTriangle size={22} color={C.danger} strokeWidth={1.75} />
      </div>
      <h2 className="text-[16px] font-semibold mb-2" style={{ color: C.text }}>
        Couldn't load your goals
      </h2>
      <p className="text-[13.5px] max-w-sm mb-6" style={{ color: C.sub }}>
        Something went wrong while fetching your goals from Cortex. Check your connection and try again.
      </p>
      <Gl_GhostButton onClick={onRetry} icon={RefreshCw}>
        Retry
      </Gl_GhostButton>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 10. Modals — create/edit, update progress, view details              */
/* ------------------------------------------------------------------ */
function Gl_GoalFormModal({ mode, initial, onClose, onSubmit }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? Object.keys(Gl_categoryMeta)[0]);
  const [targetDate, setTargetDate] = useState(initial?.targetDate ?? "");
  const canSave = title.trim().length > 0 && targetDate.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(13,13,12,0.5)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-up w-full max-w-[480px] rounded-2xl p-6"
        style={{ background: C.glossCard, border: `1px solid ${C.border}`, boxShadow: C.shadowLift }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-semibold" style={{ color: C.text }}>
            {mode === "edit" ? "Edit Goal" : "Create Goal"}
          </h3>
          <button
            onClick={onClose}
            className="icon-btn w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ color: C.faint }}
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="text-[12px] font-medium block mb-1.5" style={{ color: C.sub }}>
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Run a marathon"
              className="w-full px-3 py-2.5 rounded-lg text-[13.5px] outline-none"
              style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
            />
          </div>
          <div>
            <label className="text-[12px] font-medium block mb-1.5" style={{ color: C.sub }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What does success look like?"
              className="w-full px-3 py-2.5 rounded-lg text-[13.5px] outline-none resize-none"
              style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium block mb-1.5" style={{ color: C.sub }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-[13.5px] outline-none"
                style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
              >
                {Object.keys(Gl_categoryMeta).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium block mb-1.5" style={{ color: C.sub }}>
                Target Date
              </label>
              <input
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                placeholder="e.g. Dec 31, 2026"
                className="w-full px-3 py-2.5 rounded-lg text-[13.5px] outline-none"
                style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Gl_GhostButton onClick={onClose}>Cancel</Gl_GhostButton>
          <Gl_DarkButton
            onClick={() =>
              canSave &&
              onSubmit({
                title: title.trim(),
                description: description.trim(),
                category,
                targetDate: targetDate.trim(),
              })
            }
            icon={mode === "edit" ? Save : Plus}
          >
            {mode === "edit" ? "Save Changes" : "Create Goal"}
          </Gl_DarkButton>
        </div>
      </div>
    </div>
  );
}

function Gl_ProgressModal({ goal, onClose, onSave }) {
  const [value, setValue] = useState(goal.progress);
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(13,13,12,0.5)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-up w-full max-w-[420px] rounded-2xl p-6"
        style={{ background: C.glossCard, border: `1px solid ${C.border}`, boxShadow: C.shadowLift }}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[16px] font-semibold" style={{ color: C.text }}>
            Update Progress
          </h3>
          <button
            onClick={onClose}
            className="icon-btn w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ color: C.faint }}
          >
            <X size={15} />
          </button>
        </div>
        <p className="text-[12.5px] mb-5 truncate" style={{ color: C.faint }}>
          {goal.title}
        </p>

        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-[34px] font-semibold tracking-tight" style={{ color: C.text }}>
            {value}
          </span>
          <span className="text-[15px]" style={{ color: C.sub }}>
            %
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full mb-5"
          style={{ accentColor: C.ink }}
        />

        <div className="flex items-center gap-2 mb-6">
          {[0, 25, 50, 75, 100].map((p) => (
            <button
              key={p}
              onClick={() => setValue(p)}
              className="flex-1 py-1.5 rounded-lg text-[11.5px] font-medium"
              style={{
                background: value === p ? C.ink : C.cardMuted,
                color: value === p ? C.onInk : C.sub,
                border: `1px solid ${value === p ? C.ink : C.border}`,
              }}
            >
              {p}%
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Gl_GhostButton onClick={onClose}>Cancel</Gl_GhostButton>
          <Gl_DarkButton onClick={() => onSave(value)} icon={Save}>
            Save Progress
          </Gl_DarkButton>
        </div>
      </div>
    </div>
  );
}

function Gl_DetailsModal({ goal, onClose }) {
  const Icon = Gl_categoryMeta[goal.category]?.icon ?? Layers;
  const isDone = goal.status === "Completed";
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(13,13,12,0.5)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-up w-full max-w-[460px] rounded-2xl p-6"
        style={{ background: C.glossCard, border: `1px solid ${C.border}`, boxShadow: C.shadowLift }}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: C.cardMuted, border: `1px solid ${C.border}` }}
            >
              <Icon size={16} color={C.text} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[16px] font-semibold leading-snug truncate" style={{ color: C.text }}>
                {goal.title}
              </h3>
              <div className="mt-1">
                <Gl_StatusBadge status={goal.status} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="icon-btn w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ color: C.faint }}
          >
            <X size={15} />
          </button>
        </div>

        <p className="text-[13px] leading-relaxed mb-5" style={{ color: C.sub }}>
          {goal.description}
        </p>

        <div className="flex items-center gap-4 flex-wrap mb-5 text-[12px]" style={{ color: C.faint }}>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} /> Target: {goal.targetDate}
          </span>
          <span className="flex items-center gap-1.5">
            <Layers size={13} /> {goal.category}
          </span>
        </div>

        <div>
          <span className="text-[12px] font-medium block mb-1.5" style={{ color: C.sub }}>
            Progress
          </span>
          <Gl_ProgressBar progress={goal.progress} tone={isDone ? "done" : "default"} />
        </div>

        <div className="flex justify-end mt-6">
          <Gl_GhostButton onClick={onClose}>Close</Gl_GhostButton>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 11. Full Goals page composition                                      */
/* ------------------------------------------------------------------ */
export function GoalsBody() {
  const { goals, loading, error, refresh, add: addGoal, update: updateGoal, setProgress, archive: archiveGoal, remove: removeGoal } = useGoals();
  const pageStatus = loading ? "loading" : error ? "error" : "ready";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [formModal, setFormModal] = useState(null); // { mode, goal? }
  const [progressModal, setProgressModal] = useState(null); // goal
  const [detailsModal, setDetailsModal] = useState(null); // goal
  const [confirmModal, setConfirmModal] = useState(null); // { kind, goal }
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  }, []);

  const loadGoals = refresh;

  const visibleGoals = useMemo(() => goals.filter((g) => !g.archived), [goals]);

  const counts = useMemo(
    () => ({
      All: visibleGoals.length,
      Active: visibleGoals.filter((g) => g.status === "Active").length,
      Completed: visibleGoals.filter((g) => g.status === "Completed").length,
    }),
    [visibleGoals]
  );

  const overallProgress = useMemo(() => {
    if (visibleGoals.length === 0) return 0;
    return Math.round(visibleGoals.reduce((sum, g) => sum + g.progress, 0) / visibleGoals.length);
  }, [visibleGoals]);

  const filteredGoals = useMemo(() => {
    return visibleGoals.filter((g) => {
      if (statusFilter !== "All" && g.status !== statusFilter) return false;
      if (categoryFilter !== "All" && g.category !== categoryFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!g.title.toLowerCase().includes(q) && !g.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [visibleGoals, statusFilter, categoryFilter, search]);

  const handleCreate = (data) => {
    addGoal(data)
      .then(() => showToast("Goal created"))
      .catch(() => showToast("Couldn't create goal"));
    setFormModal(null);
  };

  const handleEditSubmit = (data) => {
    const goalId = formModal.goal.id;
    updateGoal(goalId, data)
      .then(() => showToast("Goal updated"))
      .catch(() => showToast("Couldn't update goal"));
    setFormModal(null);
  };

  const handleUpdateProgress = (value) => {
    const goalId = progressModal.id;
    setProgress(goalId, value)
      .then(() => showToast("Progress updated"))
      .catch(() => showToast("Couldn't update progress"));
    setProgressModal(null);
  };

  const handleArchive = (goal) => {
    archiveGoal(goal.id)
      .then(() => showToast("Goal archived"))
      .catch(() => showToast("Couldn't archive goal"));
    setConfirmModal(null);
  };

  const handleDelete = (goal) => {
    removeGoal(goal.id)
      .then(() => showToast("Goal deleted"))
      .catch(() => showToast("Couldn't delete goal"));
    setConfirmModal(null);
  };

  if (pageStatus === "loading") {
    return (
      <>
        <Gl_GoalsHeader onCreate={() => {}} />
        <Gl_LoadingState />
      </>
    );
  }

  if (pageStatus === "error") {
    return (
      <>
        <Gl_GoalsHeader onCreate={() => {}} />
        <Gl_ErrorState onRetry={loadGoals} />
      </>
    );
  }

  return (
    <>
      <Gl_GoalsHeader onCreate={() => setFormModal({ mode: "create" })} />

      <Gl_SummaryCards
        total={visibleGoals.length}
        active={counts.Active}
        completed={counts.Completed}
        overallProgress={overallProgress}
      />

      <Gl_FilterBar
        counts={counts}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        search={search}
        onSearch={setSearch}
      />

      {visibleGoals.length === 0 ? (
        <Gl_EmptyState onCreate={() => setFormModal({ mode: "create" })} />
      ) : (
        <Gl_GoalsList
          goals={filteredGoals}
          onView={setDetailsModal}
          onEdit={(goal) => setFormModal({ mode: "edit", goal })}
          onUpdateProgress={setProgressModal}
          onArchive={(goal) => setConfirmModal({ kind: "archive", goal })}
          onDelete={(goal) => setConfirmModal({ kind: "delete", goal })}
        />
      )}

      {formModal && (
        <Gl_GoalFormModal
          mode={formModal.mode}
          initial={formModal.goal}
          onClose={() => setFormModal(null)}
          onSubmit={formModal.mode === "edit" ? handleEditSubmit : handleCreate}
        />
      )}

      {progressModal && (
        <Gl_ProgressModal goal={progressModal} onClose={() => setProgressModal(null)} onSave={handleUpdateProgress} />
      )}

      {detailsModal && <Gl_DetailsModal goal={detailsModal} onClose={() => setDetailsModal(null)} />}

      {confirmModal && (
        <Gl_ConfirmationModal
          modal={{
            title: confirmModal.kind === "delete" ? "Delete this goal?" : "Archive this goal?",
            body:
              confirmModal.kind === "delete"
                ? `"${confirmModal.goal.title}" will be permanently deleted. This can't be undone.`
                : `"${confirmModal.goal.title}" will be moved out of your active goals list.`,
            danger: confirmModal.kind === "delete",
            confirmLabel: confirmModal.kind === "delete" ? "Delete" : "Archive",
            icon: confirmModal.kind === "delete" ? Trash2 : Archive,
          }}
          onClose={() => setConfirmModal(null)}
          onConfirm={() =>
            confirmModal.kind === "delete" ? handleDelete(confirmModal.goal) : handleArchive(confirmModal.goal)
          }
        />
      )}

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



export default GoalsBody;
