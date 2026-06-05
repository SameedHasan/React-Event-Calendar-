# react-event-calendar-suite

A premium, highly performant, and fully customizable React Event Calendar component suite. It offers native CSS-Grid based views (Month, Week, Day, List, Year), dynamic status-color assignment, global store management, and clean navigational controls.

Ready to be dropped into any React application or published directly as a standalone npm package.

---

## ✨ Features

- 📅 **5 Interactive Views**: Standard Month, Time-Grid Week (Monday-first), Time-Grid Day, Agenda List view, and comprehensive Year overview with mini-calendars.
- 🔗 **Advanced Spanning & Overnight Support**:
  - **Month View**: Renders multi-day events as continuous horizontal solid-colored spanning bars across columns, and single-day events as transparent rows with colored dots.
  - **Week View**: Features a sticky **All-day** row showing multi-day events as continuous spanning bars aligned perfectly with the column grid.
  - **Day View**: Includes a dedicated header section for **All-day & Spanning Events**.
  - **List View**: Spans overnight and multi-day events across dates, displaying relative times (e.g. including dates on boundary days) and a custom `SPANNING` tag.
  - **Contextual Continuation Labels**: Spanning segments rendered on subsequent days automatically display a `← Cont.` (Continuation) label instead of original start times.
- 🎨 **Dynamic Color Hash Engine**: Pass any custom string category as the event `type` (e.g. `'Workshop'`, `'Review'`, `'Sync'`) and the suite automatically generates a consistent, modern HSL-based style palette (text, background, border) for it. Custom colors can also be specified per-event.
- 📐 **Pure CSS Grid & Flexbox**: Built with high performance in mind, using a fully responsive, native CSS Grid design. Synchronized layouts ensure sticky headers, all-day rows, and grid columns align perfectly under uniform scrollbar rules.
- 🚀 **Prop-Driven State Engine**: Completely data-agnostic. Manage calendar data globally by simply changing the `events` array prop. Powered internally by a lightweight Zustand store.
- 🔍 **Tooltips & Detailed Aggregates**: Auto-calculating status legends, busy metrics, real-time current time tracker lines, and clean tooltip overlays for overlapping event blocks.

---

## 📦 Installation

Install the package via npm:

```bash
npm install react-event-calendar-suite
```

Ensure you have the required peer dependencies installed:

```bash
npm install react react-dom antd dayjs zustand @ant-design/icons
```

---

## 🚀 Quick Start

Import the calendar component and pass in your array of events:

```jsx
import React from 'react';
import Calendar from 'react-event-calendar-suite';

// Sample events data
const myEvents = [
  {
    id: 1,
    title: 'Product Review',
    start: new Date(2026, 5, 5, 10, 0), // June 5, 2026 at 10:00 AM
    end: new Date(2026, 5, 5, 11, 30),   // June 5, 2026 at 11:30 AM
    type: 'Review',                      // Auto-colors this type consistently
    description: 'Weekly team sync and design critique'
  },
  {
    id: 2,
    title: 'Investor Pitch',
    start: new Date(2026, 5, 6, 14, 0),
    end: new Date(2026, 5, 6, 15, 0),
    type: 'Investor',
    color: '#e11d48',                   // Optional override with custom hex color
    description: 'Pitch deck presentation'
  }
];

function App() {
  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <Calendar 
        events={myEvents} 
        defaultView="month" 
      />
    </div>
  );
}

export default App;
```

---

## ⚙️ Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `events` | `Array` | `[]` | **Required.** Array of event objects following the schema below. |
| `defaultView` | `'month' \| 'week' \| 'day' \| 'list' \| 'year'` | `'month'` | The initial active view when the component mounts. |

---

## 📋 Event Schema

Each object in the `events` array should adhere to the following structure:

```typescript
interface CalendarEvent {
  id: string | number;        // Unique identifier for the event
  title: string;              // Name of the event displayed on calendar cards
  start: Date | string;       // Event start date-time
  end: Date | string;         // Event end date-time
  type: string;               // Category string (e.g. 'Call', 'Lunch', 'Social')
  color?: string;             // Optional hex/CSS color override (e.g. '#10b981')
  description?: string;       // Optional descriptive text shown in details/tooltips
}
```

---

## 🎨 Theme Styling & Customization

The calendar is designed with clean, premium vanilla CSS variables. You can easily adjust the theme colors by overriding these custom properties in your global stylesheet:

```css
:root {
  --primary-color: #1272bf;      /* Theme main accent color */
  --white-color: #ffffff;        /* Container backgrounds */
  --bg-color: #f8fafc;           /* Global calendar grid backdrop */
  --border-color: #e2e8f0;       /* Divider and cell borders */
  --text-primary: #1e293b;       /* Primary text */
  --text-secondary: #64748b;     /* Secondary details */
}
```

---

## 📄 License

MIT © Sameed Hasan
