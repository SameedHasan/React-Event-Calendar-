# Installation

## npm

```bash
npm install react-event-calendar-suite
```

## Peer dependencies

Install these in your application (versions must satisfy the ranges below):

| Package | Range |
| :--- | :--- |
| `react` | `^18.0.0 \|\| ^19.0.0` |
| `react-dom` | `^18.0.0 \|\| ^19.0.0` |
| `antd` | `^5.0.0 \|\| ^6.0.0` |
| `@ant-design/icons` | `^5.0.0 \|\| ^6.0.0` |
| `dayjs` | `^1.11.0` |
| `zustand` | `^5.0.0` |

```bash
npm install react react-dom antd @ant-design/icons dayjs zustand
```

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
