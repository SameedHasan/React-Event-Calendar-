# Migration guide: v1 → v2 (planned)

v2 is not released yet. This document lists expected breaking changes so you can plan ahead.

## Planned breaking changes

| Area | v1 (current) | v2 (planned) |
| :--- | :--- | :--- |
| Internal file names | `Calender.jsx` (typo) | Renamed to `Calendar.jsx` |
| Default export | `Calendar` (already public name) | Unchanged public export name |
| Peer deps | Documented ranges | May bump minimum React / antd versions |

## Safe to use today (v1.x)

- `import Calendar from 'react-event-calendar-suite'`
- Controlled `view` + `currentDate`
- `readOnly`, `renderEvent`, `renderToolbar`, `renderEmpty`, `loading`
- Per-instance store (multiple `<Calendar />` on one page)

## Before upgrading to v2

1. Pin `react-event-calendar-suite` to `^1.7.0` until you are ready to migrate.
2. Search your codebase for deep imports into package internals — only documented exports are supported.
3. Run your test suite after upgrading; check TypeScript errors against `types/index.d.ts`.

We will publish a full v2 CHANGELOG entry when the release ships.
