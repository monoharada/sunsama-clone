export interface Task {
  id: string;
  title: string;
  description?: string;
  channel?: string;
  estimatedTime?: number; // in minutes
  scheduledDate?: string; // ISO date string
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  subtasks: SubTask[];
  googleCalendarEventId?: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  taskId: string;
}

export interface Channel {
  id: string;
  name: string;
  color: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}
