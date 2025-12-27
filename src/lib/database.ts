import { getSupabase } from './supabase';
import type { Task, SubTask, Channel } from '../types';

/**
 * Database operations for tasks.
 * These functions require Supabase to be configured and will throw in dev mode.
 * Components should use mockTaskDb in dev mode instead.
 */
export const taskDb = {
  /**
   * Get all tasks for the current user
   */
  async getAll(scheduledDate?: string): Promise<Task[]> {
    const supabase = getSupabase();
    let query = supabase
      .from('tasks')
      .select(`
        *,
        subtasks(*),
        channels(*)
      `)
      .order('position', { ascending: true });

    if (scheduledDate) {
      query = query.eq('scheduled_date', scheduledDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      channel: task.channels?.name,
      estimatedTime: task.estimated_time,
      scheduledDate: task.scheduled_date,
      completed: task.completed,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      userId: task.user_id,
      subtasks: task.subtasks.map((st: any) => ({
        id: st.id,
        title: st.title,
        completed: st.completed,
        taskId: st.task_id,
      })),
      googleCalendarEventId: task.google_calendar_event_id,
    }));
  },

  /**
   * Create a new task
   */
  async create(task: Partial<Task>): Promise<Task> {
    const supabase = getSupabase();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userData.user.id,
        title: task.title,
        description: task.description,
        estimated_time: task.estimatedTime,
        scheduled_date: task.scheduledDate,
        completed: task.completed || false,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      estimatedTime: data.estimated_time,
      scheduledDate: data.scheduled_date,
      completed: data.completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.user_id,
      subtasks: [],
    };
  },

  /**
   * Update a task
   */
  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: updates.title,
        description: updates.description,
        estimated_time: updates.estimatedTime,
        scheduled_date: updates.scheduledDate,
        completed: updates.completed,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      estimatedTime: data.estimated_time,
      scheduledDate: data.scheduled_date,
      completed: data.completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.user_id,
      subtasks: [],
    };
  },

  /**
   * Delete a task
   */
  async delete(id: string): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) throw error;
  },
};

/**
 * Database operations for channels.
 * These functions require Supabase to be configured and will throw in dev mode.
 * Components should use mockChannelDb in dev mode instead.
 */
export const channelDb = {
  /**
   * Get all channels for the current user
   */
  async getAll(): Promise<Channel[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return data.map((channel: any) => ({
      id: channel.id,
      name: channel.name,
      color: channel.color,
      userId: channel.user_id,
    }));
  },

  /**
   * Create a new channel
   */
  async create(channel: Partial<Channel>): Promise<Channel> {
    const supabase = getSupabase();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('channels')
      .insert({
        user_id: userData.user.id,
        name: channel.name,
        color: channel.color || '#1976d2',
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      color: data.color,
      userId: data.user_id,
    };
  },
};

/**
 * Database operations for subtasks.
 * These functions require Supabase to be configured and will throw in dev mode.
 * Components should use mockSubtaskDb in dev mode instead.
 */
export const subtaskDb = {
  /**
   * Create a new subtask
   */
  async create(taskId: string, title: string): Promise<SubTask> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('subtasks')
      .insert({
        task_id: taskId,
        title,
        completed: false,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      completed: data.completed,
      taskId: data.task_id,
    };
  },

  /**
   * Toggle subtask completion
   */
  async toggleComplete(id: string, completed: boolean): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('subtasks')
      .update({ completed })
      .eq('id', id);

    if (error) throw error;
  },
};
