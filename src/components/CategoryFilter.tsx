import { Task } from "@/types/task";
import { cn } from "@/lib/utils";
import { Briefcase, User, ShoppingCart, Heart } from "lucide-react";

interface CategoryFilterProps {
  selected: Task["category"] | "all";
  onSelect: (category: Task["category"] | "all") => void;
  taskCounts: Record<string, number>;
}

const categories = [
  { key: "all" as const, label: "All", icon: null },
  { key: "work" as const, label: "Work", icon: Briefcase },
  { key: "personal" as const, label: "Personal", icon: User },
  { key: "shopping" as const, label: "Shopping", icon: ShoppingCart },
  { key: "health" as const, label: "Health", icon: Heart },
];

const categoryStyles = {
  all: "bg-gradient-primary text-white",
  work: "bg-primary/10 text-primary border-primary/20",
  personal: "bg-accent/10 text-accent border-accent/20",
  shopping: "bg-secondary/10 text-secondary border-secondary/20",
  health: "bg-success/10 text-success border-success/20",
};

export const CategoryFilter = ({ selected, onSelect, taskCounts }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const Icon = category.icon;
        const count = category.key === "all" 
          ? Object.values(taskCounts).reduce((sum, c) => sum + c, 0)
          : taskCounts[category.key] || 0;
        
        const isSelected = selected === category.key;
        
        return (
          <button
            key={category.key}
            onClick={() => onSelect(category.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 border whitespace-nowrap",
              "hover:scale-105 active:scale-95",
              isSelected
                ? categoryStyles[category.key] + " shadow-glow"
                : "bg-card border-border text-foreground hover:border-primary/50"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{category.label}</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-bold",
                isSelected ? "bg-white/20" : "bg-muted"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
