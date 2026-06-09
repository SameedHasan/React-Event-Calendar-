# Minimal Vite example

Smallest possible integration of `react-event-calendar-suite`.

This example bundles the calendar **from source** via a Vite alias so peer dependencies resolve correctly during local development. When you publish or install from npm, use a normal package import instead.

## Run

```bash
cd examples/minimal-vite
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

No separate library build is required for this example.

## What this demonstrates

- Installing peer dependencies (`react`, `antd`, `dayjs`, `zustand`, `@ant-design/icons`)
- Importing the calendar component and stylesheet
- Passing an `events` array with CRUD callbacks

## Production / npm usage

After installing from npm:

```javascript
import Calendar from 'react-event-calendar-suite';
import 'react-event-calendar-suite/style.css';
```

No Vite alias is needed when using the published package.
