// @ts-nocheck
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard, CheckSquare, Target, StickyNote, Timer, BarChart3,
  Calendar, Music, Settings, LogOut, Search, Bell, Plus, Cloud,
  Sparkles, Flame, Trophy, Activity, Clock, Smile, Quote, Zap,
  TrendingUp, Headphones, ListTodo, Menu, X, Trash2, Edit2, ChevronLeft, ChevronRight, Snowflake, Crown, Sun, Moon, CloudRain, CloudLightning, CloudFog } from "lucide-react";
import { useUser, SignOutButton, UserButton } from "@clerk/clerk-react";
import { useAether } from "@/lib/Store";

const Logo = ({ className = "w-6 h-6", iconClassName = "w-4 h-4" }) => (
  <div className={`${className} rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95`}
    style={{ background: "var(--gradient-primary)" }}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${iconClassName} text-white`}>
      <path d="M12 2L14.5 9H21.5L16 13L18.5 20L12 16L5.5 20L8 13L2.5 9H9.5L12 2Z" fill="currentColor" />
    </svg>
  </div>
);

/* ---------- Tiny atoms ---------- */
const Card = ({ className = "", children }) =>
<div className={`glass-card active:scale-[0.99] group/card overflow-hidden relative ${className}`}>
  <div className="absolute inset-0 shimmer-glass opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none" />
  {children}
</div>;

const Pill = ({ children, className = "" }) =>
<span className={`px-2.5 py-1 rounded-full text-xs font-medium glass ${className}`}>{children}</span>;


/* ---------- Sidebar ---------- */
function Sidebar({ open, onClose }) {
  const { user } = useUser();
  const { activeView, setActiveView, tasks, notes, settings, highestStreak, streak, quickAdd } = useAether();
  
  const items = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: CheckSquare, label: "Tasks" },
  { icon: Target, label: "Goals" },
  { icon: StickyNote, label: "Notes" },
  { icon: Timer, label: "Focus" },
  { icon: Calendar, label: "Calendar" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Trophy, label: "Achievements" },
  { icon: Music, label: "Focus Sounds" },
  { icon: Settings, label: "Settings" }];

  return (
    <>
      {open &&
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden" />

      }
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"} p-4 flex flex-col`}>
        <div className="glass-strong h-full rounded-3xl p-5 flex flex-col shadow-2xl border border-white/20 bg-white/5 dark:bg-black/40">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => {
                setActiveView("Dashboard");
                if (window.innerWidth < 1024) onClose();
              }}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity text-left"
            >
              <Logo className="w-10 h-10" iconClassName="w-6 h-6" />
              <div>
                <h1 className="font-bold text-lg leading-none gradient-text">AetherFlow</h1>
                <p className="text-[11px] text-muted-foreground mt-0.5">Productivity OS</p>
              </div>
            </button>
            <button onClick={onClose} className="lg:hidden p-2 rounded-xl glass hover:bg-white/20 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile */}
          <div className="glass rounded-2xl p-3 mb-5 flex items-center gap-3">
            <img
              src={user?.imageUrl || "https://i.pravatar.cc/80?img=47"}
              alt="profile"
              className="w-11 h-11 rounded-full ring-2 ring-white/70 object-cover" />
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.firstName || "Aria"} {user?.lastName || ""}</p>
              <p className="text-[11px] text-muted-foreground truncate">Productivity Member</p>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgb(74,222,128)]" />
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 mb-2">Workspace</p>
            {items.map((item) => {
              const Icon = item.icon;
              const active = activeView === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveView(item.label);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                      ${active ?
                  "text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)]" :
                  "text-foreground/80 dark:text-white/90 hover:bg-white/40 dark:hover:bg-white/10 hover:text-foreground"}`}
                  style={active ? { background: "var(--gradient-primary)" } : undefined}>
                  
                    <Icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.label === "Tasks" && <Pill className="!py-0.5 !text-[10px]">{tasks.length}</Pill>}
                    {item.label === "Notes" && <Pill className="!py-0.5 !text-[10px]">{notes.length}</Pill>}
                  </button>
              );
            })}

            <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 mt-5 mb-2">Quick Tools</p>
            <button 
              onClick={() => quickAdd("task")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:bg-white/40 transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-500" /> Quick Capture
            </button>
            <button 
              onClick={() => setActiveView("Analytics")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:bg-white/40 transition-colors"
            >
              <Flame className="w-4 h-4 text-orange-500" /> Streaks
            </button>
            <button 
              onClick={() => {
                setActiveView("Dashboard");
                // Scroll to mood section after a small delay to ensure view is switched
                setTimeout(() => {
                  const moodEl = document.getElementById('mood-section');
                  if (moodEl) moodEl.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:bg-white/40 transition-colors"
            >
              <Smile className="w-4 h-4 text-pink-500" /> Mood Journal
            </button>
          </nav>

          <div className="p-1 mt-auto">
            <div className="bg-white/5 dark:bg-white/10 rounded-2xl p-3.5 flex items-center gap-3 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">Best Streak</p>
                <p className="text-sm font-bold text-foreground dark:text-white">{highestStreak} Days</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-white/10">
            <SignOutButton>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-all active:scale-95 group">
                <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
                <span>Logout</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </aside>
    </>);

}

/* ---------- Top bar ---------- */
function TopBar({ onMenu }) {
  const { notifications, setNotifications, isTimerRunning } = useAether();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const [searchQuery, setSearchQuery] = useState("");
  const { tasks, notes, goals, setActiveView, settings, setSettings } = useAether();

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setSettings({ ...settings, theme: isDark ? 'dark' : 'light' });
  };

  const searchResults = searchQuery.trim() === "" ? [] : [
    ...tasks.filter(t => t.t?.toLowerCase().includes(searchQuery.toLowerCase()) || t.tag?.toLowerCase().includes(searchQuery.toLowerCase())).map(t => ({ ...t, text: t.t, type: 'Task', icon: CheckSquare, view: 'Tasks' })),
    ...notes.filter(n => n.t?.toLowerCase().includes(searchQuery.toLowerCase()) || n.c?.toLowerCase().includes(searchQuery.toLowerCase())).map(n => ({ ...n, text: n.t, type: 'Note', icon: StickyNote, view: 'Notes' })),
    ...goals.filter(g => g.t?.toLowerCase().includes(searchQuery.toLowerCase())).map(g => ({ ...g, text: g.t, type: 'Goal', icon: Target, view: 'Goals' }))
  ].slice(0, 5);

  return (
    <div className="glass-strong rounded-2xl p-3 flex items-center gap-3 relative z-50 bg-white/5 dark:bg-black/40 border border-white/10 text-foreground dark:text-foreground">
      <button onClick={onMenu} className="lg:hidden p-2 rounded-xl glass hover:bg-white/20">
        <Menu className="w-4 h-4" />
      </button>
      <div className="flex-1 flex items-center gap-2 glass rounded-xl px-4 py-2.5 transition-all focus-within:ring-2 ring-primary/20 bg-white/5 dark:bg-black/40 relative max-w-md">
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <input
          placeholder="Search…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground text-foreground dark:text-white min-w-0" />
        <Pill className="hidden md:inline bg-black/5 dark:bg-white/10 flex-shrink-0">⌘K</Pill>

        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl shadow-2xl overflow-hidden border border-white/20 animate-in fade-in slide-in-from-top-2 duration-200">
            {searchResults.map((res, i) => {
              const Icon = res.icon;
              return (
                <button 
                  key={i}
                  onClick={() => {
                    setActiveView(res.view);
                    setSearchQuery("");
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/10 text-left border-b border-white/5 last:border-none transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate text-foreground dark:text-white">{res.text}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{res.type}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
        {isTimerRunning && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Focusing...</span>
          </div>
        )}
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl glass transition-all active:scale-95 hover:bg-white/20"
          title="Toggle Theme"
        >
          {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl glass relative transition-all active:scale-95 hover:bg-white/20 ${showNotifications ? "bg-white/40 ring-2 ring-primary/20" : ""}`}
          >
            <Bell className="w-4 h-4 text-foreground dark:text-white" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgb(236,72,153)] animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-3 w-80 glass-strong rounded-2xl shadow-2xl overflow-hidden border border-white/40 animate-in fade-in zoom-in-95 origin-top-right">
              <div className="p-4 border-b border-white/20 flex items-center justify-between bg-white/10">
                <h3 className="font-bold text-sm">Notifications</h3>
                <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{unreadCount} New</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    onClick={() => markAsRead(n.id)}
                    className={`p-4 border-b border-white/10 cursor-pointer transition-colors hover:bg-white/20 ${!n.read ? "bg-primary/5" : "opacity-60"}`}
                  >
                    <p className="text-xs font-medium text-foreground dark:text-white">{n.text}</p>
                    <p className="text-[10px] text-muted-foreground dark:text-white/60 mt-1">{n.time}</p>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="p-10 text-center text-xs text-muted-foreground">No notifications yet</div>
                )}
              </div>
              <div className="flex border-t border-white/10 bg-white/5">
                <button 
                  onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                  className="flex-1 p-3 text-[10px] uppercase tracking-widest font-bold text-primary hover:bg-white/20 transition-colors border-r border-white/10"
                >
                  Mark all as read
                </button>
                <button 
                  onClick={() => setNotifications([])}
                  className="flex-1 p-3 text-[10px] uppercase tracking-widest font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-2xl overflow-hidden border border-white/20">
        {/* Safe User Button wrapper */}
        <div className="scale-110">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>);
}

/* ---------- Greeting / Hero ---------- */
function Greeting() {
  const { user } = useUser();
  const { setActiveView, setIsTimerRunning, tasks, focusGoal, timerDuration } = useAether();

  const startFocus = () => {
    setActiveView("Focus");
    setIsTimerRunning(true);
  };

  const doneCount = tasks.filter(t => t.done).length;
  const remainingCount = tasks.length - doneCount;
  const sessionsNeeded = Math.ceil(focusGoal / timerDuration);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning ✨";
    if (hour < 18) return "Good afternoon ☀️";
    return "Good evening 🌙";
  };

  return (
    <Card className="!p-6 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-60"
      style={{ background: "var(--gradient-aurora)", filter: "blur(60px)" }} />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{getGreeting()}</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-1">
            Hello, <span className="gradient-text">{user?.firstName || "Aria"}</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            You have <b className="text-foreground">{remainingCount} tasks</b> and <b className="text-foreground">{sessionsNeeded} focus sessions</b> planned to reach your daily goal. Let's flow.
          </p>
          
          <div className="mt-4 w-full max-w-xs">
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-1 opacity-70">
              <span>Today's Progress</span>
              <span>{Math.round((doneCount / (tasks.length || 1)) * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
               <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(doneCount / (tasks.length || 1)) * 100}%`, background: "var(--gradient-primary)" }} />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button 
              onClick={startFocus}
              className="px-4 py-2 rounded-xl text-white text-sm font-medium glow-ring active:scale-95 transition-transform"
              style={{ background: "var(--gradient-primary)" }}>
              Start Focus
            </button>
            <button onClick={() => setActiveView("Analytics")} className="px-4 py-2 rounded-xl text-sm font-medium glass hover:bg-white/10 transition-colors">View Plan</button>
          </div>
        </div>
        <Clock3 />
      </div>
    </Card>);

}

function Clock3() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  
  return (
    <div className="glass rounded-2xl px-5 py-4 text-right float border border-white/10 shadow-xl">
      <p className="text-4xl font-bold tabular-nums tracking-tighter gradient-text">{time}</p>
      <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-bold">{date}</p>
    </div>);
}

/* ---------- Score Cards ---------- */
function ScoreCard({ icon: Icon, label, value, sub, gradient, ringColor, onEdit }) {
  return (
    <Card className={onEdit ? "cursor-pointer hover:bg-white/10 transition-colors" : ""} onClick={onEdit}>
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
        style={{ background: gradient }}>
          <Icon className="w-5 h-5" />
        </div>
        <Pill>{sub}</Pill>
      </div>
      <p className="text-sm text-muted-foreground mt-4">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <p className="text-3xl font-bold">{Math.round(value)}<span className="text-base text-muted-foreground">/100</span></p>
        {onEdit && <Edit2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100" />}
      </div>
      <div className="h-1.5 mt-3 rounded-full bg-white/40 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: ringColor }} />
      </div>
    </Card>);
}

/* ---------- Tasks ---------- */
function Tasks() {
  const { tasks, setTasks, streak, setStreak, weeklyAnalytics, setWeeklyAnalytics, lastStreakUpdate, setLastStreakUpdate } = useAether();
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);

  const toggleTask = (id) => {
    const today = new Date().toLocaleDateString();
    const updatedTasks = tasks.map(t => {
      if (t.id === id) {
        const isNowDone = !t.done;
        // Logic: Completion increases streak ONLY ONCE PER DAY
        if (isNowDone) {
          if (lastStreakUpdate !== today) {
            setStreak(s => s + 1);
            setLastStreakUpdate(today);
          }
          const newAnalytics = [...weeklyAnalytics];
          const todayIndex = (new Date().getDay() + 6) % 7;
          newAnalytics[todayIndex] = Math.min(100, newAnalytics[todayIndex] + 10);
          setWeeklyAnalytics(newAnalytics);
        }
        return { ...t, done: isNowDone };
      }
      return t;
    });
    setTasks(updatedTasks);
  };

  const addTask = (e) => {
    if (e) e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([{ id: Date.now(), t: newTask, done: false, tag: "Inbox", p: "low" }, ...tasks]);
    setNewTask("");
  };

  const updateTaskPriority = (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const next = t.p === "high" ? "low" : (t.p === "med" ? "high" : "med");
        return { ...t, p: next };
      }
      return t;
    }));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTaskText = (id, newText) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, t: newText } : t));
    setEditingId(null);
  };

  const doneCount = tasks.filter(t => t.done).length;

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <ListTodo className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-bold text-lg">Daily Checklist</h3>
        </div>
        <div className="flex items-center gap-2">
           <Pill className="bg-primary/10 text-primary border-primary/20">{doneCount} / {tasks.length}</Pill>
        </div>
      </div>
      
      <form onSubmit={addTask} className="mb-5 relative group">
        <input 
          type="text" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What needs to be done?" 
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:bg-white/10 transition-all shadow-inner"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary text-white opacity-0 group-focus-within:opacity-100 transition-all">
          <Plus className="w-4 h-4" />
        </button>
      </form>

      <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {tasks.map((x) => (
          <li key={x.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group animate-in fade-in slide-in-from-left-2">
            <button 
              onClick={() => toggleTask(x.id)} 
              className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all duration-300 transform active:scale-90 ${
                x.done 
                ? "bg-gradient-to-br from-green-400 to-emerald-600 border-transparent shadow-[0_0_15px_rgba(52,211,153,0.4)]" 
                : "border-white/30 hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              {x.done && <CheckSquare className="w-4 h-4 text-white" />}
            </button>
            
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <button 
                onClick={() => updateTaskPriority(x.id)}
                className={`w-3.5 h-3.5 rounded-full flex-shrink-0 transition-all transform hover:scale-150 active:scale-90 shadow-lg ${
                  x.p === "high" ? "bg-gradient-to-br from-red-400 to-rose-600 shadow-red-500/40" :
                  x.p === "med" ? "bg-gradient-to-br from-amber-300 to-orange-500 shadow-orange-500/40" :
                  "bg-gradient-to-br from-blue-400 to-indigo-600 shadow-indigo-500/40"
                }`}
                title={`Priority: ${x.p || 'low'} (Click to change)`}
              />
              {editingId === x.id ? (
                <input 
                  autoFocus
                  onBlur={(e) => updateTaskText(x.id, e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && updateTaskText(x.id, e.target.value)}
                  defaultValue={x.t}
                  className="bg-white/10 border border-primary/30 rounded px-1 outline-none w-full text-sm"
                />
              ) : (
                <p 
                  onClick={() => setEditingId(x.id)}
                  className={`text-sm truncate transition-opacity cursor-pointer ${x.done ? "opacity-40 line-through" : "text-foreground dark:text-white"}`}
                >
                  {x.t}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
               <button onClick={() => setEditingId(x.id)} className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-primary transition-colors">
                 <Edit2 className="w-4 h-4" />
               </button>
               <button onClick={() => deleteTask(x.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors">
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>
          </li>
        ))}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground opacity-50">
            <CheckSquare className="w-10 h-10 mb-2" />
            <p className="text-sm font-medium">No tasks for today</p>
          </div>
        )}
      </ul>
    </Card>);
}


/* ---------- Pomodoro ---------- */
function Pomodoro() {
  const { setFocusMinutes, lastStreakUpdate, setStreak, setLastStreakUpdate, isTimerRunning, setIsTimerRunning, timerDuration, setTimerDuration } = useAether();
  const [timeLeft, setTimeLeft] = useState(timerDuration * 60);
  const [mode, setMode] = useState("Focus"); // Focus or Break

  // Update timeLeft when timerDuration changes if not running
  useEffect(() => {
    if (!isTimerRunning) {
      setTimeLeft(timerDuration * 60);
    }
  }, [timerDuration]);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        // Track focus time globally if in Focus mode
        if (mode === "Focus") {
           // Better precision: add 1/60th of a minute every second
           setFocusMinutes(m => parseFloat((m + (1/60)).toFixed(4)));
        }
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      setIsTimerRunning(false);
      // Award streak if not already awarded today
      const today = new Date().toLocaleDateString();
      if (mode === "Focus" && lastStreakUpdate !== today) {
        setStreak(s => (s || 0) + 1);
        setLastStreakUpdate(today);
      }
      
      // Feedback
      toast.success(mode === "Focus" ? "Session Complete! 🎯" : "Break Over! ☕", {
        description: mode === "Focus" ? "Great job focusing. Time for a short break!" : "Hope you're refreshed. Ready to focus?",
        duration: 10000
      });
      
      // Browser notification sound
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
        osc.start();
        osc.stop(ctx.currentTime + 1);
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, mode, lastStreakUpdate]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(mode === "Focus" ? timerDuration * 60 : 5 * 60);
  };
  const skipTimer = () => {
    const newMode = mode === "Focus" ? "Break" : "Focus";
    setMode(newMode);
    setIsTimerRunning(false);
    setTimeLeft(newMode === "Focus" ? timerDuration * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = mode === "Focus" ? ((timerDuration * 60 - timeLeft) / (timerDuration * 60)) * 100 : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <Card className="text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-aurora)", filter: "blur(40px)" }} />
      <div className="relative">
        <div className="flex items-center justify-center gap-4 text-sm text-foreground dark:text-white/90">
          <button 
            disabled={isTimerRunning}
            onClick={() => setTimerDuration(Math.max(1, timerDuration - 5))}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
          >-</button>
          <div 
            className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors"
            onClick={() => {
              const val = prompt("Set custom focus duration (minutes):", timerDuration);
              if (val && !isNaN(val)) setTimerDuration(parseInt(val));
            }}
          >
            <Timer className="w-4 h-4" /> {mode} ({timerDuration}m)
          </div>
          <button 
            disabled={isTimerRunning}
            onClick={() => setTimerDuration(timerDuration + 5)}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
            title="+5 mins"
          >+</button>
          <button 
            onClick={() => {
              const newTime = Math.max(0, timeLeft + 60);
              setTimeLeft(newTime);
            }}
            className="p-1 px-2 rounded glass text-[9px] font-bold hover:bg-white/20 active:scale-95 transition-all"
            title="+1 min"
          >+1m</button>
        </div>
        <div className="my-4 mx-auto w-40 h-40 rounded-full flex items-center justify-center relative transition-all duration-1000"
        style={{ background: `conic-gradient(var(--primary) ${progress}%, rgba(255,255,255,0.2) 0)` }}>
          <div className="w-32 h-32 rounded-full glass-strong flex flex-col items-center justify-center">
            <p className="text-3xl font-bold tabular-nums text-foreground dark:text-white">{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground dark:text-white/90">{mode === "Focus" ? "Deep Work" : "Rest"}</p>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <button onClick={toggleTimer} className="px-4 py-1.5 rounded-lg text-white text-xs transition-transform active:scale-95" style={{ background: "var(--gradient-primary)" }}>
            {isTimerRunning ? "Pause" : "Start"}
          </button>
          <button onClick={resetTimer} className="px-4 py-1.5 rounded-lg text-xs glass transition-transform active:scale-95">Reset</button>
          <button onClick={skipTimer} className="px-4 py-1.5 rounded-lg text-xs glass transition-transform active:scale-95">Skip</button>
        </div>
      </div>
    </Card>);
}

/* ---------- Notes ---------- */
function Notes() {
  const { notes, setNotes } = useAether();

  const addNote = () => {
    const colors = ["var(--gradient-cyan)", "var(--gradient-pink)", "var(--gradient-primary)", "var(--gradient-aurora)"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setNotes([{ id: Date.now(), t: "New Note", c: "Click to edit...", color: randomColor }, ...notes]);
  };

  const updateNote = (id, field, value) => {
    setNotes(notes.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const deleteNote = (e, id) => {
    e.stopPropagation();
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">Quick Notes</h3>
        </div>
        <button 
          onClick={addNote} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> New Note
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((n) =>
          <div key={n.id} className="group rounded-2xl p-4 text-white relative overflow-hidden h-40 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ background: n.color }}>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => deleteNote(e, n.id)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <input 
              className="font-bold text-sm bg-transparent outline-none w-full placeholder:text-white/60 mb-2 border-b border-white/20 focus:border-white/50 transition-colors" 
              value={n.t} 
              onChange={(e) => updateNote(n.id, "t", e.target.value)}
              placeholder="Title" 
            />
            <textarea 
              className="text-xs font-medium opacity-90 w-full h-24 bg-transparent outline-none resize-none placeholder:text-white/60 custom-scrollbar-white" 
              value={n.c} 
              onChange={(e) => updateNote(n.id, "c", e.target.value)}
              placeholder="Write something amazing..." 
            />
          </div>
        )}
        {notes.length === 0 && (
          <div className="col-span-full py-10 flex flex-col items-center justify-center text-muted-foreground opacity-40">
            <StickyNote className="w-12 h-12 mb-2" />
            <p className="text-sm">No notes yet</p>
          </div>
        )}
      </div>
    </Card>);
}

/* ---------- Goals ---------- */
function Goals() {
  const { goals, setGoals } = useAether();
  const [newGoal, setNewGoal] = useState("");

  const addGoal = (e) => {
    if (e) e.preventDefault();
    if (!newGoal.trim()) return;
    const colors = ["var(--gradient-primary)", "var(--gradient-cyan)", "var(--gradient-pink)"];
    const color = colors[goals.length % colors.length];
    setGoals([...goals, { t: newGoal, p: 0, color }]);
    setNewGoal("");
  };

  const deleteGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const updateGoal = (index, delta) => {
    const newGoals = [...goals];
    newGoals[index].p = Math.min(100, Math.max(0, newGoals[index].p + delta));
    setGoals(newGoals);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><Target className="w-4 h-4" /><h3 className="font-semibold">Daily Goals</h3></div>
        <Pill>{goals.length} active</Pill>
      </div>

      <form onSubmit={addGoal} className="mb-4">
        <input 
          type="text" 
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Add a new goal..." 
          className="w-full bg-black/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus:border-white/40 transition-colors"
        />
      </form>

      <div className="space-y-4 max-h-[160px] overflow-y-auto pr-1">
        {goals.map((g, i) =>
        <div key={i} className="group">
            <div className="flex justify-between text-xs mb-1.5 items-center">
              <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
                <button 
                  onClick={() => updateGoal(i, g.p === 100 ? -100 : 100)}
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${g.p === 100 ? "bg-primary border-primary text-white" : "border-white/40"}`}
                >
                  {g.p === 100 && "✓"}
                </button>
                <span className={`truncate ${g.p === 100 ? "line-through opacity-50" : ""}`}>{g.t}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateGoal(i, -5)} className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary">-</button>
                <span className="text-muted-foreground min-w-[30px] text-right">{g.p}%</span>
                <button onClick={() => updateGoal(i, 5)} className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary">+</button>
                <button onClick={() => deleteGoal(i)} className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 ml-1">
                   <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="h-2 rounded-full bg-white/40 overflow-hidden cursor-pointer" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const p = Math.round(((e.clientX - rect.left) / rect.width) * 100);
              const delta = p - g.p;
              updateGoal(i, delta);
            }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${g.p}%`, background: g.color }} />
            </div>
          </div>
        )}
        {goals.length === 0 && <p className="text-center text-xs text-muted-foreground py-2">No goals set yet.</p>}
      </div>
    </Card>);
}

/* ---------- Streak ---------- */
function Streak() {
  const { streak, streakFreeze } = useAether();
  return (
    <Card className="text-center group relative overflow-hidden">
      <div className="absolute top-2 right-2">
        {streakFreeze > 0 && (
          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center ring-1 ring-blue-500/30" title="Streak Freeze Available">
            <Snowflake className="w-3.5 h-3.5 text-blue-400" />
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors pointer-events-none" />
      <Flame className="w-8 h-8 mx-auto text-orange-500 drop-shadow-[0_0_12px_rgba(251,146,60,0.7)] group-hover:scale-110 transition-transform" />
      <p className="text-3xl font-bold mt-2 text-foreground dark:text-white">{streak}</p>
      <p className="text-xs text-muted-foreground">Day Streak 🔥</p>
      
      <div className="flex justify-center gap-1 mt-4">
        {[...Array(7)].map((_, i) => (
          <span key={i} className={`w-3 h-3 rounded-full ${i < (streak % 7) || (streak > 0 && (streak % 7) === 0) ? "" : "bg-white/20"}`}
          style={i < (streak % 7) || (streak > 0 && (streak % 7) === 0) ? { background: "var(--gradient-pink)" } : undefined} />
        ))}
      </div>
    </Card>);
}

/* ---------- Mood ---------- */
function Mood() {
  const { moods, setMoods } = useAether();
  const today = new Date().toLocaleDateString();
  const currentMood = moods.find(m => m.date === today)?.mood;

  const moodOptions = [
    { emoji: "😌", label: "Calm" },
    { emoji: "😊", label: "Happy" },
    { emoji: "🤩", label: "Energetic" },
    { emoji: "🧘", label: "Focused" },
    { emoji: "🚀", label: "Productive" }
  ];

  const selectMood = (emoji) => {
    const existing = moods.findIndex(m => m.date === today);
    if (existing !== -1) {
      const newMoods = [...moods];
      newMoods[existing].mood = emoji;
      setMoods(newMoods);
    } else {
      setMoods([...moods, { date: today, mood: emoji }]);
    }
  };

  const currentLabel = moodOptions.find(o => o.emoji === currentMood)?.label || "Neutral";

  return (
    <Card id="mood-section" className="relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center gap-2 mb-4">
        <Smile className="w-5 h-5 text-amber-500" />
        <h3 className="font-bold text-lg">How are you?</h3>
      </div>
      <div className="flex justify-between gap-2">
        {moodOptions.map((o, i) => (
          <button 
            key={i} 
            onClick={() => selectMood(o.emoji)}
            className={`w-11 h-11 rounded-2xl text-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 ${
              currentMood === o.emoji 
              ? "bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)] border-2 border-primary/20 scale-110" 
              : "glass hover:bg-white/40"
            }`}
          >
            {o.emoji}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground mt-4 text-center font-bold uppercase tracking-wider">
        Current State: <span className="text-foreground">{currentLabel}</span>
      </p>
    </Card>);
}

/* ---------- Weekly Analytics chart ---------- */
function Analytics() {
  const { dailyHistory, tasks } = useAether();
  const [viewMode, setViewMode] = useState("Week");
  const [offset, setOffset] = useState(0);

  const getDaysForWeek = (weekOffset) => {
    const days = [];
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7; // Mon=0, Sun=6
    
    // Start of the week (Monday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + (weekOffset * 7));
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const getDaysForMonth = (monthOffset) => {
    const days = [];
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + monthOffset + 1, 0).getDate();
    
    for (let i = 1; i <= lastDay; i++) {
      days.push(new Date(today.getFullYear(), today.getMonth() + monthOffset, i));
    }
    return days;
  };

  const activeDays = viewMode === "Week" ? getDaysForWeek(offset) : getDaysForMonth(offset);
  const todayStr = new Date().toLocaleDateString();
  
  // Real-time today calculation
  const completed = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const todayRate = total > 0 ? (completed / total) * 100 : 0;

  const data = activeDays.map(d => {
    const dStr = d.toLocaleDateString();
    if (dStr === todayStr) return todayRate;
    return dailyHistory[dStr] || 0;
  });

  const labels = viewMode === "Week" 
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : activeDays.map(d => d.getDate());

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50" />
      <div className="flex flex-wrap items-center justify-between mb-8 relative gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Productivity Flow</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Historical Performance</p>
          </div>
        </div>

        <div className="flex items-center gap-2 glass p-1 rounded-xl">
           <button 
             onClick={() => { setViewMode("Week"); setOffset(0); }}
             className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${viewMode === "Week" ? "bg-primary text-white" : "hover:bg-white/10"}`}
           >WEEK</button>
           <button 
             onClick={() => { setViewMode("Month"); setOffset(0); }}
             className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${viewMode === "Month" ? "bg-primary text-white" : "hover:bg-white/10"}`}
           >MONTH</button>
        </div>

        <div className="flex items-center gap-4">
           <button onClick={() => setOffset(offset - 1)} className="p-2 rounded-lg glass hover:bg-primary/20 transition-all">
             <ChevronLeft className="w-4 h-4" />
           </button>
           <span className="text-xs font-bold w-24 text-center">
             {offset === 0 ? `This ${viewMode}` : `${Math.abs(offset)} ${viewMode}${Math.abs(offset) > 1 ? "s" : ""} ago`}
           </span>
           <button 
             onClick={() => setOffset(offset + 1)} 
             disabled={offset >= 0}
             className={`p-2 rounded-lg glass transition-all ${offset >= 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-primary/20"}`}
           >
             <ChevronRight className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar -mx-2 px-2">
        <div className={`flex items-end justify-between pt-10 pb-2 relative group min-w-[500px] md:min-w-0 ${viewMode === "Week" ? "h-64" : "h-48"}`}>
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
          {data.map((v, i) => {
            const isToday = activeDays[i].toLocaleDateString() === todayStr;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar relative h-full justify-end">
                <div className="w-full max-w-[40px] bg-white/5 rounded-t-lg relative overflow-hidden h-full flex flex-col justify-end">
                  <div 
                    className="w-full rounded-t-lg transition-all duration-1000 ease-out relative border-t border-white/20"
                    style={{ 
                      height: `${Math.max(v > 0 ? 12 : 5, v)}%`, 
                      background: isToday ? "var(--gradient-primary)" : "var(--gradient-cyan)",
                      boxShadow: isToday && v > 0 ? "0 0 15px var(--primary)" : "none",
                      opacity: v === 0 ? 0.2 : 1
                    }}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                    {v > 0 && (
                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary dark:text-white drop-shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity">
                         {Math.round(v)}%
                       </div>
                    )}
                  </div>
                </div>
                <span className={`text-[10px] font-bold tracking-tighter ${isToday ? "text-primary scale-110" : "text-muted-foreground"}`}>
                  {labels[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>);
}

/* ---------- Quote ---------- */
function QuoteCard() {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-60" style={{ background: "var(--gradient-pink)", filter: "blur(50px)" }} />
      <div className="relative">
        <Quote className="w-6 h-6 text-primary" />
        <p className="text-sm font-medium mt-2 leading-relaxed">
          "The secret of getting ahead is getting started. Small consistent steps create extraordinary outcomes."
        </p>
        <p className="text-xs text-muted-foreground mt-3">— Mark Twain</p>
      </div>
    </Card>);

}

/* ---------- Calendar ---------- */
function MiniCalendar() {
  const today = new Date().getDate();
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4" /> November</h3>
        <Pill>2025</Pill>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] text-muted-foreground mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) =>
        <div key={d}
        className={`aspect-square flex items-center justify-center rounded-lg text-xs
                 ${d === today ? "text-white font-bold" : "glass hover:bg-white/60"}`}
        style={d === today ? { background: "var(--gradient-primary)" } : undefined}>
            {d}
          </div>
        )}
      </div>
    </Card>);

}

/* ---------- Weather ---------- */
function Weather() {
  const [weather, setWeather] = useState({ temp: "--", condition: "Detecting...", city: "Location" });
  const [loading, setLoading] = useState(true);

  const getWeatherCondition = (code) => {
    if (code === 0) return "Clear Sky";
    if (code <= 3) return "Partly Cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 55) return "Drizzle";
    if (code <= 65) return "Rainy";
    if (code <= 75) return "Snowy";
    if (code <= 82) return "Showers";
    if (code <= 99) return "Thunderstorm";
    return "Clear Sky";
  };

  useEffect(() => {
    const fetchWeather = async (lat, lon, cityName = "Your Location") => {
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();
        
        if (data && data.current_weather) {
          setWeather({
            temp: Math.round(data.current_weather.temperature),
            condition: getWeatherCondition(data.current_weather.weathercode),
            city: cityName
          });
        }
      } catch (error) {
        console.error("Weather fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    const getCityName = async (lat, lon) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();
        return data.address.city || data.address.town || data.address.village || data.address.suburb || "Hyderabad";
      } catch {
        return "Hyderabad";
      }
    };

    const initWeather = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const cityName = await getCityName(latitude, longitude);
          fetchWeather(latitude, longitude, cityName);
        }, () => {
          // Fallback to Hyderabad if blocked
          fetchWeather(17.3850, 78.4867, "Hyderabad");
        }, { timeout: 10000 });
      } else {
        fetchWeather(17.3850, 78.4867, "Hyderabad");
      }
    };

    initWeather();
    const interval = setInterval(initWeather, 600000); 
    return () => clearInterval(interval);
  }, []);

  const cond = weather.condition.toLowerCase();
  let Icon = Cloud;
  let iconColor = "text-white";

  if (cond.includes("clear") || cond.includes("sun")) {
    Icon = Sun;
    iconColor = "text-amber-300";
  } else if (cond.includes("rain") || cond.includes("showers") || cond.includes("drizzle")) {
    Icon = CloudRain;
    iconColor = "text-blue-300";
  } else if (cond.includes("thunder")) {
    Icon = CloudLightning;
    iconColor = "text-yellow-400";
  } else if (cond.includes("snow")) {
    Icon = Snowflake;
    iconColor = "text-white";
  } else if (cond.includes("fog")) {
    Icon = CloudFog;
    iconColor = "text-slate-300";
  }

  return (
    <Card className="relative overflow-hidden group">
      <div className="absolute inset-0 opacity-80 transition-opacity group-hover:opacity-100" style={{ background: "var(--gradient-cyan)" }} />
      <div className={`relative flex items-center justify-between text-white transition-all duration-500 ${loading ? "opacity-40 blur-sm" : "opacity-100 blur-0"}`}>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-80">{weather.city}</p>
          <p className="text-4xl font-black tracking-tighter">{weather.temp}°</p>
          <p className="text-[10px] font-bold mt-1 uppercase tracking-wider">{weather.condition}</p>
        </div>
        <div className="relative">
           <Icon className={`w-14 h-14 drop-shadow-2xl ${iconColor} transition-transform ${loading ? "scale-75 opacity-50" : "scale-100 opacity-100"}`} />
        </div>
      </div>
    </Card>);
}

/* ---------- Music ---------- */
function MusicWidget() {
  const { musicState, setMusicState } = useAether();
  
  const tracks = [
    { title: "Lofi Deep Focus", artist: "AetherFlow", duration: "45:00" },
    { title: "Rainy Night Study", artist: "Chill Hop", duration: "32:00" },
    { title: "Zen Garden Ambient", artist: "Focus Lab", duration: "60:00" }
  ];

  const current = tracks[musicState.currentTrack];

  const togglePlay = () => setMusicState({ ...musicState, playing: !musicState.playing });
  const nextTrack = () => setMusicState({ ...musicState, currentTrack: (musicState.currentTrack + 1) % tracks.length });

  return (
    <Card className="overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform ${musicState.playing ? "animate-pulse scale-105" : ""}`}
        style={{ background: "var(--gradient-pink)" }}>
          <Headphones className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold truncate text-foreground">{current.title}</p>
            {musicState.playing && (
              <span className="flex gap-0.5 items-end h-2 mb-0.5">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-0.5 bg-primary rounded-full animate-music-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{current.artist}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={nextTrack} className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground transition-colors">
            <Zap className="w-4 h-4 fill-current" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-10 h-10 rounded-full text-white flex items-center justify-center shadow-lg active:scale-90 transition-all hover:brightness-110"
            style={{ background: "var(--gradient-primary)" }}
          >
            {musicState.playing ? "⏸" : "▶"}
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1 font-bold">
            <span>2:14</span>
            <span>{current.duration}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/20 overflow-hidden cursor-pointer group/progress">
            <div className="h-full w-[15%] rounded-full relative group-hover/progress:brightness-110 transition-all" style={{ background: "var(--gradient-primary)" }}>
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 group/vol">
           <BarChart3 className="w-3 h-3 text-muted-foreground" />
           <input 
             type="range" 
             className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-primary" 
             min="0" max="100" 
             value={musicState.volume}
             onChange={(e) => setMusicState({ ...musicState, volume: parseInt(e.target.value) })}
           />
        </div>
      </div>
    </Card>);
}

/* ---------- Achievements ---------- */
function Achievements() {
  const { highestStreak, tasks, focusMinutes } = useAether();
  const badges = [
    { id: 1, title: "Day One", desc: "First streak started", icon: Zap, unlocked: highestStreak >= 1, color: "text-amber-500" },
    { id: 2, title: "Consistency", desc: "3-day streak", icon: Sparkles, unlocked: highestStreak >= 3, color: "text-blue-500" },
    { id: 3, title: "Unstoppable", desc: "7-day streak", icon: Trophy, unlocked: highestStreak >= 7, color: "text-pink-500" },
    { id: 4, title: "Grand Master", desc: "30-day streak", icon: Crown, unlocked: highestStreak >= 30, color: "text-primary" },
    { id: 5, title: "Ninja", desc: "10+ tasks done", icon: CheckSquare, unlocked: tasks.filter(t => t.done).length >= 10, color: "text-emerald-500" },
    { id: 6, title: "Master", desc: "5+ hours focused", icon: Timer, unlocked: focusMinutes >= 300, color: "text-violet-500" },
    { id: 7, title: "Deep Diver", desc: "2h single session", icon: Activity, unlocked: focusMinutes >= 120, color: "text-cyan-500" },
    { id: 8, title: "Early Bird", desc: "Started before 8am", icon: Cloud, unlocked: true, color: "text-sky-400" },
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" /> Achievements
        </h3>
        <Pill>{unlockedCount}/{badges.length}</Pill>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.id} className={`glass-strong rounded-xl p-3 text-center transition-all border border-white/10 ${b.unlocked ? "opacity-100 scale-100 shadow-lg" : "opacity-30 grayscale scale-95"}`}>
              <div className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2 ${b.unlocked ? b.color : "text-muted-foreground"}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-bold text-foreground dark:text-white leading-tight">{b.title}</p>
              <p className="text-[9px] text-muted-foreground mt-1 leading-none">{b.desc}</p>
            </div>
          );
        })}
      </div>
    </Card>);
}

/* ---------- Heatmap ---------- */
function Heatmap() {
  const { heatmapHistory, tasks } = useAether();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [pageOffset, setPageOffset] = useState(0); // 0 = current 12 weeks, -1 = previous 12 weeks

  // Calculate today's rate
  const completed = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const todayRate = total > 0 ? completed / total : 0;
  const todayStr = new Date().toLocaleDateString();

  // Generate 12 weeks of data (84 days) for the current page
  const totalDays = 12 * 7;
  
  const getPageData = () => {
    const days = [];
    const today = new Date();
    
    // In this view, index 0 is always Today - (pageOffset * 84 days)
    // Wait, if Today is Top-Left, then pageOffset = 0 means startOfView = Today
    // pageOffset = -1 means startOfView = Today - 84 days
    const startOfView = new Date(today);
    startOfView.setDate(today.getDate() + (pageOffset * totalDays));

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startOfView);
      d.setDate(startOfView.getDate() + i);
      const dStr = d.toLocaleDateString();
      
      let val = 0;
      if (dStr === todayStr) {
        val = todayRate;
      } else {
        const entry = heatmapHistory.find(h => h.date === dStr);
        val = entry ? entry.value : 0;
      }
      // In this mode, everything after index 0 (if offset 0) is "future" or "next"
      days.push({ date: d, value: val, isToday: dStr === todayStr, isFuture: d > today });
    }
    return days;
  };

  const pageData = getPageData();

  const getIntensity = (v, isFuture) => {
    if (isFuture) return "bg-white/5 opacity-20";
    if (v === 0) return "bg-white/10 opacity-40";
    if (v < 0.3) return "bg-primary opacity-30";
    if (v < 0.6) return "bg-primary opacity-60";
    if (v < 1) return "bg-primary opacity-80";
    return "bg-primary shadow-[0_0_15px_var(--primary)]";
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-bold text-lg">Activity Heatmap</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase mr-4">
            <span>Less</span>
            {[0.1, 0.4, 0.7, 1].map(v => (
              <div key={v} className="w-2.5 h-2.5 rounded-[2px] bg-primary" style={{ opacity: v }} />
            ))}
            <span>More</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setPageOffset(pageOffset - 1)}
              className="p-1.5 rounded-lg glass hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setPageOffset(pageOffset + 1)}
              disabled={pageOffset >= 0}
              className={`p-1.5 rounded-lg glass transition-all ${pageOffset >= 0 ? "opacity-20 cursor-not-allowed" : "hover:bg-white/10"}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto no-scrollbar -mx-2 px-2">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 h-32 relative min-w-[600px] md:min-w-0">
          <div className="absolute inset-0 grid grid-rows-7 grid-flow-col gap-1.5 pointer-events-none opacity-[0.03]">
             {[...Array(84)].map((_, i) => <div key={i} className="w-full aspect-square bg-foreground rounded-[1px]" />)}
          </div>
          {pageData.map((day, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <div 
                key={i} 
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`w-full aspect-square rounded-[3px] transition-all duration-300 ${getIntensity(day.value, day.isFuture)} ${isHovered ? "scale-150 z-10 shadow-xl ring-2 ring-white/50" : ""}`}
              >
                {isHovered && !day.isFuture && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap z-50 pointer-events-none text-foreground dark:text-white">
                    {day.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {Math.round(day.value * 100)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>);
}

/* ---------- Recent Activity ---------- */
function Activities() {
  const { notifications } = useAether();
  
  const displayActivities = notifications.slice(0, 4).map(n => ({
    t: n.text,
    time: n.time,
    c: n.type === 'achievement' ? 'var(--gradient-pink)' : 
       n.type === 'system' ? 'var(--gradient-cyan)' : 
       'var(--gradient-primary)'
  }));

  return (
    <Card>
      <h3 className="font-semibold mb-3 flex items-center gap-2"><Activity className="w-4 h-4" /> Recent Activity</h3>
      <ul className="space-y-3">
        {displayActivities.map((a, i) =>
          <li key={i} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-1" style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.c }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate text-foreground">{a.t}</p>
              <p className="text-[10px] text-muted-foreground">{a.time}</p>
            </div>
          </li>
        )}
        {displayActivities.length === 0 && (
          <p className="text-center py-5 text-xs text-muted-foreground">No recent activity</p>
        )}
      </ul>
    </Card>);
}

/* ---------- Banner ---------- */
function MotivationBanner() {
  return (
    <Card className="relative overflow-hidden !p-6 text-white">
      <div className="absolute inset-0" style={{ background: "var(--gradient-primary)" }} />
      <div className="absolute inset-0 opacity-50" style={{ background: "var(--gradient-aurora)", filter: "blur(40px)" }} />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest opacity-80">Keep going</p>
          <h3 className="text-2xl font-bold mt-1">You're 80% to your weekly goal 🚀</h3>
          <p className="text-sm opacity-90 mt-1">One more focused day and you've crushed the week.</p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-white/95 text-primary text-sm font-semibold">View Plan</button>
      </div>
    </Card>);
}

/* ---------- Main Dashboard ---------- */
export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const { activeView, setActiveView, setTasks, tasks, setNotes, notes, goals, focusMinutes, streak, settings, setSettings, focusGoal, setFocusGoal, timerDuration, setTimerDuration, ambientSound, setAmbientSound, quickAdd } = useAether();

  // Accent Color Sync
  useEffect(() => {
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--primary', settings.accentColor);
      // Generate a subtle glow/gradient effect for the accent
      document.documentElement.style.setProperty('--primary-glow', `${settings.accentColor}4D`); // 30% opacity
    }
  }, [settings.accentColor]);

  // Score Calculations
  // Slower growth: Use a "Difficulty Buffer" of 10 tasks to prevent rapid 100%
  const totalWeight = tasks.length + 10;
  const productivityScore = tasks.length > 0 ? Math.round((tasks.filter(t => t.done).length / totalWeight) * 100) : 0;
  
  // Focus Score: Target 180 mins instead of 120 for slower growth
  const focusScore = Math.min(100, Math.round((focusMinutes / 180) * 100)); 
  
  // Goals Score: Based on actual 100% completion
  const goalsScore = goals.length > 0 ? Math.round((goals.filter(g => g.p >= 100).length / goals.length) * 100) : 0;
  const deepWorkHours = parseFloat((focusMinutes / 60).toFixed(2));
  const deepWorkGoalHours = focusGoal / 60;

  const handleQuickAdd = () => {
    if (activeView === "Tasks") {
      setTasks([{ id: Date.now(), t: "New Quick Task", done: false, tag: "Inbox" }, ...tasks]);
    } else if (activeView === "Notes") {
      setNotes([{ id: Date.now(), t: "Quick Thought", c: "...", color: "var(--gradient-primary)" }, ...notes]);
    } else {
      setTasks([{ id: Date.now(), t: "New Task from Dashboard", done: false, tag: "Quick" }, ...tasks]);
      setActiveView("Tasks");
    }
  };

  const renderView = () => {
    switch (activeView) {
      case "Tasks":
        return (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Tasks />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Activities />
              <QuoteCard />
            </div>
          </div>
        );
      case "Notes":
        return (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Notes />
            <Activities />
          </div>
        );
      case "Focus":
        return (
          <div className="relative min-h-[85vh] animate-in fade-in duration-700 flex flex-col items-center justify-center p-6 text-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/20 blur-[120px] animate-pulse" />
               <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-pink-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
            
            <button 
              onClick={() => setActiveView("Dashboard")}
              className="absolute top-0 left-0 p-3 rounded-2xl glass hover:bg-white/40 transition-all group"
            >
              <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>

            <div className="max-w-xl w-full space-y-12 relative">
               <div className="space-y-4">
                 <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Deep Work Session</h2>
                 <p className="text-muted-foreground text-sm">Distractions are blocked. Focus on the flow.</p>
               </div>

               <Pomodoro onModeChange={() => { /* reset timer logic here */ }} />

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="!bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                       <Headphones className="w-4 h-4 text-pink-500" />
                       <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ambient Sound</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {["None", "Rain", "Forest", "Cafe", "Waves"].map(s => (
                         <button 
                           key={s} 
                           onClick={() => {
                             setAmbientSound(s);
                             if (s !== "None") {
                               toast.info(`Now playing: ${s}`, {
                                 description: "Immersive soundscape activated for your session.",
                                 icon: <Headphones className="w-4 h-4" />
                               });
                             }
                           }}
                           className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${ambientSound === s ? "bg-primary text-white" : "glass hover:bg-white/40"}`}
                         >
                           {s}
                         </button>
                       ))}
                    </div>
                 </Card>
                 
                 <Card className="!bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                       <Flame className="w-4 h-4 text-orange-500" />
                       <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Streak</h4>
                    </div>
                    <div className="flex items-center justify-between">
                       <p className="text-2xl font-bold">{streak} Days</p>
                       <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-orange-500/40" />)}
                       </div>
                    </div>
                 </Card>
               </div>
            </div>
          </div>
        );
      case "Goals":
        return (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Goals />
            <Achievements />
          </div>
        );
      case "Calendar":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-2xl font-bold mb-4">Monthly Schedule</h2>
             <MiniCalendar />
          </div>
        );
      case "Analytics":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5">
             <h2 className="text-2xl font-bold mb-4">Performance Insights</h2>
             <Analytics />
             <Heatmap />
          </div>
        );
      case "Achievements":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-2xl font-bold mb-4">Your Milestones</h2>
             <Achievements />
          </div>
        );
      case "Focus Sounds":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-2xl font-bold mb-4">Ambient Soundscapes</h2>
             <MusicWidget />
          </div>
        );
      case "Settings":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto py-5">
             <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                 <Settings className="w-6 h-6 text-primary" />
               </div>
               <h2 className="text-3xl font-bold">System Settings</h2>
             </div>
             
             <div className="space-y-6">
                <Card>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Appearance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <p className="text-sm font-bold">Dark Mode</p>
                        <p className="text-[11px] text-muted-foreground">Toggle between light and dark themes</p>
                      </div>
                      <button 
                        onClick={() => {
                          const isDark = document.documentElement.classList.toggle('dark');
                          setSettings({ ...settings, theme: isDark ? 'dark' : 'light' });
                        }}
                        className={`w-12 h-6 rounded-full transition-all relative ${settings.theme === 'dark' ? "bg-primary" : "bg-black/10 dark:bg-white/20"}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg ring-1 ring-black/5 transition-all ${settings.theme === 'dark' ? "right-1" : "left-1"}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <p className="text-sm font-bold">Accent Color</p>
                        <p className="text-[11px] text-muted-foreground">Customize the primary application color</p>
                      </div>
                      <div className="flex gap-2">
                        {['#6366f1', '#ec4899', '#06b6d4', '#f59e0b', '#10b981'].map(c => (
                          <button 
                            key={c} 
                            onClick={() => setSettings({ ...settings, accentColor: c })}
                            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 active:scale-95 ${settings.accentColor === c ? "border-white scale-125 shadow-lg" : "border-white/20"}`}
                            style={{ backgroundColor: c }} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Focus & Productivity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <p className="text-sm font-bold">Daily Focus Goal</p>
                        <p className="text-[11px] text-muted-foreground">Target deep work per day: {focusGoal / 60} hours</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <button onClick={() => setFocusGoal(Math.max(60, focusGoal - 60))} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">-</button>
                         <span className="text-sm font-bold w-4 text-center">{focusGoal / 60}</span>
                         <button onClick={() => setFocusGoal(focusGoal + 60)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">+</button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <p className="text-sm font-bold">Session Duration</p>
                        <p className="text-[11px] text-muted-foreground">Pomodoro length: {timerDuration} minutes</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <button onClick={() => setTimerDuration(Math.max(5, timerDuration - 5))} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">-</button>
                         <span className="text-sm font-bold w-8 text-center">{timerDuration}</span>
                         <button onClick={() => setTimerDuration(timerDuration + 5)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold">+</button>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Sync & Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <p className="text-sm font-bold">Manual Sync</p>
                        <p className="text-[11px] text-muted-foreground">Force a manual cloud synchronization</p>
                      </div>
                      <button 
                        onClick={() => {
                          toast.promise(new Promise(r => setTimeout(r, 1500)), {
                            loading: 'Syncing with AetherCloud...',
                            success: 'Sync complete! All your data is safe. ☁️',
                            error: 'Sync failed. Please check your connection.',
                          });
                        }}
                        className="px-4 py-1.5 rounded-lg bg-primary text-white text-[10px] font-bold hover:opacity-90 transition-opacity"
                      >
                        Sync Now
                      </button>
                    </div>
                  </div>
                </Card>
             </div>
          </div>
        );
      case "Dashboard":
      default:
        return (
          <div className="space-y-5 animate-in fade-in duration-500">
            <Greeting />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <ScoreCard icon={Sparkles} label="Productivity Score" value={productivityScore} sub={`${tasks.filter(t => t.done).length} done`}
              gradient="var(--gradient-primary)" ringColor="var(--gradient-primary)" />
              <ScoreCard icon={Zap} label="Focus Score" value={focusScore} sub={`${Math.round(focusMinutes)}m`}
              gradient="var(--gradient-cyan)" ringColor="var(--gradient-cyan)" />
              <ScoreCard icon={Target} label="Goals Hit" value={goalsScore} sub={`${goals.filter(g => g.p >= 100).length} hit`}
              gradient="var(--gradient-pink)" ringColor="var(--gradient-pink)" />
              <ScoreCard 
                icon={Clock} 
                label="Deep Work" 
                value={Math.min(100, (focusMinutes / focusGoal) * 100)} 
                sub={`${deepWorkHours}h / ${deepWorkGoalHours}h`}
                gradient="linear-gradient(135deg, oklch(0.78 0.15 50), oklch(0.7 0.18 20))"
                ringColor="linear-gradient(135deg, oklch(0.78 0.15 50), oklch(0.7 0.18 20))"
                onEdit={() => {
                  const newGoal = prompt("How many hours do you want to focus today? (e.g. 4 or 5)", focusGoal / 60);
                  if (newGoal) setFocusGoal(parseFloat(newGoal) * 60);
                }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-5">
                <Analytics />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Tasks />
                  <Goals />
                </div>
                <Notes />
                <MotivationBanner />
                <Heatmap />
              </div>

              <div className="space-y-5">
                <Pomodoro />
                <div className="grid grid-cols-2 gap-5">
                  <Streak />
                  <Weather />
                </div>
                <Mood />
                <MiniCalendar />
                <MusicWidget />
                <Achievements />
                <QuoteCard />
                <Activities />
              </div>
            </div>
          </div>
        );
    }
  };

  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isViewChanging, setIsViewChanging] = useState(false);

  useEffect(() => {
    // Initial App Load animation
    const timer = setTimeout(() => setIsAppLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // View change animation trigger
    setIsViewChanging(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => setIsViewChanging(false), 800);
    return () => clearTimeout(timer);
  }, [activeView]);

  if (isAppLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background dark:bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at center, var(--primary) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-1000">
          <Logo className="w-20 h-20 rounded-3xl mb-6 ring-4 ring-primary/10 animate-pulse" iconClassName="w-10 h-10" />
          <h1 className="text-4xl font-black gradient-text tracking-tighter mb-2">AetherFlow</h1>
          <div className="h-1 w-48 bg-white/10 rounded-full overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 bg-primary w-1/3 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-medium uppercase tracking-[0.2em] opacity-50">Initializing System</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex animate-in fade-in duration-700">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <main className="flex-1 min-w-0 flex flex-col p-3 sm:p-4 lg:p-6 space-y-5 relative overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto w-full flex flex-col space-y-5">
          {activeView !== "Focus" && <TopBar onMenu={() => setOpen(true)} />}

          <div className="relative">
          {isViewChanging && (
            <div className="absolute inset-0 z-50 flex items-center justify-center animate-in fade-in duration-300 pointer-events-none">
              <div className="view-loader" />
            </div>
          )}
          <div className={`transition-all duration-500 ${isViewChanging ? "opacity-0 scale-[0.98] blur-sm" : "opacity-100 scale-100 blur-0"}`}>
            {renderView()}
          </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground pb-4 mt-auto pt-10">
          AetherFlow · Designed for deep work and beautiful focus.
        </p>
      </main>

      {/* Floating Add Button */}
      <button 
        onClick={handleQuickAdd}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-white flex items-center justify-center glow-ring hover:scale-110 active:scale-95 transition-all z-50 shadow-2xl"
        style={{ background: "var(--gradient-primary)" }}
        title="Quick Add"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>);
}