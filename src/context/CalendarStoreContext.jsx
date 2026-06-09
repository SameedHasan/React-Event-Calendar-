import React, { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand/react';
import { createCalendarStore } from '../store/createCalendarStore';

export const CalendarStoreContext = createContext(null);

export function CalendarStoreProvider({ children, defaultView = 'month' }) {
    const storeRef = useRef(null);

    if (!storeRef.current) {
        storeRef.current = createCalendarStore({ defaultView });
    }

    return (
        <CalendarStoreContext.Provider value={storeRef.current}>
            {children}
        </CalendarStoreContext.Provider>
    );
}

export function useCalendarStoreApi() {
    const store = useContext(CalendarStoreContext);
    if (!store) {
        throw new Error('useCalendarStore must be used within a Calendar component');
    }
    return store;
}

export function useCalendarStore(selector) {
    const store = useCalendarStoreApi();
    return useStore(store, selector);
}
