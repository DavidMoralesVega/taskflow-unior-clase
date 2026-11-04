export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

// What the form sends to the API (POST and PATCH).
export interface TaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
