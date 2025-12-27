import { BaseComponent } from '../lib/base-component';
import type { Task } from '../types';

class TaskCard extends BaseComponent {
  private task: Task | null = null;

  protected styleSheet = `
    :host {
      display: block;
      margin-bottom: 0.5rem;
    }

    .task-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      cursor: grab;
      transition: all 0.2s;
    }

    .task-card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .task-card.dragging {
      opacity: 0.5;
      cursor: grabbing;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 0.5rem;
    }

    .task-title {
      font-weight: 500;
      color: #333;
      flex: 1;
    }

    .task-channel {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .task-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #666;
      margin-top: 0.5rem;
    }

    .task-time {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .task-date {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .subtasks {
      margin-top: 0.5rem;
      padding-left: 1rem;
    }

    .subtask {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .checkbox {
      margin-right: 0.5rem;
    }
  `;

  static get observedAttributes() {
    return ['data-task'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'data-task' && newValue) {
      try {
        this.task = JSON.parse(newValue);
        this.render();
      } catch (e) {
        console.error('Invalid task data:', e);
      }
    }
  }

  protected render(): void {
    if (!this.task) {
      this.shadow.innerHTML = '';
      return;
    }

    const subtasksHtml = this.task.subtasks
      .map(
        (subtask) => `
        <div class="subtask">
          <input type="checkbox" class="checkbox" ${subtask.completed ? 'checked' : ''} />
          <span>${subtask.title}</span>
        </div>
      `
      )
      .join('');

    this.shadow.innerHTML = `
      ${this.createStyles().outerHTML}
      <div class="task-card" draggable="true">
        <div class="task-header">
          <div class="task-title">${this.task.title}</div>
          ${this.task.channel ? `<span class="task-channel">${this.task.channel}</span>` : ''}
        </div>

        ${this.task.description ? `<p style="font-size: 0.875rem; color: #666;">${this.task.description}</p>` : ''}

        <div class="task-meta">
          ${this.task.estimatedTime ? `<span class="task-time">⏱️ ${this.task.estimatedTime}分</span>` : ''}
          ${this.task.scheduledDate ? `<span class="task-date">📅 ${new Date(this.task.scheduledDate).toLocaleDateString('ja-JP')}</span>` : ''}
        </div>

        ${this.task.subtasks.length > 0 ? `<div class="subtasks">${subtasksHtml}</div>` : ''}
      </div>
    `;
  }

  protected attachEventListeners(): void {
    const card = this.shadow.querySelector('.task-card');
    if (!card) return;

    card.addEventListener('dragstart', (e) => {
      card.classList.add('dragging');
      if (e instanceof DragEvent && e.dataTransfer && this.task) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('application/json', JSON.stringify(this.task));
      }
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });
  }
}

customElements.define('task-card', TaskCard);
