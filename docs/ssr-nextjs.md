# SSR & Next.js App Router

The calendar is a **client component**. It uses browser APIs, Ant Design, and a per-instance Zustand store.

## Next.js App Router

1. Create a client wrapper (e.g. `CalendarClient.jsx`):

```jsx
'use client';

import Calendar from 'react-event-calendar-suite';
import 'react-event-calendar-suite/style.css';

export default function CalendarClient(props) {
  return <Calendar {...props} />;
}
```

2. Import the wrapper from a Server Component page:

```jsx
import CalendarClient from './CalendarClient';

export default function Page() {
  return <CalendarClient events={[]} defaultView="month" />;
}
```

3. For local monorepo development, alias the package in `next.config.mjs` and set `outputFileTracingRoot` if needed — see [examples/nextjs-app-router](../examples/nextjs-app-router).

## SSR caveats

- Do not render `<Calendar />` directly in a Server Component.
- Event `Date` objects must be created on the client or deserialized after hydration if passed from the server.
- Multiple calendars on one page are supported; each instance gets its own store via `CalendarStoreProvider`.

## Vite / CRA / Remix

No special SSR steps beyond importing the CSS and ensuring a single React instance. Use the published `dist` build from npm.
