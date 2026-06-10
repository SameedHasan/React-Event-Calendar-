# Next.js App Router example

Shows how to use `react-event-calendar-suite` in a Next.js App Router project.

## Prerequisites

Build the library from the repo root first:

```bash
cd ../..
npm install
npm run build
```

## Run

```bash
cd examples/nextjs-app-router
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Key integration points

1. **Client component** — The calendar uses browser APIs and hooks, so it must live in a `'use client'` component (`app/CalendarClient.jsx`).

2. **CSS import** — Import the stylesheet in the client component (`app/CalendarClient.jsx`):

   ```javascript
   import 'react-event-calendar-suite/style.css';
   ```

3. **Local monorepo dev** — `next.config.mjs` aliases the package to the built `dist/` output and prefers this example's `node_modules` so React is not duplicated. Do not add global `react` webpack aliases; that breaks Next.js.

4. **Transpile** — `transpilePackages: ['react-event-calendar-suite']` lets Next.js bundle the linked ESM package.

5. **Peer dependencies** — Install `react`, `react-dom`, `dayjs`, and `zustand` alongside the calendar package.
