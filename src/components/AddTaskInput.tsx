import { useState } from "react";
import { Plus, Briefcase, User, ShoppingCart, Heart, AlertCircle, ArrowUp, ArrowDown, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task } from "@/types/task";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddTaskInputProps {
  onAdd: (task: Omit<Task, "id" | "createdAt">) => void;
}

export const AddTaskInput = ({ onAdd }: AddTaskInputProps) => {
  const [title, setTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Task["category"] | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<Task["priority"] | null>(null);
  const [lastCategory, setLastCategory] = useState<Task["category"]>("personal");
  const [lastPriority, setLastPriority] = useState<Task["priority"]>("low");
  const [reminderTime, setReminderTime] = useState("");
  const [reminderRecurring, setReminderRecurring] = useState<'none' | 'daily'>('none');
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  const detectCategory = (text: string): Task["category"] => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("work") || lowerText.includes("meeting") || lowerText.includes("email")) {
      return "work";
    }
    if (lowerText.includes("buy") || lowerText.includes("shop") || lowerText.includes("get")) {
      return "shopping";
    }
    if (lowerText.includes("doctor") || lowerText.includes("exercise") || lowerText.includes("gym")) {
      return "health";
    }
    return "personal";
  };

  const detectPriority = (text: string): Task["priority"] => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("urgent") || lowerText.includes("asap") || lowerText.includes("important")) {
      return "high";
    }
    if (lowerText.includes("soon") || lowerText.includes("today")) {
      return "medium";
    }
    return "low";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await Haptics.impact({ style: ImpactStyle.Medium });

    const category = selectedCategory || detectCategory(title);
    const priority = selectedPriority || detectPriority(title);

    console.log("AddTaskInput submit - reminder:", { time: reminderTime, recurring: reminderRecurring });

    onAdd({
      title: title.trim(),
      completed: false,
      category,
      priority,
      reminder: reminderTime ? {
        time: new Date(reminderTime),
        enabled: true,
        recurring: reminderRecurring
      } : undefined
    });

    // Remember last selections for next task
    setLastCategory(category);
    setLastPriority(priority);

    setTitle("");
    setIsExpanded(false);
    setSelectedCategory(null);
    setSelectedPriority(null);
    setReminderTime("");
    setReminderRecurring('none');
  };

  const handleClose = () => {
    setTitle("");
    setIsExpanded(false);
    setSelectedCategory(null);
    setSelectedPriority(null);
    setReminderTime("");
    setReminderRecurring('none');
  };

  const handleFocus = () => {
    setIsExpanded(true);
    // Set defaults to last used values if nothing is selected
    if (!selectedCategory) {
      setSelectedCategory(lastCategory);
    }
    if (!selectedPriority) {
      setSelectedPriority(lastPriority);
    }
  };

  const categories = [
    { key: "work" as const, label: "Work", icon: Briefcase },
    { key: "personal" as const, label: "Personal", icon: User },
    { key: "shopping" as const, label: "Shopping", icon: ShoppingCart },
    { key: "health" as const, label: "Health", icon: Heart },
  ];

  const priorities = [
    { key: "low" as const, label: "Low", icon: ArrowDown },
    { key: "medium" as const, label: "Medium", icon: AlertCircle },
    { key: "high" as const, label: "High", icon: ArrowUp },
  ];

  const detectedCategory = detectCategory(title);
  const detectedPriority = detectPriority(title);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-card rounded-2xl shadow-elegant p-4 transition-all duration-300">
        <div className="flex gap-3 items-start">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={handleFocus}
            placeholder="Add a new task..."
            className="flex-1 border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary rounded-xl text-base"
          />
          <Popover open={isReminderOpen} onOpenChange={setIsReminderOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-xl transition-colors",
                  reminderTime ? "text-primary hover:bg-primary/10" : "hover:bg-muted"
                )}
              >
                <Bell className={cn("h-5 w-5", reminderTime && "fill-current")} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h4 className="font-medium">Set Reminder</h4>
                <div className="space-y-2">
                  <Label htmlFor="reminder-recurring">Repeat</Label>
                  <Select value={reminderRecurring} onValueChange={(value) => setReminderRecurring(value as 'none' | 'daily')}>
                    <SelectTrigger id="reminder-recurring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Don't repeat</SelectItem>
                      <SelectItem value="daily">Every day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reminder-time">
                    {reminderRecurring === 'daily' ? 'Starts from' : 'Time'}
                  </Label>
                  <Input
                    id="reminder-time"
                    type="datetime-local"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  {reminderRecurring === 'daily' && reminderTime && (
                    <p className="text-xs text-muted-foreground">
                      This task will appear every day at {new Date(reminderTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  {reminderTime && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setReminderTime("");
                        setReminderRecurring('none');
                      }}
                      className="w-full"
                    >
                      Clear Reminder
                    </Button>
                  )}
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      if (title.trim()) {
                        // Auto-submit the form when saving reminder
                        handleSubmit(e as any);
                      }
                      setIsReminderOpen(false);
                    }}
                    disabled={!reminderTime}
                    className="w-full"
                  >
                    Save Reminder
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {isExpanded && (
            <Button
              type="button"
              onClick={handleClose}
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          <Button
            type="submit"
            disabled={!title.trim()}
            className="bg-gradient-primary hover:opacity-90 rounded-xl px-6 shadow-glow transition-all duration-300 disabled:opacity-50"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-3 animate-slide-down">
            {/* Category Selection */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Category
              </label>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.key;
                  const isDetected = !selectedCategory && detectedCategory === cat.key;
                  
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setSelectedCategory(cat.key)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                        "border hover:scale-105 active:scale-95",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : isDetected
                          ? "bg-primary/20 text-primary border-primary/30"
                          : "bg-muted border-border text-foreground hover:border-primary/50"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority Selection */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Priority
              </label>
              <div className="flex gap-2 flex-wrap">
                {priorities.map((pri) => {
                  const Icon = pri.icon;
                  const isSelected = selectedPriority === pri.key;
                  const isDetected = !selectedPriority && detectedPriority === pri.key;
                  
                  return (
                    <button
                      key={pri.key}
                      type="button"
                      onClick={() => setSelectedPriority(pri.key)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                        "border hover:scale-105 active:scale-95",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : isDetected
                          ? "bg-primary/20 text-primary border-primary/30"
                          : "bg-muted border-border text-foreground hover:border-primary/50"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {pri.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {title && !selectedCategory && !selectedPriority && (
              <p className="text-xs text-muted-foreground/70 italic">
                💡 Auto-detected: <span className="capitalize">{detectedCategory}</span> • {detectedPriority} priority
              </p>
            )}
          </div>
        )}
      </div>
    </form>
  );
};
