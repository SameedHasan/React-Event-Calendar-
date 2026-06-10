import React from 'react';
import useCalendarStore from '../store/useCalendarStore';
import {
    buildEventRenderContext,
    createEventClickHandler,
    pickLayoutStyles,
} from '../utils/eventRendering';

/**
 * Renders a custom event via `renderEvent` or falls back to `children` default UI.
 * Custom renders only receive layout/position styles on the wrapper — not default chrome
 * (background, borders, padding), matching month-view behavior.
 */
export default function EventRenderer({
    event,
    view,
    date,
    wrapperStyle,
    wrapperClassName,
    children,
}) {
    const renderEvent = useCalendarStore((state) => state.renderEvent);
    const { onEventClick, openEditModal, readOnly } = useCalendarStore();
    const onClick = createEventClickHandler(event, { onEventClick, openEditModal, readOnly });
    const context = buildEventRenderContext(event, view, date);
    const renderContext = { ...context, onClick };

    if (renderEvent) {
        const layoutStyle = pickLayoutStyles(wrapperStyle);

        return (
            <div
                style={layoutStyle}
                className="calendar-event-slot"
                onClick={onClick}
            >
                {renderEvent(event, renderContext)}
            </div>
        );
    }

    return children({
        onClick,
        context: renderContext,
        wrapperStyle,
        wrapperClassName,
    });
}
