import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task } from "@/types/task";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

interface AddTaskInputProps {
  onAdd: (task: Omit<Task, "id" | "createdAt">) => void;
}

export const AddTaskInput = ({ onAdd }: AddTaskInputProps) => {
  const [title, setTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

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

    const category = detectCategory(title);
    const priority = detectPriority(title);

    onAdd({
      title: title.trim(),
      completed: false,
      category,
      priority,
    });

    setTitle("");
    setIsExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-card rounded-2xl shadow-elegant p-4 transition-all duration-300">
        <div className="flex gap-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Add a new task..."
            className="flex-1 border-0 bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary rounded-xl text-base"
          />
          <Button
            type="submit"
            disabled={!title.trim()}
            className="bg-gradient-primary hover:opacity-90 rounded-xl px-6 shadow-glow transition-all duration-300 disabled:opacity-50"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        {isExpanded && title && (
          <div className="mt-3 pt-3 border-t border-border/50 animate-slide-down">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Smart detection:</span>{" "}
              <span className="capitalize">{detectCategory(title)}</span> •{" "}
              <span className="capitalize">{detectPriority(title)}</span> priority
            </p>
          </div>
        )}
      </div>
    </form>
  );
};
