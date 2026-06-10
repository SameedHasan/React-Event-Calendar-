# Installation

Install the **React event calendar** package from npm:

```bash
npm install react-event-calendar-suite
```

Package: [react-event-calendar-suite on npm](https://www.npmjs.com/package/react-event-calendar-suite)

## Peer dependencies

As of **v3.0.0** the calendar is **framework-agnostic** — it no longer depends on Ant Design or any UI kit, so it drops into projects using MUI, antd, Tailwind, Bootstrap, or plain CSS. Install these in your application (versions must satisfy the ranges below):

| Package | Range |
| :--- | :--- |
| `react` | `^18.0.0 \|\| ^19.0.0` |
| `react-dom` | `^18.0.0 \|\| ^19.0.0` |
| `dayjs` | `^1.11.0` |
| `zustand` | `^5.0.0` |

```bash
npm install react react-dom dayjs zustand
```

`react-datepicker` (used by the event modal's date/time field) is a regular dependency and is installed automatically — you do not need to add it yourself.

## Styles

```js
import 'react-event-calendar-suite/style.css';
```

## TypeScript

Types ship with the package at `types/index.d.ts`. No `@types/` package is required.

## v2 drag-and-drop (optional)

Drag-and-drop is off until you pass `onEventDrop`, `onEventResize`, or `onUpdateEvent`. See [migration-v2.md](./migration-v2.md) and the README **Drag-and-drop** section.

## Examples

- [minimal-vite](../examples/minimal-vite) — smallest Vite setup
- [nextjs-app-router](../examples/nextjs-app-router) — Next.js App Router
