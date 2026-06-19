export type Task = {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CreateTaskData = {
  title: string;
  description?: string;
  due_date?: string;
};

export type UpdateTaskData = Partial<CreateTaskData> & {
  status?: string;
};