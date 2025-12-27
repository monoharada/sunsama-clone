import { BaseComponent } from '../lib/base-component';
import './auth-button';

class AppShell extends BaseComponent {
  protected styleSheet = `
    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }

    .app-container {
      display: grid;
      grid-template-columns: 250px 1fr;
      grid-template-rows: 60px 1fr;
      height: 100vh;
      background-color: #f5f5f5;
    }

    .header {
      grid-column: 1 / -1;
      background-color: #ffffff;
      border-bottom: 1px solid #e0e0e0;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sidebar {
      background-color: #ffffff;
      border-right: 1px solid #e0e0e0;
      padding: 1rem;
    }

    .main-content {
      padding: 1.5rem;
      overflow-y: auto;
    }

    h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .app-container {
        grid-template-columns: 1fr;
      }

      .sidebar {
        display: none;
      }
    }
  `;

  protected render(): void {
    this.shadow.innerHTML = `
      ${this.createStyles().outerHTML}
      <div class="app-container">
        <header class="header">
          <h1>Sunsama Clone</h1>
          <auth-button></auth-button>
        </header>

        <aside class="sidebar">
          <h2 style="font-size: 1rem; margin-bottom: 1rem;">チャンネル</h2>
          <div id="channels">
            <!-- Channels will be loaded here -->
          </div>
        </aside>

        <main class="main-content">
          <task-list></task-list>
        </main>
      </div>
    `;
  }
}

customElements.define('app-shell', AppShell);
