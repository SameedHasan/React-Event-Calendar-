import React from 'react';
import Calender from './Calender';

/**
 * Thin wrapper — forwards all props to <Calender>.
 * Consumers can also import <Calender> directly.
 */
export default function CalenderView({ events = [], defaultView = 'month' }) {
    return (
        <Calender events={events} defaultView={defaultView} />
    );
}
