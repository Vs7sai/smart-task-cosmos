import { useState } from "react";
import { Plus, Briefcase, User, ShoppingCart, Heart, AlertCircle, ArrowUp, ArrowDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task } from "@/types/task";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { cn } from "@/lib/utils";

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

    onAdd({
      title: title.trim(),
      completed: false,
      category,
      priority,
    });

    // Remember last selections for next task
    setLastCategory(category);
    setLastPriority(priority);

    setTitle("");
    setIsExpanded(false);
    setSelectedCategory(null);
    setSelectedPriority(null);
  };

  const handleClose = () => {
    setTitle("");
    setIsExpanded(false);
    setSelectedCategory(null);
    setSelectedPriority(null);
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
  const finalCategory = selectedCategory || detectedCategory;
  const finalPriority = selectedPriority || detectedPriority;

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
