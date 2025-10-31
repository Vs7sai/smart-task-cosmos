import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { TaskItem } from "@/components/TaskItem";
import { AddTaskInput } from "@/components/AddTaskInput";
import { ProgressWheel } from "@/components/ProgressWheel";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Sparkles, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Preferences } from "@capacitor/preferences";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const STORAGE_KEY = "flowstate_tasks";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Task["category"] | "all">("all");
  const { toast } = useToast();

  // Load tasks from storage
  useEffect(() => {
    const loadTasks = async () => {
      const { value } = await Preferences.get({ key: STORAGE_KEY });
      if (value) {
        const parsed = JSON.parse(value);
        setTasks(parsed.map((t: Task) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
        })));
      }
    };
    loadTasks();
  }, []);

  // Save tasks to storage
  useEffect(() => {
    if (tasks.length > 0) {
      Preferences.set({
        key: STORAGE_KEY,
        value: JSON.stringify(tasks),
      });
    }
  }, [tasks]);

  const addTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    setTasks((prev) => [newTask, ...prev]);
    
    toast({
      title: "Task added! ✨",
      description: `Added to ${taskData.category}`,
    });
  };

  const toggleTask = async (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const completed = !task.completed;
          
          if (completed) {
            Haptics.impact({ style: ImpactStyle.Heavy });
            toast({
              title: "Great job! 🎉",
              description: "Task completed",
              className: "bg-gradient-success text-white border-0",
            });
          }
          
          return {
            ...task,
            completed,
            completedAt: completed ? new Date() : undefined,
          };
        }
        return task;
      })
    );
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast({
      title: "Task deleted",
      variant: "destructive",
    });
  };

  const filteredTasks = tasks.filter(
    (task) => selectedCategory === "all" || task.category === selectedCategory
  );

  const taskCounts = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const completedToday = tasks.filter(
    (task) =>
      task.completed &&
      task.completedAt &&
      new Date(task.completedAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white px-6 pt-12 pb-8 rounded-b-[2rem] shadow-elegant">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <Sparkles className="h-7 w-7" />
              FlowState
            </h1>
            <p className="text-white/80 text-sm">Your ultimate productivity companion</p>
          </div>
          
          {completedToday > 0 && (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2 animate-scale-in">
              <Trophy className="h-5 w-5" />
              <div className="text-right">
                <div className="text-2xl font-bold leading-none">{completedToday}</div>
                <div className="text-xs text-white/80">today</div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Wheel */}
        <div className="flex justify-center mb-6">
          <ProgressWheel tasks={tasks} />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-6 space-y-6">
        {/* Add Task Input */}
        <div className="animate-slide-up">
          <AddTaskInput onAdd={addTask} />
        </div>

        {/* Category Filter */}
        <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            taskCounts={taskCounts}
          />
        </div>

        {/* Task List */}
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: "200ms" }}>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-primary/10 flex items-center justify-center animate-pulse-glow">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
              <p className="text-muted-foreground">
                Add your first task to get started!
              </p>
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-slide-down"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskItem
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
