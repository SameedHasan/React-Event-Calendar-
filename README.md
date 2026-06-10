# react-event-calendar-suite

[![CI](https://github.com/SameedHasan/React-Event-Calendar-/actions/workflows/ci.yml/badge.svg)](https://github.com/SameedHasan/React-Event-Calendar-/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-utils%20%E2%89%A590%25-brightgreen)](vitest.config.js)

A premium, highly performant, and fully customizable React Event Calendar component suite. It offers native CSS-Grid based views (Month, Week, Day, List, Year), dynamic status-color assignment, global store management, and clean navigational controls.

Ready to be dropped into any React application or published directly as a standalone npm package.

See [CHANGELOG.md](./CHANGELOG.md) for release history and versioning policy.

![React Event Calendar Suite Screenshot](https://raw.githubusercontent.com/SameedHasan/React-Event-Calendar-/main/public/image.png)

---

## 📁 Examples

| Example | Description |
| :--- | :--- |
| [examples/minimal-vite](./examples/minimal-vite) | Smallest Vite + React setup |
| [examples/nextjs-app-router](./examples/nextjs-app-router) | Next.js App Router with `"use client"` |

The Vite example bundles from source (no pre-build needed). For npm installs, use `import Calendar from 'react-event-calendar-suite'` directly.

---

## ✨ Features

- 📅 **5 Interactive Views**: Standard Month, Time-Grid Week, Time-Grid Day, Agenda List view, and comprehensive Year overview with mini-calendars.
- ⚙️ **Localization & Format Settings**: Fully configurable week start day (any day of the week, e.g., `'monday'`, `'sunday'`, `'wednesday'`, etc.) and time format (`'12h'` or `'24h'`) passed directly as props. All grid columns, boundary offsets, hour gutters, time-indicator lines, overnight range formats, and tooltips automatically sync dynamically to these selections.
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
- ⌨️ **Keyboard Shortcuts**: Built-in keyboard navigation for fast, mouse-free control — switch views, navigate periods, and jump to today instantly.
- 📤 **iCal / ICS Export**: Export calendar events directly to standard iCalendar (`.ics`) format, ready to be imported into Google Calendar, Apple Calendar, or Outlook.

---

## ⌨️ Keyboard Shortcuts

The calendar includes built-in keyboard shortcuts for efficient navigation. Shortcuts are automatically disabled when focus is inside an input, textarea, or editable element.

| Key | Action |
| :--- | :--- |
| `T` | Jump to today |
| `M` | Switch to Month view |
| `W` | Switch to Week view |
| `D` | Switch to Day view |
| `L` | Switch to List view |
| `Y` | Switch to Year view |
| `←` | Navigate to previous period (month/week/day depending on current view) |
| `→` | Navigate to next period |

---

## 📤 Exporting to iCalendar (iCal / ICS)

The calendar includes built-in support for exporting events to standard RFC 5545 `.ics` format.

- **Header Toolbar Button:** A pre-styled, responsive **Export** button is rendered on the right side of the header. Clicking it downloads the active calendar events.
- **Standalone Export API:** You can also import the utility helpers directly into your app to build custom export flows:

```javascript
import { exportEventsToICS } from 'react-event-calendar-suite/utils/icsExport';

// Trigger download of .ics file
exportEventsToICS(events, {
  calendarName: 'React Event Calendar Suite',
  filename: 'calendar-events.ics'
});
```

---

## 📦 Installation

Install the package via npm:

```bash
npm install react-event-calendar-suite
```

Ensure you have the required peer dependencies installed (`antd` and `@ant-design/icons` v5 or v6):

```bash
npm install react react-dom antd dayjs zustand @ant-design/icons
```

---

## 🚀 Quick Start

Import the calendar component and pass in your array of events:

```jsx
import React from 'react';
import Calendar from 'react-event-calendar-suite';
import 'react-event-calendar-suite/style.css';

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
  const [events, setEvents] = React.useState(myEvents);

  const handleAdd = (newEvent) => setEvents(prev => [...prev, newEvent]);
  const handleUpdate = (updatedEvent) => setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  const handleDelete = (eventId) => setEvents(prev => prev.filter(e => e.id !== eventId));

  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <Calendar 
        events={events} 
        defaultView="month" 
        startOfWeek="sunday" 
        timeFormat="12h" 
        onAddEvent={handleAdd}
        onUpdateEvent={handleUpdate}
        onDeleteEvent={handleDelete}
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
| `defaultView` | `'month' \| 'week' \| 'day' \| 'list' \| 'year'` | `'month'` | The initial active view when the component mounts (uncontrolled mode only). |
| `view` | `'month' \| 'week' \| 'day' \| 'list' \| 'year'` | `undefined` | Optional. Controlled active view. Pair with `onViewChange`. |
| `readOnly` | `boolean` | `false` | Optional. Disables create, edit, delete, and day-click actions. `onEventClick` still fires. |
| `startOfWeek` | `'sunday' \| 'monday' \| 'tuesday' \| 'wednesday' \| 'thursday' \| 'friday' \| 'saturday'` | `'monday'` | Configures which weekday the calendar views, headers, and column grids start on (supports any of the 7 weekdays). |
| `timeFormat` | `'12h' \| '24h'` | `'12h'` | Configures whether hour labels, event cards, overnight ranges, and current-time indicators use a 12-hour (AM/PM) or 24-hour display. |
| `categories` | `string[]` | `['Meeting', ...]` | Optional. List of event categories/types available for creating or editing events. |
| `primaryColor` | `string` | `'#1272bf'` | Optional. Configures the primary theme color dynamically across all views and components (including internal Ant Design components). |
| `currentDate` | `Date \| string` | `undefined` | Optional. Controls the calendar's currently focused date from the parent. |
| `onDateChange` | `(date: Date) => void` | `undefined` | Optional. Fires when the active calendar date/range changes. |
| `onViewChange` | `(view: string) => void` | `undefined` | Optional. Fires when the active calendar view switches. |
| `hideWeekends` | `boolean` | `false` | Optional. Hides Saturday and Sunday columns in Month, Week, and List views. |
| `showWeekNumbers` | `boolean` | `false` | Optional. Shows the week number column on Month and Week views. |
| `showToolbar` | `boolean` | `true` | Optional. Renders the main header navigation toolbar. |
| `showExportButton` | `boolean` | `true` | Optional. Renders the toolbar "Export" iCal button. |
| `showAddEventButton` | `boolean` | `true` | Optional. Renders the toolbar "+ Add Event" button. |
| `allowDateClick` | `boolean` | `true` | Optional. Enables/disables the click-to-add event action on empty day slots. |
| `eventColors` | `object` | `{}` | Optional. Custom color overrides per category (e.g. `{ Meeting: '#ef4444' }`). |
| `theme` | `'light' \| 'dark'` | `'light'` | Optional. Applies light or premium dark styles to the calendar. |
| `onEventClick` | `(event: CalendarEvent) => void \| boolean` | `undefined` | Optional. Intercepts event clicks. Return `false` to block the default edit modal. |
| `onDateClick` | `(date: Date) => void \| boolean` | `undefined` | Optional. Intercepts empty cell clicks. Return `false` to block the default creation modal. |
| `onAddEvent` | `(event: CalendarEvent) => void` | `undefined` | Optional. Callback triggered when a new event is created. If not provided, updates local state automatically. |
| `onUpdateEvent` | `(event: CalendarEvent) => void` | `undefined` | Optional. Callback triggered when an existing event is edited. If not provided, updates local state automatically. |
| `onDeleteEvent` | `(id: string \| number) => void` | `undefined` | Optional. Callback triggered when an event is deleted. If not provided, updates local state automatically. |
| `className` | `string` | `undefined` | Optional. Additional CSS class names for the calendar root element. |
| `style` | `React.CSSProperties` | `undefined` | Optional. Inline styles for the calendar root element. The root uses `height: 100%`, so wrap it in a sized container. |

---

## 🎨 Styles

The calendar ships with a separate stylesheet. Import it once in your app entry or page:

```javascript
import 'react-event-calendar-suite/style.css';
// or
import 'react-event-calendar-suite/dist/react-event-calendar-suite.css';
```

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
  allDay?: boolean;           // Optional. Renders in the all-day / spanning row
}
```

---

## 🎨 Theme Styling & Customization

The calendar is designed with clean, premium vanilla CSS variables and supports both prop-driven and style-driven overrides.

### Dynamic Theme Customization (Prop)
You can customize the accent color of the calendar dynamically by passing the `primaryColor` prop. This will style all buttons, select boxes, calendars, indicators, active highlights, and hover states to match:

```jsx
<Calendar 
  events={events}
  primaryColor="#e11d48" // A vibrant ruby red theme!
/>
```

### CSS Overrides
Alternatively, you can adjust theme colors globally by overriding these custom properties in your global stylesheet:

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

## 🧪 Testing

```bash
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage # coverage report (utils ≥ 90%)
npm run ci            # build + lint + test
```

---

## 📄 License

MIT © Sameed Hasan
