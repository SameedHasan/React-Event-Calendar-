import React, { useState } from 'react';
import Calendar from 'react-event-calendar-suite';
import 'react-event-calendar-suite/style.css';

const baseEvents = [
  {
    id: 1,
    title: 'Team Standup',
    start: new Date(2026, 5, 9, 9, 0),
    end: new Date(2026, 5, 9, 9, 30),
    type: 'Meeting',
  },
  {
    id: 2,
    title: 'Product Review',
    start: new Date(2026, 5, 10, 14, 0),
    end: new Date(2026, 5, 10, 15, 0),
    type: 'Review',
  },
  {
    id: 3,
    title: 'Design Workshop',
    start: new Date(2026, 5, 11, 10, 0),
    end: new Date(2026, 5, 13, 12, 0),
    type: 'Workshop',
    allDay: true,
  },
];

export default function App() {
  const [events, setEvents] = useState(baseEvents);

  // Calendar is minimal by default — opt-in to the features you need:
  //   showAddEventButton + onAddEvent/onUpdateEvent/onDeleteEvent → CRUD
  //   showExportButton                                            → ICS export
  //   onEventDrop + onEventResize                                → drag-and-drop

  return (
    <div style={{ height: '100vh', padding: 20, boxSizing: 'border-box' }}>
      <h1 style={{ margin: '0 0 16px', fontFamily: 'system-ui, sans-serif' }}>
        Minimal Vite example
      </h1>
      <Calendar
        events={events}
        defaultView="month"
        startOfWeek="monday"
        /* -- opt-in CRUD -- */
        showAddEventButton
        allowDateClick
        onAddEvent={(ev) => setEvents((prev) => [...prev, ev])}
        onUpdateEvent={(ev) =>
          setEvents((prev) => prev.map((e) => (e.id === ev.id ? ev : e)))
        }
        onDeleteEvent={(id) => setEvents((prev) => prev.filter((e) => e.id !== id))}
        /* -- opt-in export -- */
        showExportButton
        /* -- opt-in drag-and-drop -- */
        onEventDrop={({ event, start, end }) =>
          setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, start, end } : e)))
        }
        onEventResize={({ event, start, end }) =>
          setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, start, end } : e)))
        }
      />
    </div>
  );
}
