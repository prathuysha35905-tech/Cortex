Cortex

Cortex is an AI-powered productivity workspace designed to help users plan, organize, track, and improve their daily work and personal goals from a single platform.

Core Features
Dashboard — Central overview of tasks, goals, habits, progress, and productivity.
AI Assistant — An intelligent workspace assistant that answers user questions, provides guidance, explains Cortex features, and helps users navigate between pages through natural-language commands.
Smart Planner — AI-assisted planning that helps organize tasks and create actionable plans.
Tasks — Create, update, complete, archive, search, and filter tasks with priorities, categories, deadlines, and recurring tasks.
Goals — Set goals, track progress, manage milestones, and monitor completion.
Habits — Create and track habits, maintain streaks, and analyze habit completion.
Calendar — Manage schedules and integrate calendar events.
Analytics — Analyze productivity, task completion, goal progress, habit performance, and overall trends.
Notifications — Manage productivity-related notifications and reminders.
Insights & Recommendations — AI-generated insights and recommendations based on user activity.
Memory — Maintains relevant user context to provide more personalized AI assistance.
Google Calendar Integration — Connect and synchronize calendar data.
Authentication — User registration, login, JWT-based authentication, and protected resources.



















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

