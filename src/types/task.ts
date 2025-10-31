export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: 'work' | 'personal' | 'shopping' | 'health';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  completedAt?: Date;
}

export interface TaskStats {
  total: number;
  completed: number;
  byCategory: Record<string, { total: number; completed: number }>;
}
