import { useEffect, useRef } from "react";
import { Task } from "@/types/task";
import { useAlarmSettings } from "./useAlarmSettings";
import { useToast } from "./use-toast";
import { format } from "date-fns";

export const useReminderAlarm = (tasks: Task[]) => {
  const { selectedSound } = useAlarmSettings();
  const { toast } = useToast();
  const checkedReminders = useRef<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentMinute = format(now, "yyyy-MM-dd HH:mm");

      tasks.forEach((task) => {
        if (!task.reminder?.enabled || task.completed) return;

        const reminderTime = new Date(task.reminder.time);
        const reminderMinute = format(reminderTime, "yyyy-MM-dd HH:mm");
        
        // Create unique ID for this reminder instance
        const reminderId = `${task.id}-${reminderMinute}`;

        // Check if this reminder should ring now
        if (reminderMinute === currentMinute && !checkedReminders.current.has(reminderId)) {
          checkedReminders.current.add(reminderId);
          
          // Play alarm sound
          if (audioRef.current) {
            audioRef.current.pause();
          }
          audioRef.current = new Audio(`/sounds/${selectedSound}.mp3`);
          audioRef.current.volume = 0.7;
          audioRef.current.play().catch(err => console.log("Audio play failed:", err));

          // Show notification toast
          toast({
            title: "⏰ Reminder Alert!",
            description: task.title,
            duration: 4000,
            className: "bg-gradient-primary text-white border-0",
          });

          // Browser notification if permission granted
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("FlowState Reminder", {
              body: task.title,
              icon: "/favicon.ico",
              tag: task.id,
            });
          }
        }
      });

      // Clean up old checked reminders (older than 2 minutes)
      const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
      const twoMinutesAgoStr = format(twoMinutesAgo, "yyyy-MM-dd HH:mm");
      
      checkedReminders.current.forEach((id) => {
        const [, timestamp] = id.split('-').slice(-5).join('-').split('-');
        if (timestamp < twoMinutesAgoStr) {
          checkedReminders.current.delete(id);
        }
      });
    };

    // Check every 10 seconds
    const interval = setInterval(checkReminders, 10000);
    
    // Check immediately
    checkReminders();

    return () => clearInterval(interval);
  }, [tasks, selectedSound, toast]);
};
