# Migration guide: v1 → v2

v2 (`2.0.0`) adds drag-and-drop scheduling. Existing v1 integrations continue to work without changes unless you opt in to the new APIs.

## What changed in v2.0.0

### New (optional) props

| Prop | Purpose |
| :--- | :--- |
| `onEventDrop` | Fired after moving an event via drag-and-drop |
| `onEventResize` | Fired after extending or resizing an event |
| `disableDrag` | Turn off move handles while keeping resize |
| `disableResize` | Turn off resize handles while keeping move |

### New dependency (internal)

`@dnd-kit/core` is bundled with the package — consumers do not need to install it separately.

### Behavior notes

- Drag-and-drop is **off by default** until you pass `onEventDrop`, `onEventResize`, or `onUpdateEvent`.
- `readOnly` disables all drag-and-drop (same as create/edit/delete).
- `onUpdateEvent` is used as a fallback when `onEventDrop` / `onEventResize` are omitted.

## Safe to use on v1.x (unchanged)

- `import Calendar from 'react-event-calendar-suite'`
- Controlled `view` + `currentDate`
- `readOnly`, `renderEvent`, `renderToolbar`, `renderEmpty`, `loading`
- Per-instance store (multiple `<Calendar />` on one page)
- `onAddEvent`, `onUpdateEvent`, `onDeleteEvent`

## Upgrading from v1.x to v2.0

1. Update the package:

   ```bash
   npm install react-event-calendar-suite@^2.0.0
   ```

2. No code changes required if you do not use drag-and-drop.

3. To enable scheduling, wire handlers and update your events state:

   ```jsx
   <Calendar
     events={events}
     onEventDrop={({ event, start, end }) =>
       setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, start, end } : e)))
     }
     onEventResize={({ event, start, end }) =>
       setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, start, end } : e)))
     }
   />
   ```

4. Run your test suite; check TypeScript against `types/index.d.ts`.

## Planned future breaking changes (not in 2.0.0)

| Area | v1 / v2 (current) | Future |
| :--- | :--- | :--- |
| Internal file names | `Calender.jsx` (typo) | Renamed to `Calendar.jsx` |
| Peer deps | Documented ranges | May bump minimum React / antd versions |

We will document any future breaking changes in [CHANGELOG.md](../CHANGELOG.md) before they ship.
