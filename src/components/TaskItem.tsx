import { Task } from "@/types/task";
import { Trash2, Bell } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetReminder: (task: Task) => void;
}

const categoryColors = {
  work: "bg-primary/10 text-primary border-primary/20",
  personal: "bg-accent/10 text-accent border-accent/20",
  shopping: "bg-secondary/10 text-secondary border-secondary/20",
  health: "bg-success/10 text-success border-success/20",
};

const priorityIndicators = {
  high: "border-l-4 border-l-destructive",
  medium: "border-l-4 border-l-primary",
  low: "border-l-4 border-l-muted-foreground",
};

export const TaskItem = ({ task, onToggle, onDelete, onSetReminder }: TaskItemProps) => {
  const handleToggle = async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
    onToggle(task.id);
  };

  const handleDelete = async () => {
    await Haptics.impact({ style: ImpactStyle.Medium });
    onDelete(task.id);
  };

  return (
    <div
      className={cn(
        "group bg-card rounded-2xl p-4 shadow-elegant transition-all duration-300",
        "hover:shadow-glow hover:scale-[1.02]",
        priorityIndicators[task.priority],
        task.completed && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggle}
            className={cn(
              "h-6 w-6 rounded-full border-2 transition-all",
              task.completed && "bg-gradient-success border-success"
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-base font-medium transition-all duration-300",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </p>

          <div className="flex items-center justify-between gap-2 mt-2 flex-wrap">
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-full border font-medium",
                categoryColors[task.category]
              )}
            >
              {task.category}
            </span>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetReminder(task);
                }}
                aria-label="Set reminder"
              >
                <Bell className={cn("h-4 w-4", task.reminder?.enabled && "fill-current")} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
