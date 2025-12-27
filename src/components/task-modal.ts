import { BaseComponent } from '../lib/base-component';
import { taskDb } from '../lib/database';
import type { Task } from '../types';

class TaskModal extends BaseComponent {
  private isOpen = false;
  private editingTask: Task | null = null;

  protected styleSheet = `
    :host {
      display: none;
    }

    :host(.open) {
      display: block;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      width: 90%;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }

    .close-btn:hover {
      background-color: #f5f5f5;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
      font-size: 0.875rem;
    }

    input,
    textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.875rem;
      font-family: inherit;
      box-sizing: border-box;
    }

    input:focus,
    textarea:focus {
      outline: none;
      border-color: #1976d2;
    }

    textarea {
      min-height: 80px;
      resize: vertical;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel {
      background-color: #f5f5f5;
      color: #666;
    }

    .btn-cancel:hover {
      background-color: #e0e0e0;
    }

    .btn-save {
      background-color: #1976d2;
      color: white;
    }

    .btn-save:hover {
      background-color: #1565c0;
    }

    .btn-save:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `;

  public open(task?: Task) {
    this.isOpen = true;
    this.editingTask = task || null;
    this.classList.add('open');
    this.render();
  }

  public close() {
    this.isOpen = false;
    this.editingTask = null;
    this.classList.remove('open');
  }

  protected render(): void {
    if (!this.isOpen) {
      this.shadow.innerHTML = '';
      return;
    }

    const task = this.editingTask;

    this.shadow.innerHTML = `
      ${this.createStyles().outerHTML}
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">${task ? 'タスクを編集' : 'タスクを追加'}</h2>
            <button class="close-btn" aria-label="Close">&times;</button>
          </div>

          <form id="task-form">
            <div class="form-group">
              <label for="title">タイトル *</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value="${task?.title || ''}"
                placeholder="タスクのタイトルを入力"
              />
            </div>

            <div class="form-group">
              <label for="description">説明</label>
              <textarea
                id="description"
                name="description"
                placeholder="タスクの詳細を入力"
              >${task?.description || ''}</textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="estimatedTime">見込み時間（分）</label>
                <input
                  type="number"
                  id="estimatedTime"
                  name="estimatedTime"
                  min="1"
                  value="${task?.estimatedTime || ''}"
                  placeholder="60"
                />
              </div>

              <div class="form-group">
                <label for="scheduledDate">対応する日</label>
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  value="${task?.scheduledDate ? new Date(task.scheduledDate).toISOString().split('T')[0] : ''}"
                />
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-cancel">キャンセル</button>
              <button type="submit" class="btn btn-save">保存</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  protected attachEventListeners(): void {
    const overlay = this.shadow.querySelector('.modal-overlay');
    const closeBtn = this.shadow.querySelector('.close-btn');
    const cancelBtn = this.shadow.querySelector('.btn-cancel');
    const form = this.shadow.querySelector('#task-form') as HTMLFormElement;

    // Close on overlay click
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.close();
      }
    });

    // Close on close button click
    closeBtn?.addEventListener('click', () => this.close());
    cancelBtn?.addEventListener('click', () => this.close());

    // Handle form submission
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const taskData: Partial<Task> = {
        title: formData.get('title') as string,
        description: formData.get('description') as string || undefined,
        estimatedTime: formData.get('estimatedTime')
          ? parseInt(formData.get('estimatedTime') as string)
          : undefined,
        scheduledDate: formData.get('scheduledDate') as string || undefined,
      };

      try {
        const saveBtn = form.querySelector('.btn-save') as HTMLButtonElement;
        saveBtn.disabled = true;
        saveBtn.textContent = '保存中...';

        if (this.editingTask) {
          await taskDb.update(this.editingTask.id, taskData);
          this.emit('task-updated', { task: taskData });
        } else {
          const newTask = await taskDb.create(taskData);
          this.emit('task-created', { task: newTask });
        }

        this.close();
      } catch (error) {
        console.error('Failed to save task:', error);
        alert('タスクの保存に失敗しました');
      }
    });
  }
}

customElements.define('task-modal', TaskModal);
