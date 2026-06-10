import React, { useState } from 'react';
import CalenderView from './CalenderView';
import eventsData from './eventsData'; // sample data — swap with your own
import { toast } from './components/ui/toast';

const Toggle = ({ checked, onChange }) => (
    <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: '#1272bf', cursor: 'pointer' }}
        />
    </label>
);

const SelectControl = ({ value, onChange, options, width = 130 }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
            width,
            height: 32,
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid #cbd5e1',
            background: '#fff',
            color: '#1e293b',
            cursor: 'pointer',
        }}
    >
        {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
        ))}
    </select>
);

function App() {
    const [events, setEvents] = useState(eventsData);
    const [theme, setTheme] = useState('light');
    const [hideWeekends, setHideWeekends] = useState(false);
    const [showWeekNumbers, setShowWeekNumbers] = useState(true);
    const [customColorsEnabled, setCustomColorsEnabled] = useState(true);
    const [showExportButton, setShowExportButton] = useState(true);
    const [showAddEventButton, setShowAddEventButton] = useState(true);
    const [allowDateClick, setAllowDateClick] = useState(true);
    const [readOnly, setReadOnly] = useState(false);
    const [showDualCalendars, setShowDualCalendars] = useState(false);
    const [controlledView, setControlledView] = useState('month');

    const handleAddEvent = (newEvent) => {
        setEvents(prev => [...prev, newEvent]);
        toast.success('Event added successfully!');
    };

    const handleUpdateEvent = (updatedEvent) => {
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        toast.success('Event updated successfully!');
    };

    const handleDeleteEvent = (eventId) => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        toast.success('Event deleted successfully!');
    };

    // Custom color map definition
    const eventColorsMap = customColorsEnabled ? {
        Meeting: '#ef4444', // Red
        Workshop: '#8b5cf6', // Violet
        Call: '#06b6d4', // Cyan
        Social: '#ec4899', // Pink
    } : {};

    const isDark = theme === 'dark';
    const labelStyle = { fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' };
    const row = { display: 'flex', alignItems: 'center', gap: '8px' };

    return (
        <div style={{
            minHeight: '100vh',
            background: isDark ? '#0f172a' : '#f8fafc',
            color: isDark ? '#f8fafc' : '#1e293b',
            fontFamily: 'Outfit, Inter, sans-serif',
            transition: 'background 0.25s ease, color 0.25s ease',
            padding: '16px'
        }}>
            {/* Package Capabilities Controller */}
            <div
                style={{
                    marginBottom: '16px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                    background: isDark ? '#1e293b' : '#ffffff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    padding: '16px 20px',
                }}
            >
                <div style={{ fontWeight: 700, marginBottom: '16px', color: isDark ? '#fff' : '#1e293b' }}>
                    Package Customization Dashboard
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
                    <div style={row}>
                        <span style={labelStyle}>Premium Theme:</span>
                        <SelectControl
                            value={theme}
                            onChange={setTheme}
                            options={[
                                { value: 'light', label: '☀️ Light Mode' },
                                { value: 'dark', label: '🌙 Dark Mode' },
                            ]}
                        />
                    </div>
                    <div style={row}><span style={labelStyle}>Hide Weekends:</span><Toggle checked={hideWeekends} onChange={setHideWeekends} /></div>
                    <div style={row}><span style={labelStyle}>Week Numbers:</span><Toggle checked={showWeekNumbers} onChange={setShowWeekNumbers} /></div>
                    <div style={row}><span style={labelStyle}>Custom Type Colors:</span><Toggle checked={customColorsEnabled} onChange={setCustomColorsEnabled} /></div>
                    <div style={row}><span style={labelStyle}>Show Export:</span><Toggle checked={showExportButton} onChange={setShowExportButton} /></div>
                    <div style={row}><span style={labelStyle}>Show Add Event:</span><Toggle checked={showAddEventButton} onChange={setShowAddEventButton} /></div>
                    <div style={row}><span style={labelStyle}>Allow Day Click:</span><Toggle checked={allowDateClick} onChange={setAllowDateClick} /></div>
                    <div style={row}><span style={labelStyle}>Read Only:</span><Toggle checked={readOnly} onChange={setReadOnly} /></div>
                    <div style={row}><span style={labelStyle}>Dual Calendars:</span><Toggle checked={showDualCalendars} onChange={setShowDualCalendars} /></div>
                    <div style={row}>
                        <span style={labelStyle}>Controlled View:</span>
                        <SelectControl
                            value={controlledView}
                            onChange={setControlledView}
                            width={120}
                            options={[
                                { value: 'month', label: 'Month' },
                                { value: 'week', label: 'Week' },
                                { value: 'day', label: 'Day' },
                                { value: 'list', label: 'List' },
                                { value: 'year', label: 'Year' },
                            ]}
                        />
                    </div>
                </div>
            </div>

            {showDualCalendars ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', minHeight: '520px' }}>
                    <CalenderView
                        events={events}
                        theme={theme}
                        defaultView="month"
                        startOfWeek="sunday"
                        timeFormat="12h"
                        hideWeekends={hideWeekends}
                        showWeekNumbers={showWeekNumbers}
                        eventColors={eventColorsMap}
                        categories={['Meeting', 'Workshop', 'Call', 'Social', 'Review', 'Planning', 'Conference']}
                        onAddEvent={handleAddEvent}
                        onUpdateEvent={handleUpdateEvent}
                        onDeleteEvent={handleDeleteEvent}
                    />
                    <CalenderView
                        events={events}
                        theme={theme}
                        defaultView="list"
                        readOnly
                        startOfWeek="monday"
                        timeFormat="24h"
                        hideWeekends={hideWeekends}
                        showAddEventButton={false}
                        allowDateClick={false}
                        eventColors={eventColorsMap}
                        onEventClick={(event) => {
                            toast.info(`Read-only preview: ${event.title}`);
                            return false;
                        }}
                    />
                </div>
            ) : (
                <CalenderView
                    events={events}
                    theme={theme}
                    view={controlledView}
                    onViewChange={setControlledView}
                    startOfWeek="sunday"
                    timeFormat="12h"
                    hideWeekends={hideWeekends}
                    showWeekNumbers={showWeekNumbers}
                    showExportButton={showExportButton}
                    showAddEventButton={showAddEventButton}
                    allowDateClick={allowDateClick}
                    readOnly={readOnly}
                    eventColors={eventColorsMap}
                    categories={['Meeting', 'Workshop', 'Call', 'Social', 'Review', 'Planning', 'Conference']}
                    onAddEvent={handleAddEvent}
                    onUpdateEvent={handleUpdateEvent}
                    onDeleteEvent={handleDeleteEvent}
                    onDateChange={(date) => {
                        console.log('Active calendar date changed to:', date);
                    }}
                />
            )}
        </div>
    );
}

export default App;
