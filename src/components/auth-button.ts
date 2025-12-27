import { BaseComponent } from '../lib/base-component';
import { auth } from '../lib/auth';
import { config } from '../lib/config';
import type { User } from '../types';

class AuthButton extends BaseComponent {
  private user: User | null = null;

  protected styleSheet = `
    :host {
      display: block;
    }

    .auth-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-name {
      font-size: 0.875rem;
      color: #333;
    }

    .sign-in-btn,
    .sign-out-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .sign-in-btn {
      background-color: #1976d2;
      color: white;
    }

    .sign-in-btn:hover {
      background-color: #1565c0;
    }

    .sign-out-btn {
      background-color: #f5f5f5;
      color: #666;
    }

    .sign-out-btn:hover {
      background-color: #e0e0e0;
    }

    .dev-mode-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: #ff9800;
      color: white;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();

    // In dev mode, skip authentication
    if (config.isDevMode) {
      this.render();
      return;
    }

    // Check current user
    this.user = await auth.getCurrentUser();
    this.render();

    // Listen to auth changes
    auth.onAuthStateChange((user) => {
      this.user = user;
      this.render();
      // Notify parent components
      this.emit('auth-change', { user });
    });
  }

  protected render(): void {
    this.shadow.innerHTML = `
      ${this.createStyles().outerHTML}
      <div class="auth-container">
        ${
          config.isDevMode
            ? `
          <div class="dev-mode-label">
            🔧 開発モード
          </div>
        `
            : this.user
            ? `
          <div class="user-info">
            ${this.user.avatarUrl ? `<img src="${this.user.avatarUrl}" alt="Avatar" class="avatar" />` : ''}
            <span class="user-name">${this.user.name || this.user.email}</span>
          </div>
          <button class="sign-out-btn">ログアウト</button>
        `
            : `
          <button class="sign-in-btn">Googleでログイン</button>
        `
        }
      </div>
    `;
  }

  protected attachEventListeners(): void {
    const signInBtn = this.shadow.querySelector('.sign-in-btn');
    const signOutBtn = this.shadow.querySelector('.sign-out-btn');

    signInBtn?.addEventListener('click', async () => {
      try {
        await auth.signInWithGoogle();
      } catch (error) {
        console.error('Sign in error:', error);
        alert('ログインに失敗しました');
      }
    });

    signOutBtn?.addEventListener('click', async () => {
      try {
        await auth.signOut();
      } catch (error) {
        console.error('Sign out error:', error);
        alert('ログアウトに失敗しました');
      }
    });
  }
}

customElements.define('auth-button', AuthButton);
