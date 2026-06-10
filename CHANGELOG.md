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
