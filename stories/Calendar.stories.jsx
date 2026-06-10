import React, { useState } from 'react';
import Calendar from '../src/Calender.jsx';
import { sampleEvents, storyDate } from './fixtures/sampleEvents';

const VIEW_OPTIONS = ['month', 'week', 'day', 'list', 'year'];

// ---------------------------------------------------------------------------
// Meta — shared controls only, NO handlers so Default is clean by default
// ---------------------------------------------------------------------------
export default {
  title: 'Calendar',
  component: Calendar,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    events: sampleEvents,
    currentDate: storyDate,
    defaultView: 'month',
    startOfWeek: 'monday',
    timeFormat: '12h',
    primaryColor: '#1272bf',
    theme: 'light',
    loading: false,
    hideWeekends: false,
    showWeekNumbers: false,
    showToolbar: true,
  },
  argTypes: {
    defaultView: {
      control: 'select',
      options: VIEW_OPTIONS,
    },
    view: {
      control: 'select',
      options: VIEW_OPTIONS,
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
    timeFormat: {
      control: 'radio',
      options: ['12h', '24h'],
    },
    startOfWeek: {
      control: 'select',
      options: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    },
  },
};

// ---------------------------------------------------------------------------
// 1. Default — minimal read-only display
//    Just pass `events`. No add button, no export, no edit modal.
// ---------------------------------------------------------------------------
/** Minimal display calendar. Pass only `events` — no CRUD or DnD enabled. */
export const Default = {
  args: {
    readOnly: true,
  },
};

// ---------------------------------------------------------------------------
// 2. Interactive — opt-in CRUD (add / edit / delete + export)
// ---------------------------------------------------------------------------
function InteractiveDemo() {
  const [events, setEvents] = useState(sampleEvents);

  return (
    <div style={{ height: '100vh' }}>
      <Calendar
        events={events}
        defaultView="month"
        currentDate={storyDate}
        startOfWeek="monday"
        showAddEventButton
        showExportButton
        allowDateClick
        onAddEvent={(ev) => setEvents((prev) => [...prev, ev])}
        onUpdateEvent={(ev) => setEvents((prev) => prev.map((e) => (e.id === ev.id ? ev : e)))}
        onDeleteEvent={(id) => setEvents((prev) => prev.filter((e) => e.id !== id))}
      />
    </div>
  );
}

/**
 * Opt-in CRUD — enable editing by passing `onAddEvent`, `onUpdateEvent`, `onDeleteEvent`.
 * `showAddEventButton` and `showExportButton` must also be set to `true`.
 */
export const Interactive = {
  render: () => <InteractiveDemo />,
  parameters: {
    controls: { disable: true },
  },
};

// ---------------------------------------------------------------------------
// 3. All Views — explore all five views via the toolbar or the control
// ---------------------------------------------------------------------------
/** Switch between all five views with the toolbar or the `defaultView` control. */
export const AllViews = {
  args: {
    defaultView: 'week',
    readOnly: true,
  },
  argTypes: {
    defaultView: {
      control: 'select',
      options: VIEW_OPTIONS,
      description: 'Pick a view — or use the toolbar tabs to navigate.',
    },
  },
};

// ---------------------------------------------------------------------------
// 4. Controlled — parent owns `view` + `currentDate`
// ---------------------------------------------------------------------------
function ControlledDemo() {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(storyDate);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: 'calc(100vh - 32px)' }}>
      <p style={{ margin: 0, fontFamily: 'system-ui, sans-serif', fontSize: 14 }}>
        Parent state — view: <strong>{view}</strong>, date:{' '}
        <strong>{date.toLocaleDateString()}</strong>
      </p>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Calendar
          events={sampleEvents}
          view={view}
          onViewChange={setView}
          currentDate={date}
          onDateChange={setDate}
          readOnly
        />
      </div>
    </div>
  );
}

/** `currentDate` and `view` driven by parent React state. */
export const Controlled = {
  render: () => <ControlledDemo />,
  parameters: {
    controls: { disable: true },
  },
};

// ---------------------------------------------------------------------------
// 5. Read Only — explicit readOnly prop + click-to-inspect pattern
// ---------------------------------------------------------------------------
/** `readOnly={true}` disables all editing; `onEventClick` still fires. */
export const ReadOnly = {
  args: {
    readOnly: true,
    showAddEventButton: false,
    onEventClick: (event) => window.alert(`${event.title}\n${event.type}`),
  },
};

// ---------------------------------------------------------------------------
// 6. Theming — primaryColor, dark mode, CSS variables
// ---------------------------------------------------------------------------
/** `primaryColor`, `theme="dark"`, and CSS variable overrides. */
export const Theming = {
  args: {
    primaryColor: '#7c3aed',
    theme: 'dark',
    readOnly: true,
  },
  decorators: [
    (_Story) => (
      <div style={{ background: '#09090b', minHeight: '100vh' }}>
        <_Story />
      </div>
    ),
  ],
};

// ---------------------------------------------------------------------------
// 7. Custom Render — replace event chips with your own component
// ---------------------------------------------------------------------------
/** Replace default event chips with a custom `renderEvent` renderer. */
export const CustomRender = {
  args: {
    readOnly: true,
    renderEvent: (event, { view }) => (
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontWeight: 600,
          fontSize: 12,
        }}
      >
        <span aria-hidden>✦</span>
        {event.title}
        <span style={{ opacity: 0.7, fontWeight: 400 }}>
          ({event.type} · {view})
        </span>
      </span>
    ),
  },
};

// ---------------------------------------------------------------------------
// 8. Drag And Drop — opt-in via onEventDrop + onEventResize
// ---------------------------------------------------------------------------
function DragAndDropDemo() {
  const [events, setEvents] = useState(sampleEvents);
  const [view, setView] = useState('month');

  const reschedule = ({ event, start, end }) =>
    setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, start, end } : e)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: 'calc(100vh - 32px)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          fontFamily: 'system-ui, sans-serif',
          fontSize: 13,
          color: '#475569',
        }}
      >
        <span>
          <strong>Move</strong> — drag event to a new slot
        </span>
        <span>
          <strong>Extend</strong> — drag left/right edge of a bar to change its span
        </span>
        <span>
          <strong>Resize</strong> — drag bottom edge of timed event
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {['month', 'week', 'day'].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              style={{
                padding: '3px 10px',
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: view === v ? '#1272bf' : '#fff',
                color: view === v ? '#fff' : '#334155',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 12,
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Calendar
          events={events}
          view={view}
          onViewChange={setView}
          currentDate={storyDate}
          onEventDrop={reschedule}
          onEventResize={reschedule}
        />
      </div>
    </div>
  );
}

/**
 * Drag-and-drop is opt-in — pass `onEventDrop` and/or `onEventResize` to enable.
 * `disableDrag` / `disableResize` let you turn off one interaction independently.
 */
export const DragAndDrop = {
  render: () => <DragAndDropDemo />,
  parameters: {
    controls: { disable: true },
  },
};

// ---------------------------------------------------------------------------
// 9. Timezone — display events in a different IANA timezone
// ---------------------------------------------------------------------------
const TZ_OPTIONS = [
    { label: 'Local time (default)', value: '' },
    { label: 'UTC', value: 'UTC' },
    { label: 'America/New_York (ET)', value: 'America/New_York' },
    { label: 'America/Los_Angeles (PT)', value: 'America/Los_Angeles' },
    { label: 'Europe/London (GMT)', value: 'Europe/London' },
    { label: 'Europe/Berlin (CET)', value: 'Europe/Berlin' },
    { label: 'Asia/Kolkata (IST)', value: 'Asia/Kolkata' },
    { label: 'Asia/Tokyo (JST)', value: 'Asia/Tokyo' },
    { label: 'Australia/Sydney (AEST)', value: 'Australia/Sydney' },
];

function TimezoneDemo() {
    const [tz, setTz] = React.useState('America/New_York');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: 'calc(100vh - 32px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>
                <label htmlFor="tz-select" style={{ fontWeight: 600, color: '#475569' }}>
                    Timezone:
                </label>
                <select
                    id="tz-select"
                    value={tz}
                    onChange={(e) => setTz(e.target.value)}
                    style={{
                        padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0',
                        fontSize: 13, background: '#fff', cursor: 'pointer',
                    }}
                >
                    {TZ_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
                <span style={{ color: '#94a3b8', fontSize: 12 }}>
                    Event times are re-interpreted in the selected zone
                </span>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
                <Calendar
                    events={sampleEvents}
                    defaultView="week"
                    currentDate={storyDate}
                    timezone={tz || null}
                    readOnly
                />
            </div>
        </div>
    );
}

/**
 * Pass an IANA timezone string via the `timezone` prop to display all event times
 * in that zone instead of the browser's local time.
 * The toolbar shows the active zone. ICS exports include `DTSTART;TZID=...`.
 */
export const Timezone = {
    render: () => <TimezoneDemo />,
    parameters: { controls: { disable: true } },
};

// ---------------------------------------------------------------------------
// 10. Two Calendars — per-instance store isolation
// ---------------------------------------------------------------------------
function TwoCalendarsDemo() {
  const [leftDate, setLeftDate] = useState(new Date(2026, 5, 9));
  const [rightDate, setRightDate] = useState(new Date(2026, 11, 1));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        height: 'calc(100vh - 32px)',
      }}
    >
      <Calendar
        events={sampleEvents}
        defaultView="month"
        currentDate={leftDate}
        onDateChange={setLeftDate}
        primaryColor="#1272bf"
        readOnly
      />
      <Calendar
        events={[]}
        defaultView="year"
        currentDate={rightDate}
        onDateChange={setRightDate}
        primaryColor="#dc2626"
        readOnly
        renderEmpty={() => (
          <p style={{ textAlign: 'center', padding: 24, opacity: 0.7 }}>
            No events on this calendar
          </p>
        )}
      />
    </div>
  );
}

/** Two independent `<Calendar />` instances on one page — each has its own Zustand store. */
export const TwoCalendars = {
  render: () => <TwoCalendarsDemo />,
  parameters: {
    controls: { disable: true },
  },
};
