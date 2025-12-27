import './styles/main.css';
import htmx from 'htmx.org';

// Initialize htmx
if (typeof window !== 'undefined') {
  (window as any).htmx = htmx;
}

// Import and register all Web Components
import './components/app-shell';
import './components/task-card';
import './components/task-list';

console.log('Sunsama Clone initialized');

// Initialize the app
const app = document.getElementById('app');
if (app) {
  app.innerHTML = '<app-shell></app-shell>';
}
