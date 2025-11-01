import { Task } from "@/types/task";
import { cn } from "@/lib/utils";

interface ProgressWheelProps {
  tasks: Task[];
  category?: Task["category"];
}

const categoryGradients = {
  work: "from-primary to-primary-glow",
  personal: "from-accent to-accent",
  shopping: "from-secondary to-secondary",
  health: "from-success to-success",
};

export const ProgressWheel = ({ tasks, category }: ProgressWheelProps) => {
  const filteredTasks = category
    ? tasks.filter((t) => t.category === category)
    : tasks;

  const total = filteredTasks.length;
  const completed = filteredTasks.filter((t) => t.completed).length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="white"
          strokeWidth="8"
          fill="none"
          className="opacity-30"
        />
        
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f0f0f0" />
          </linearGradient>
        </defs>
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">
          {Math.round(percentage)}%
        </span>
        <span className="text-xs text-white/80 mt-1">
          {completed}/{total}
        </span>
      </div>
    </div>
  );
};
