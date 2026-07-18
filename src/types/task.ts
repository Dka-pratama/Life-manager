export type Task = {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CreateTaskData = {
  title: string;
  description?: string;
  due_date?: string;
  category?: string;
  priority?: string;
};

export type UpdateTaskData = Partial<CreateTaskData> & {
  status?: string;
};
