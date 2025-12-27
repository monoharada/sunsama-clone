import { BaseComponent } from '../lib/base-component';
import { taskDb } from '../lib/database';
import { mockTaskDb } from '../lib/mock-database';
import { auth } from '../lib/auth';
import { config } from '../lib/config';
import type { Task } from '../types';
import './task-card';
import './task-modal';

class TaskList extends BaseComponent {
  private tasks: Task[] = [];
  private isLoading = true;
  private isAuthenticated = false;

  protected styleSheet = `
    :host {
      display: block;
    }

    .task-list-container {
      max-width: 800px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .add-task-btn {
      padding: 0.5rem 1rem;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .add-task-btn:hover {
      background-color: #1565c0;
    }

    .add-task-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .tasks {
      min-height: 200px;
      padding: 1rem;
      background-color: #fafafa;
      border-radius: 8px;
      border: 2px dashed #e0e0e0;
    }

    .tasks.drag-over {
      border-color: #1976d2;
      background-color: #e3f2fd;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: #999;
    }

    .loading {
      text-align: center;
      padding: 3rem 1rem;
      color: #999;
    }

    .auth-required {
      text-align: center;
      padding: 3rem 1rem;
      color: #999;
    }

    .dev-mode-badge {
      display: inline-block;
      margin-left: 0.5rem;
      padding: 0.25rem 0.5rem;
      background-color: #ff9800;
      color: white;
      font-size: 0.75rem;
      border-radius: 4px;
      font-weight: 500;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();

    // In dev mode, skip authentication
    if (config.isDevMode) {
      this.isAuthenticated = true;
      await this.loadTasks();
      return;
    }

    // Check authentication
    const user = await auth.getCurrentUser();
    this.isAuthenticated = !!user;

    // Listen to auth changes
    auth.onAuthStateChange((user) => {
      this.isAuthenticated = !!user;
      if (user) {
        this.loadTasks();
      } else {
        this.tasks = [];
        this.render();
      }
    });

    if (this.isAuthenticated) {
      await this.loadTasks();
    } else {
      this.isLoading = false;
      this.render();
    }
  }

  private async loadTasks() {
    try {
      this.isLoading = true;
      this.render();

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      // Use mock database in dev mode
      const db = config.isDevMode ? mockTaskDb : taskDb;
      this.tasks = await db.getAll(today);

      this.isLoading = false;
      this.render();
    } catch (error) {
      console.error('Failed to load tasks:', error);
      this.isLoading = false;
      this.render();
    }
  }

  protected render(): void {
    if (this.isLoading) {
      this.shadow.innerHTML = `
        ${this.createStyles().outerHTML}
        <div class="task-list-container">
          <div class="loading">読み込み中...</div>
        </div>
      `;
      return;
    }

    if (!this.isAuthenticated) {
      this.shadow.innerHTML = `
        ${this.createStyles().outerHTML}
        <div class="task-list-container">
          <div class="auth-required">
            タスクを表示するにはログインしてください
          </div>
        </div>
      `;
      return;
    }

    const tasksHtml = this.tasks
      .map(
        (task) => `
        <task-card data-task='${JSON.stringify(task).replace(/'/g, '&apos;')}'></task-card>
      `
      )
      .join('');

    this.shadow.innerHTML = `
      ${this.createStyles().outerHTML}
      <div class="task-list-container">
        <div class="header">
          <h2>
            今日のタスク
            ${config.isDevMode ? '<span class="dev-mode-badge">DEV MODE</span>' : ''}
          </h2>
          <button class="add-task-btn">+ タスクを追加</button>
        </div>

        <div class="tasks" id="task-drop-zone">
          ${
            this.tasks.length > 0
              ? tasksHtml
              : '<div class="empty-state">タスクがありません。新しいタスクを追加しましょう。</div>'
          }
        </div>
      </div>
      <task-modal></task-modal>
    `;
  }

  protected attachEventListeners(): void {
    const dropZone = this.shadow.getElementById('task-drop-zone');
    if (dropZone) {
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });

      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');

        if (e instanceof DragEvent && e.dataTransfer) {
          const data = e.dataTransfer.getData('application/json');
          if (data) {
            const task = JSON.parse(data);
            console.log('Task dropped:', task);
            // ここでタスクの並び替えやカレンダーへの追加を処理
          }
        }
      });
    }

    const addButton = this.shadow.querySelector('.add-task-btn');
    addButton?.addEventListener('click', () => {
      const modal = this.shadow.querySelector('task-modal') as any;
      if (modal) {
        modal.open();
      }
    });

    // Listen to task modal events
    const modal = this.shadow.querySelector('task-modal');
    modal?.addEventListener('task-created', () => {
      this.loadTasks();
    });

    modal?.addEventListener('task-updated', () => {
      this.loadTasks();
    });
  }
}

customElements.define('task-list', TaskList);
