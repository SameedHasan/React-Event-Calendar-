import React, { useState } from 'react';
import CalenderView from './CalenderView';
import eventsData from './eventsData'; // sample data — swap with your own

function App() {
    const [events, setEvents] = useState(eventsData);

    const handleAddEvent = (newEvent) => {
        setEvents(prev => [...prev, newEvent]);
    };

    const handleUpdateEvent = (updatedEvent) => {
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    };

    const handleDeleteEvent = (eventId) => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
    };

    return (
        <CalenderView
            events={events}
            startOfWeek="sunday"
            timeFormat="12h"
            categories={['Meeting', 'Workshop', 'Call', 'Social', 'Review', 'Planning', 'Conference']}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
        />
    );
}

export default App;