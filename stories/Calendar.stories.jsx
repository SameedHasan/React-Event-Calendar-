import React, { useState } from 'react';
import { fn } from 'storybook/test';
import Calendar from '../src/Calender.jsx';
import { sampleEvents, storyDate } from './fixtures/sampleEvents';

const VIEW_OPTIONS = ['month', 'week', 'day', 'list', 'year'];

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
    showToolbar: true,
    showExportButton: true,
    showAddEventButton: true,
    allowDateClick: true,
    readOnly: false,
    loading: false,
    hideWeekends: false,
    showWeekNumbers: false,
    onEventClick: fn(),
    onDateClick: fn(),
    onAddEvent: fn(),
    onUpdateEvent: fn(),
    onDeleteEvent: fn(),
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

/** Basic month view with sample events. */
export const Default = {};

/** Switch views via the toolbar or the `defaultView` control. */
export const AllViews = {
  args: {
    defaultView: 'week',
  },
  argTypes: {
    defaultView: {
      control: 'select',
      options: VIEW_OPTIONS,
      description: 'Initial view — use toolbar tabs to explore all five views.',
    },
  },
};

function ControlledCalendarDemo() {
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
        />
      </div>
    </div>
  );
}

/** `currentDate` and `view` driven by parent React state. */
export const Controlled = {
  render: () => <ControlledCalendarDemo />,
  parameters: {
    controls: { disable: true },
  },
};

/** Read-only mode: editing disabled; `onEventClick` still fires. */
export const ReadOnly = {
  args: {
    readOnly: true,
    showAddEventButton: false,
    onEventClick: fn((event) => {
      window.alert(`Clicked: ${event.title}`);
    }),
  },
};

/** `primaryColor`, `theme`, and CSS variable overrides. */
export const Theming = {
  args: {
    primaryColor: '#7c3aed',
    theme: 'dark',
    style: {
      '--calendar-border-color': '#3f3f46',
      '--calendar-surface': '#18181b',
    },
  },
  decorators: [
    (_Story) => (
      <div style={{ '--calendar-story-bg': '#09090b' }}>
        <_Story />
      </div>
    ),
  ],
};

/** Replace default event chips with a custom renderer. */
export const CustomRender = {
  args: {
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
      />
      <Calendar
        events={[]}
        defaultView="year"
        currentDate={rightDate}
        onDateChange={setRightDate}
        primaryColor="#dc2626"
        renderEmpty={() => (
          <p style={{ textAlign: 'center', padding: 24, opacity: 0.7 }}>
            No events on this calendar instance
          </p>
        )}
      />
    </div>
  );
}

/** Two instances on one page — each has its own Zustand store (Phase 1). */
export const TwoCalendars = {
  render: () => <TwoCalendarsDemo />,
  parameters: {
    controls: { disable: true },
  },
};
