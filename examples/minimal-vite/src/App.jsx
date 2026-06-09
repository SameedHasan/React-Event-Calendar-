import React, { useState } from 'react';
import Calendar from 'react-event-calendar-suite';
import 'react-event-calendar-suite/style.css';

const initialEvents = [
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
];

export default function App() {
  const [events, setEvents] = useState(initialEvents);

  return (
    <div style={{ height: '100vh', padding: 20, boxSizing: 'border-box' }}>
      <h1 style={{ margin: '0 0 16px', fontFamily: 'system-ui, sans-serif' }}>
        Minimal Vite example
      </h1>
      <Calendar
        events={events}
        defaultView="month"
        startOfWeek="monday"
        onAddEvent={(event) => setEvents((prev) => [...prev, event])}
        onUpdateEvent={(event) =>
          setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)))
        }
        onDeleteEvent={(id) => setEvents((prev) => prev.filter((e) => e.id !== id))}
      />
    </div>
  );
}
