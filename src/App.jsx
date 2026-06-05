import React from 'react';
import CalenderView from './CalenderView';
import eventsData from './eventsData'; // sample data — swap with your own

function App() {
    return (
        <CalenderView
            events={eventsData}
            startOfWeek="sunday"
            timeFormat="12h"
        />
    );
}

export default App;