import React from 'react';
import useCalendarStore from '../store/useCalendarStore';
import { useToolbarApi } from '../hooks/useToolbarApi';
import CalenderHeader from '../CalenderHeader';

export default function CalendarToolbar() {
    const renderToolbar = useCalendarStore((state) => state.renderToolbar);
    const api = useToolbarApi();

    if (renderToolbar) {
        return renderToolbar(api);
    }

    return <CalenderHeader />;
}
