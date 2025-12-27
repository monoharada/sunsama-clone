import type { Task, SubTask, Channel } from '../types';

/**
 * Mock database for development mode
 * Stores data in memory (resets on page reload)
 */

let mockTasks: Task[] = [
  {
    id: '1',
    title: 'プロジェクト計画書を作成',
    description: 'Q1のプロジェクト計画書をまとめる',
    channel: '仕事',
    estimatedTime: 60,
    scheduledDate: new Date().toISOString().split('T')[0],
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'mock-user',
    subtasks: [
      { id: 's1', title: '目標設定', completed: true, taskId: '1' },
      { id: 's2', title: 'リソース確認', completed: false, taskId: '1' },
    ],
  },
  {
    id: '2',
    title: 'チームミーティング準備',
    description: '週次ミーティングのアジェンダを準備',
    channel: '会議',
    estimatedTime: 30,
    scheduledDate: new Date().toISOString().split('T')[0],
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'mock-user',
    subtasks: [],
  },
  {
    id: '3',
    title: 'コードレビュー',
    description: 'PR #123 のレビューを行う',
    channel: '開発',
    estimatedTime: 45,
    scheduledDate: new Date().toISOString().split('T')[0],
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: 'mock-user',
    subtasks: [
      { id: 's3', title: 'コードを確認', completed: false, taskId: '3' },
      { id: 's4', title: 'フィードバックを記入', completed: false, taskId: '3' },
    ],
  },
];

let taskIdCounter = 4;
let subtaskIdCounter = 5;

/**
 * Mock database operations for tasks
 */
export const mockTaskDb = {
  /**
   * Get all tasks for the current user
   */
  async getAll(scheduledDate?: string): Promise<Task[]> {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay

    if (scheduledDate) {
      return mockTasks.filter((task) => task.scheduledDate === scheduledDate);
    }
    return mockTasks;
  },

  /**
   * Create a new task
   */
  async create(task: Partial<Task>): Promise<Task> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newTask: Task = {
      id: String(taskIdCounter++),
      title: task.title || '',
      description: task.description,
      channel: task.channel,
      estimatedTime: task.estimatedTime,
      scheduledDate: task.scheduledDate,
      completed: task.completed || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'mock-user',
      subtasks: [],
    };

    mockTasks.push(newTask);
    return newTask;
  },

  /**
   * Update a task
   */
  async update(id: string, updates: Partial<Task>): Promise<Task> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const taskIndex = mockTasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return mockTasks[taskIndex];
  },

  /**
   * Delete a task
   */
  async delete(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    mockTasks = mockTasks.filter((t) => t.id !== id);
  },
};

/**
 * Mock database operations for channels
 */
export const mockChannelDb = {
  async getAll(): Promise<Channel[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return [
      { id: '1', name: '仕事', color: '#1976d2', userId: 'mock-user' },
      { id: '2', name: '会議', color: '#f57c00', userId: 'mock-user' },
      { id: '3', name: '開発', color: '#388e3c', userId: 'mock-user' },
    ];
  },

  async create(channel: Partial<Channel>): Promise<Channel> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      id: String(Math.random()),
      name: channel.name || '',
      color: channel.color || '#1976d2',
      userId: 'mock-user',
    };
  },
};

/**
 * Mock database operations for subtasks
 */
export const mockSubtaskDb = {
  async create(taskId: string, title: string): Promise<SubTask> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newSubtask: SubTask = {
      id: String(subtaskIdCounter++),
      title,
      completed: false,
      taskId,
    };

    const task = mockTasks.find((t) => t.id === taskId);
    if (task) {
      task.subtasks.push(newSubtask);
    }

    return newSubtask;
  },

  async toggleComplete(id: string, completed: boolean): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    for (const task of mockTasks) {
      const subtask = task.subtasks.find((st) => st.id === id);
      if (subtask) {
        subtask.completed = completed;
        return;
      }
    }
  },
};
