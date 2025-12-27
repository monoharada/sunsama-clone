# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (uses mock data, no Supabase required)
npm run dev

# Build for production
npm run build      # Runs tsc && vite build

# Preview production build
npm run preview
```

## Development Modes

- **Dev Mode** (`VITE_DEV_MODE=true`): Uses in-memory mock data, no authentication required. Data resets on page reload.
- **Production Mode** (`VITE_DEV_MODE=false`): Connects to Supabase with real authentication and persistent storage.

## Architecture

### Tech Stack
- **Vanilla TypeScript** with Web Components (no framework)
- **htmx** for server communication patterns
- **Tailwind CSS** for styling
- **Vite** as build tool
- **Supabase** for backend (PostgreSQL, Auth, RLS)

### Web Components Pattern
All components extend `BaseComponent` (`src/lib/base-component.ts`) which provides:
- Shadow DOM encapsulation
- Lifecycle hooks: `connectedCallback`, `disconnectedCallback`
- Abstract `render()` method for HTML output
- `emit()` helper for custom events with `bubbles: true, composed: true`
- `createStyles()` for component-scoped CSS

### Component Hierarchy
```
app-shell (root container, grid layout)
├── auth-button (handles login/logout)
├── task-list (displays tasks, triggers modal)
│   └── task-card (individual task display)
└── task-modal (create/edit tasks)
```

### Data Layer
- `src/lib/database.ts` - Supabase operations (taskDb, channelDb, subtaskDb)
- `src/lib/mock-database.ts` - In-memory mock for dev mode
- `src/lib/config.ts` - Environment-based configuration switching

### Path Alias
Use `@/` to import from `src/` directory (configured in both `tsconfig.json` and `vite.config.ts`).

### Type Definitions
Core types in `src/types/index.ts`: `Task`, `SubTask`, `Channel`, `User`

## Database Schema
See `supabase/migrations/20231227000000_initial_schema.sql` for table definitions (profiles, channels, tasks, subtasks).
