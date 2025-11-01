import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Bell, X } from "lucide-react";
import { Task } from "@/types/task";

interface SetReminderDialogProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  onSetReminder: (taskId: string, reminderTime: Date | null, recurring?: 'none' | 'daily') => void;
}

export const SetReminderDialog = ({ task, open, onClose, onSetReminder }: SetReminderDialogProps) => {
  const [reminderDate, setReminderDate] = useState(
    task.reminder?.time ? new Date(task.reminder.time).toISOString().slice(0, 16) : ""
  );
  const [recurring, setRecurring] = useState<'none' | 'daily'>(task.reminder?.recurring || 'none');

  const handleSave = () => {
    if (reminderDate) {
      onSetReminder(task.id, new Date(reminderDate), recurring);
    }
    onClose();
  };

  const handleRemove = () => {
    onSetReminder(task.id, null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Set Reminder
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task</Label>
            <p className="text-sm text-muted-foreground">{task.title}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reminder-time">Reminder Time</Label>
            <Input
              id="reminder-time"
              type="datetime-local"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recurring">Repeat</Label>
            <Select value={recurring} onValueChange={(value) => setRecurring(value as 'none' | 'daily')}>
              <SelectTrigger id="recurring">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Don't repeat</SelectItem>
                <SelectItem value="daily">Every day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          {task.reminder && (
            <Button
              variant="destructive"
              onClick={handleRemove}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          )}
          <Button onClick={handleSave} disabled={!reminderDate}>
            Save Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
