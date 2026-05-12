import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const AetherContext = createContext();

export function useAether() {
  return useContext(AetherContext);
}

// Custom hook for local storage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(error);
    }
  };

  return [storedValue, setValue];
}

export function AetherProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage("aether_tasks", []);
  const [notes, setNotes] = useLocalStorage("aether_notes", []);
  const [goals, setGoals] = useLocalStorage("aether_goals", []);

  const [streak, setStreak] = useLocalStorage("aether_streak", 0);
  const [highestStreak, setHighestStreak] = useLocalStorage("aether_highest_streak", 0);
  const [streakFreeze, setStreakFreeze] = useLocalStorage("aether_streak_freeze", 1); // 1 per month
  const [lastStreakUpdate, setLastStreakUpdate] = useLocalStorage("aether_streak_date", "");
  
  const [heatmapHistory, setHeatmapHistory] = useLocalStorage("aether_heatmap_history", []);
  const [dailyHistory, setDailyHistory] = useLocalStorage("aether_daily_history", {});

  const [focusMinutes, setFocusMinutes] = useLocalStorage("aether_focus_mins", 0);
  const [focusGoal, setFocusGoal] = useLocalStorage("aether_focus_goal", 240); // 4 hours in minutes
  const [timerDuration, setTimerDuration] = useLocalStorage("aether_timer_dur", 25); // 25 mins pomodoro

  // Weekly analytics data (7 days)
  const [weeklyAnalytics, setWeeklyAnalytics] = useLocalStorage("aether_weekly", [0, 0, 0, 0, 0, 0, 0]);
  

  // Mood tracking
  const [moods, setMoods] = useLocalStorage("aether_moods", []);
  
  // Notifications
  const [notifications, setNotifications] = useLocalStorage("aether_notifications", [
    { id: 1, text: "Welcome to AetherFlow! Ready to be productive?", read: false, time: "Just now", type: "system" }
  ]);

  // Settings
  const [settings, setSettings] = useLocalStorage("aether_settings", {
    theme: "light",
    notifications: true,
    music: true,
    focusDuration: 25,
    breakDuration: 5,
    dailyGoal: 5,
    autoSync: true
  });

  // Music State
  const [musicState, setMusicState] = useLocalStorage("aether_music_state", {
    playing: false,
    currentTrack: 0,
    volume: 50,
    mode: "focus"
  });

  // Ambient Sound State
  const [ambientSound, setAmbientSound] = useLocalStorage("aether_ambient_sound", "None");

  const [lastTaskResetDate, setLastTaskResetDate] = useLocalStorage("aether_task_reset_date", "");

  // General App State
  const [activeView, setActiveView] = useState("Dashboard");
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // --- Quick Add Logic ---
  const quickAdd = (type) => {
    if (type === "task") {
      setTasks(prev => [{ id: Date.now(), t: "New Quick Task", done: false, tag: "Inbox", p: "low" }, ...prev]);
      setActiveView("Tasks");
    } else if (type === "note") {
      const colors = ["var(--gradient-cyan)", "var(--gradient-pink)", "var(--gradient-primary)", "var(--gradient-aurora)"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setNotes(prev => [{ id: Date.now(), t: "Quick Thought", c: "...", color: randomColor }, ...prev]);
      setActiveView("Notes");
    } else if (type === "goal") {
      setGoals(prev => [...prev, { t: "New Goal", p: 0, color: "var(--gradient-primary)" }]);
      setActiveView("Goals");
    }
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added!`, {
      description: `New ${type} added via Quick Capture. ⚡`
    });

    setNotifications(prev => [
      { id: Date.now(), text: `New ${type} added via Quick Capture! ⚡`, read: false, time: "Just now", type: "system" },
      ...prev
    ]);
  };

  // --- Daily Logic ---
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    
    // 1. Daily Transition Logic
    if (lastTaskResetDate && lastTaskResetDate !== today) {
      const yesterday = lastTaskResetDate;
      const completedTasks = tasks.filter(t => t.done).length;
      const totalTasks = tasks.length;
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      const didTaskYesterday = completedTasks > 0;

      // Save yesterday to History/Heatmap
      setHeatmapHistory(prev => {
        const exists = prev.findIndex(h => h.date === yesterday);
        if (exists !== -1) {
          const updated = [...prev];
          updated[exists].value = completionRate / 100;
          return updated;
        }
        return [...prev, { date: yesterday, value: completionRate / 100 }];
      });

      // Streak Logic
      const lastDate = new Date(yesterday);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (!didTaskYesterday && diffDays >= 1) {
        // Only reset if no freeze available
        if (streakFreeze > 0) {
          setStreakFreeze(prev => prev - 1);
          setNotifications(prev => [
            { id: Date.now(), text: "Streak Freeze used! Your streak was protected. ❄️", read: false, time: "Just now", type: "system" },
            ...prev
          ]);
        } else {
          setStreak(0);
        }
      }

      // Reset Tasks for new day
      setTasks(prev => prev.map(t => ({ ...t, done: false })));
      setLastTaskResetDate(today);
      
      // Monthly Streak Freeze Reset (if it's a new month)
      const lastMonth = new Date(yesterday).getMonth();
      const currentMonth = new Date(today).getMonth();
      if (lastMonth !== currentMonth) {
        setStreakFreeze(1);
      }
    } else if (!lastTaskResetDate) {
      // First time initialization
      setLastTaskResetDate(today);
    }

    // Streak increment logic: if a task is done today and streak hasn't been updated today
    const hasDoneTaskToday = tasks.some(t => t.done);
    if (hasDoneTaskToday && lastStreakUpdate !== today) {
      setStreak(prev => {
        const newStreak = (prev || 0) + 1;
        if (newStreak > highestStreak) setHighestStreak(newStreak);
        return newStreak;
      });
      setLastStreakUpdate(today);
      
      toast.info("Streak updated! 🔥", {
        description: "You've completed your first task for today. Keep it up!"
      });

      setNotifications(prev => [
        { id: Date.now(), text: "Streak updated! Keep it up. 🔥", read: false, time: "Just now", type: "system" },
        ...prev
      ]);
    }
  }, [lastTaskResetDate, lastStreakUpdate, tasks, streak, highestStreak, streakFreeze]);

  // --- Hour Milestone Notifications ---
  const [lastHourNotified, setLastHourNotified] = useLocalStorage("aether_last_hour_notified", 0);

  useEffect(() => {
    const currentHour = Math.floor(focusMinutes / 60);
    if (currentHour > lastHourNotified && currentHour > 0) {
      const messages = [
        `Amazing! You've completed ${currentHour} hour(s) of Deep Work today. 🚀`,
        `Milestone reached: ${currentHour} hours of focus! Keep that momentum going. ✨`,
        `You're on fire! ${currentHour} hours of deep work logged. Let's keep flowing. 🔥`,
        `Legendary focus! You just hit the ${currentHour}-hour mark. 🏆`
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      
      toast.success("Focus Milestone! 🏆", {
        description: randomMsg
      });

      setNotifications(prev => [
        { id: Date.now(), text: randomMsg, read: false, time: "Just now", type: "achievement" },
        ...prev
      ]);
      setLastHourNotified(currentHour);
    }
  }, [focusMinutes, lastHourNotified]);

  // 4. Theme & Accent Sync
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply accent color
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--primary', settings.accentColor);
      // Also update gradients if needed, but primary is the main one
    }
  }, [settings.theme, settings.accentColor]);

  // 5. Daily History Real-time Sync
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const completed = tasks.filter(t => t.done).length;
    const total = tasks.length;
    if (total > 0) {
      const rate = (completed / total) * 100;
      setDailyHistory(prev => ({ ...prev, [today]: rate }));
    }
  }, [tasks]);

  return (
    <AetherContext.Provider value={{
      tasks, setTasks,
      notes, setNotes,
      goals, setGoals,
      streak, setStreak,
      lastStreakUpdate, setLastStreakUpdate,
      focusMinutes, setFocusMinutes,
      weeklyAnalytics, setWeeklyAnalytics,
      activeView, setActiveView,
      moods, setMoods,
      notifications, setNotifications,
      settings, setSettings,
      musicState, setMusicState,
      ambientSound, setAmbientSound,
      lastTaskResetDate, setLastTaskResetDate,
      heatmapHistory, setHeatmapHistory,
      dailyHistory, setDailyHistory,
      isTimerRunning, setIsTimerRunning,
      focusGoal, setFocusGoal,
      timerDuration, setTimerDuration,
      highestStreak, streakFreeze,
      quickAdd
    }}>
      {children}
    </AetherContext.Provider>
  );
}
