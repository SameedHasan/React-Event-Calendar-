import React, { useState } from 'react';
import CalenderView from './CalenderView';
import eventsData from './eventsData'; // sample data — swap with your own
import { Card, Switch, Select, message } from 'antd';

function App() {
    const [events, setEvents] = useState(eventsData);
    const [theme, setTheme] = useState('light');
    const [hideWeekends, setHideWeekends] = useState(false);
    const [showWeekNumbers, setShowWeekNumbers] = useState(true);
    const [customColorsEnabled, setCustomColorsEnabled] = useState(true);
    const [showExportButton, setShowExportButton] = useState(true);
    const [showAddEventButton, setShowAddEventButton] = useState(true);
    const [allowDateClick, setAllowDateClick] = useState(true);

    const handleAddEvent = (newEvent) => {
        setEvents(prev => [...prev, newEvent]);
        message.success('Event added successfully!');
    };

    const handleUpdateEvent = (updatedEvent) => {
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        message.success('Event updated successfully!');
    };

    const handleDeleteEvent = (eventId) => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        message.success('Event deleted successfully!');
    };

    // Custom color map definition
    const eventColorsMap = customColorsEnabled ? {
        Meeting: '#ef4444', // Red
        Workshop: '#8b5cf6', // Violet
        Call: '#06b6d4', // Cyan
        Social: '#ec4899', // Pink
    } : {};

    return (
        <div style={{
            minHeight: '100vh',
            background: theme === 'dark' ? '#0f172a' : '#f8fafc',
            color: theme === 'dark' ? '#f8fafc' : '#1e293b',
            fontFamily: 'Outfit, Inter, sans-serif',
            transition: 'background 0.25s ease, color 0.25s ease',
            padding: '16px'
        }}>
            {/* Package Capabilities Controller */}
            <Card 
                title={<span style={{ color: theme === 'dark' ? '#fff' : '#1e293b', fontWeight: 700 }}>Package Customization Dashboard</span>}
                style={{
                    marginBottom: '16px',
                    borderRadius: '12px',
                    border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
                    background: theme === 'dark' ? '#1e293b' : '#ffffff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}
            >
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '24px',
                    alignItems: 'center',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>Premium Theme:</span>
                        <Select
                            value={theme}
                            onChange={setTheme}
                            options={[
                                { value: 'light', label: '☀️ Light Mode' },
                                { value: 'dark', label: '🌙 Dark Mode' }
                            ]}
                            style={{ width: '130px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>Hide Weekends:</span>
                        <Switch checked={hideWeekends} onChange={setHideWeekends} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>Week Numbers:</span>
                        <Switch checked={showWeekNumbers} onChange={setShowWeekNumbers} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>Custom Type Colors:</span>
                        <Switch checked={customColorsEnabled} onChange={setCustomColorsEnabled} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>Show Export:</span>
                        <Switch checked={showExportButton} onChange={setShowExportButton} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>Show Add Event:</span>
                        <Switch checked={showAddEventButton} onChange={setShowAddEventButton} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>Allow Day Click:</span>
                        <Switch checked={allowDateClick} onChange={setAllowDateClick} />
                    </div>
                </div>
            </Card>

            <CalenderView
                events={events}
                theme={theme}
                startOfWeek="sunday"
                timeFormat="12h"
                hideWeekends={hideWeekends}
                showWeekNumbers={showWeekNumbers}
                showExportButton={showExportButton}
                showAddEventButton={showAddEventButton}
                allowDateClick={allowDateClick}
                eventColors={eventColorsMap}
                categories={['Meeting', 'Workshop', 'Call', 'Social', 'Review', 'Planning', 'Conference']}
                onAddEvent={handleAddEvent}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
                onDateChange={(date) => {
                    console.log('Active calendar date changed to:', date);
                }}
                onViewChange={(view) => {
                    console.log('Calendar view changed to:', view);
                }}
            />
        </div>
    );
}

export default App;