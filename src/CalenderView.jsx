import React from 'react';
import Calender from './Calender';

/**
 * Thin wrapper — forwards all props to <Calender>.
 * Consumers can also import <Calender> directly.
 */
export default function CalenderView(props) {
    return (
        <div style={{ height: 'calc(100vh - 220px)', minHeight: '480px' }}>
            <Calender {...props} />
        </div>
    );
}
