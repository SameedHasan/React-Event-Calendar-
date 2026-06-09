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

[1.3.0]: https://github.com/SameedHasan/React-Event-Calendar-/compare/v1.1.8...v1.3.0
[1.1.8]: https://github.com/SameedHasan/React-Event-Calendar-/compare/v1.1.7...v1.1.8
