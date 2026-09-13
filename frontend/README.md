# Cortex Frontend

A Next.js 15 (App Router) + TypeScript conversion of the original single-file
Cortex prototype (`cortex-app.jsx`).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. You'll land on `/login` (no session yet) —
the auth pages call `services/auth.service.ts`, which expects a real backend
at `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`, set in
`.env.local`). Point it at your Cortex API, or swap the service
implementations for mocked responses while you build the backend.

## How this maps to the original prototype

The original file was a single ~12,000-line `.jsx` component containing ten
page "bodies" (Dashboard, Tasks, Goals, Habits, Planner, Calendar, Analytics,
Notifications, AI Assistant, Settings) all switched via local React state
inside one `AppShell`. This conversion:

- **Real routing.** Each page is now its own route under `app/<feature>/page.tsx`,
  rendered inside `components/layout/PageContainer.tsx` (sidebar + header +
  animated background), instead of a JS `switch` on `activeView`.
- **Feature files kept intact.** Each feature's many internal sub-components
  (there were dozens per page — badges, cards, filters, modals, etc.) were
  kept together in one file per feature — `components/<feature>/<Feature>Sections.tsx`
  — rather than force-split into a component-per-file, since they were tightly
  coupled and page-specific in the source. Each file exports its page's `Body`
  component (e.g. `TasksBody`, `GoalsBody`).
- **Shared UI kit extracted.** `Card`, `Button`, `Input`, `Modal`, `Loader`,
  and `EmptyState` were pulled out of the repeated inline patterns (e.g. the
  Settings page's `Se_GhostButton` / `Se_DarkButton` / `Se_DangerButton`) into
  `components/ui/`, fully typed.
- **Layout extracted.** `Sidebar`, `Header` (was `Navbar`), `AnimatedDotField`,
  and `PageContainer` (was the inline shell in `AppShell`) live in
  `components/layout/`, using `next/link` + `usePathname` for active-state
  instead of the original `onNavigate` callback prop-drilling.
- **Design tokens.** The `C` color/gradient/shadow object and date-formatting
  helpers moved to `lib/utils.ts`. The original `<style>` tag full of
  keyframes/utility classes was extracted into `app/globals.css`.
- **New: auth.** The prototype had no login/register UI at all — it opened
  straight into the dashboard. `app/login` and `app/register` are new pages
  built in the same visual language, backed by `lib/auth.ts` (token storage)
  and `services/auth.service.ts`.
- **New: data layer.** The prototype used local component state seeded with
  mock arrays (`Gl_initialGoals`, `Tk_initialTasks`, `Hb_initialHabits`, etc.)
  and never called a real API. `types/`, `services/`, and `hooks/` are new,
  giving every domain a typed shape and a real `fetch`-based service ready to
  point at a backend. **The page components in `components/<feature>/` still
  use their original local `useState` + mock-data pattern** — they were not
  rewired to the new hooks, so the UI keeps working out of the box with zero
  backend. Swap a page's local state for the matching hook (`useTasks`,
  `useGoals`, `useHabits`, `useDashboard`) when you're ready to hook it up to
  real data.

## Known follow-ups

- The Settings page's "Log Out" button opens a confirmation modal but doesn't
  yet call `useAuth().logout()` — wire it up once you're testing against a
  real backend.
- `components/<feature>/<Feature>Sections.tsx` files carry a `// @ts-nocheck`
  pragma. They were ported directly from the original JSX with minimal typing
  work so the UI compiles and renders immediately; tightening their prop
  types is a good next incremental step, page by page.
- Every feature file currently imports the *entire* `lucide-react` icon set
  used anywhere in the original prototype (for safety during the split).
  Trimming each file down to the icons it actually uses will shrink your
  bundle.
