# Changelog

All notable changes to `react-event-calendar-suite` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Version policy

| Bump | When to use | Examples |
|------|-------------|----------|
| **Patch** | Bug fixes, docs, internal refactors with no API change | Fix week number display, README typo |
| **Minor** | New backward-compatible features or props | `readOnly` prop, `renderEvent` slot |
| **Major** | Breaking API changes, removed props, peer dependency range changes | Rename exports, change default behavior |

## [2.2.0] - 2026-06-10

### Added

- **`timezone` prop** — pass any IANA timezone string (e.g. `'America/New_York'`, `'Asia/Tokyo'`) to display all event times in that zone instead of the browser locale. Affects all five views, the event modal pre-fill, and the "today" indicator.
- ICS export (`showExportButton`) now emits `DTSTART;TZID=...` when `timezone` is set, producing standards-compliant zoned calendar files.
- Toolbar sub-label shows the active timezone when `timezone` is provided.
- New **Timezone** Storybook story with an interactive zone picker.

### Changed

- `dayjs/plugin/timezone` is now a bundled dependency (extends the existing `dayjs/plugin/utc` usage).

---

## [2.1.0] - 2026-06-10

### Changed

- `showExportButton` default changed from `true` to `false` — export is now opt-in (`showExportButton={true}`)
- Storybook stories reorganised: **Default** is now a minimal read-only display; new **Interactive** story demonstrates full CRUD opt-in

### Philosophy

The calendar is now a display component by default. Every interactive feature (CRUD, export, drag-and-drop, date-click) requires an explicit opt-in prop or handler.

---

## [2.0.0] - 2026-06-10

### Added

- Drag-and-drop event reschedule in **week** and **day** views (`@dnd-kit/core`)
- `onEventDrop({ event, start, end })` — fired after dragging a timed event (15-minute snap)
- `onEventResize({ event, start, end })` — fired after resizing the bottom edge
- Week view supports dropping events onto adjacent day columns
- Month view supports dragging events onto another day cell (whole-day shift)
- Month & week all-day bars: **both-edge** resize — drag the right edge to change the end day or the left edge to change the start day (extend to earlier or later dates)
- `disableDrag` prop — turn off event moving while keeping resize/other handlers active
- `disableResize` prop — turn off event extending/resizing while keeping move/other handlers active
- Storybook **Drag And Drop** story

### Changed

- Timed events show a resize handle when drop/resize handlers (or `onUpdateEvent`) are configured
- Span resize now live-previews by stretching the bar from the anchored edge (with a highlighted outline) so it reads as "extending" instead of moving

### Notes

- Drag-and-drop is disabled when `readOnly` is `true`
- If `onEventDrop` / `onEventResize` are omitted, `onUpdateEvent` is used as a fallback

## [1.7.0] - 2026-06-10

### Added

- Storybook 9 with interactive demos: Default, All Views, Controlled, Read Only, Theming, Custom Render, Two Calendars
- `npm run storybook` and `npm run build-storybook` scripts
- GitHub Actions workflow to publish Storybook to GitHub Pages
- `docs/` guides: installation, SSR/Next.js, planned v2 migration

### Changed

- CI now verifies Storybook builds successfully

### Fixed

- Infinite update loop when using controlled `currentDate` with `onDateChange` (prop sync no longer notifies parent; duplicate dates are skipped)

## [1.6.0] - 2026-06-10

### Added

- Toolbar ARIA: `role="toolbar"`, labeled nav buttons, `role="tablist"` view switcher
- Month/week grids: `role="grid"`, `aria-selected` on today, event `aria-label`s
- Roving keyboard focus on month-view event chips (arrow keys, Home/End)
- Polite `aria-live` region for view/date announcements
- `?` keyboard shortcuts help modal
- README Accessibility section

### Changed

- Default event type palette uses darker accent hues for improved contrast on light backgrounds

## [1.5.0] - 2026-06-10

### Added

- `renderEvent` — custom event chip/card renderer (month, week, day, list views)
- `renderEventTooltip` — custom month-view overflow tooltip
- `renderToolbar` — replace default header with custom navigation UI
- `renderEmpty` — custom empty state for list and year views
- `loading` prop — spinner overlay while async events load
- `metadata` field on `CalendarEvent` type
- `CalendarToolbarApi` and `EventRenderContext` TypeScript types

## [1.4.0] - 2026-06-10

### Added

- Full test suite: `vitest` + `@testing-library/react` + `jsdom`
- Unit tests for `dateHelpers`, `icsExport`, `eventColors`, keyboard shortcuts, store, and `<Calendar>`
- `npm run test:coverage` with ≥90% threshold on `src/utils/*`

### Fixed

- Month/year navigation now preserves the day-of-month (e.g. June 15 → May 15)

## [1.3.1] - 2026-06-10

### Changed

- Peer dependencies now accept `antd` and `@ant-design/icons` v5 **or** v6

## [1.3.0] - 2026-06-09

### Added

- Per-instance calendar store via React Context (multiple `<Calendar>` components are isolated)
- Controlled `view` prop (pair with `onViewChange`)
- `readOnly` prop to disable create/edit/delete while keeping `onEventClick`
- `allDay` field on event schema
- `className` and `style` props on calendar root

### Fixed

- `EventModal` date picker now respects `timeFormat` (`12h` / `24h`)
- Week numbers standardized on `dayjs` ISO week across all views
- All-day detection: explicit `allDay`, cross-midnight events, or 24h+ duration
- `getEventStyle` no longer depends on a global store singleton

## [1.1.8] - 2026-06-09

### Added

- TypeScript declarations (`types/`)
- MIT `LICENSE` file
- `exports` map for main entry, `style.css`, and `./utils/icsExport`
- `sideEffects` for CSS bundling

### Fixed

- Moved `react`, `antd`, `dayjs`, etc. to `peerDependencies` (avoids duplicate React)
- Removed unused `@reduxjs/toolkit` and `react-redux` dependencies
- README documents required CSS import
- Standalone `icsExport` build output (`dist/utils/icsExport.js`)
- Published `dist/` no longer includes stray `vite.svg`

### Changed

- Calendar root uses `height: 100%` instead of hardcoded viewport calc

## [1.1.7] - Previous release

- Initial published feature set: 5 views, keyboard shortcuts, ICS export, theming

[1.6.0]: https://github.com/SameedHasan/React-Event-Calendar/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/SameedHasan/React-Event-Calendar/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/SameedHasan/React-Event-Calendar/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/SameedHasan/React-Event-Calendar/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/SameedHasan/React-Event-Calendar/compare/v1.1.8...v1.3.0
[1.1.8]: https://github.com/SameedHasan/React-Event-Calendar/compare/v1.1.7...v1.1.8
