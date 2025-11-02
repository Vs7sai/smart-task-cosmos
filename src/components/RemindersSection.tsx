import { Task } from "@/types/task";
import { Bell, Calendar, Clock, Trash2, Repeat } from "lucide-react";
import { format, isBefore, isToday, isTomorrow } from "date-fns";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface RemindersSectionProps {
  tasks: Task[];
  onDeleteReminder: (taskId: string) => void;
  onEditReminder: (task: Task) => void;
}

export const RemindersSection = ({ tasks, onDeleteReminder, onEditReminder }: RemindersSectionProps) => {
  const tasksWithReminders = tasks.filter(task => task.reminder?.enabled);
  
  console.log("Total tasks:", tasks.length);
  console.log("Tasks with reminders:", tasksWithReminders.length);
  console.log("Reminders:", tasksWithReminders.map(t => ({ title: t.title, reminder: t.reminder })));

  const getTimeLabel = (date: Date) => {
    const reminderDate = new Date(date);
    if (isToday(reminderDate)) return "Today";
    if (isTomorrow(reminderDate)) return "Tomorrow";
    return format(reminderDate, "MMM d");
  };

  const isOverdue = (date: Date) => {
    return isBefore(new Date(date), new Date());
  };

  const categoryColors: Record<string, string> = {
    work: "bg-blue-500/10 text-blue-600 border-blue-200",
    personal: "bg-purple-500/10 text-purple-600 border-purple-200",
    shopping: "bg-green-500/10 text-green-600 border-green-200",
    health: "bg-red-500/10 text-red-600 border-red-200"
  };

  if (tasksWithReminders.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No reminders set</p>
        <p className="text-sm text-muted-foreground mt-1">
          Click the bell icon on any task to set a reminder
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tasksWithReminders.map(task => {
        const reminderTime = new Date(task.reminder!.time);
        const isRecurringDaily = task.reminder?.recurring === 'daily';
        const overdue = !isRecurringDaily && isOverdue(reminderTime);

        return (
          <Card
            key={task.id}
            className={cn(
              "p-4 transition-all hover:shadow-md cursor-pointer",
              overdue && "border-destructive/50 bg-destructive/5"
            )}
            onClick={() => onEditReminder(task)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-start gap-2">
                  <div className={cn(
                    "p-2 rounded-lg flex-shrink-0",
                    overdue ? "bg-destructive/10" : "bg-primary/10"
                  )}>
                    <Bell className={cn(
                      "h-5 w-5",
                      overdue ? "text-destructive" : "text-primary"
                    )} />
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "font-medium",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="outline" className={categoryColors[task.category]}>
                        {task.category}
                      </Badge>
                      {isRecurringDaily ? (
                        <>
                          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                            <Repeat className="h-3 w-3 mr-1" />
                            Every day at {format(reminderTime, "h:mm a")}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Started {format(reminderTime, "MMM d")}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{getTimeLabel(reminderTime)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{format(reminderTime, "h:mm a")}</span>
                          </div>
                          {overdue && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteReminder(task.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
