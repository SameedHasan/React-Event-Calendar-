import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Manages roving tabindex within a group of focusable siblings (e.g. month event chips).
 */
export default function RovingTabIndexGroup({ itemCount, children }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const itemRefs = useRef([]);

    useEffect(() => {
        itemRefs.current = itemRefs.current.slice(0, itemCount);
    }, [itemCount]);

    useEffect(() => {
        if (itemCount === 0) return;
        const safeIndex = Math.min(activeIndex, itemCount - 1);
        itemRefs.current[safeIndex]?.focus();
    }, [activeIndex, itemCount]);

    const getTabIndex = useCallback(
        (index) => (index === activeIndex ? 0 : -1),
        [activeIndex]
    );

    const registerRef = useCallback((index, node) => {
        itemRefs.current[index] = node;
    }, []);

    const handleKeyDown = useCallback((event, index) => {
        if (itemCount <= 1) return;

        let nextIndex = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            nextIndex = (index + 1) % itemCount;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            nextIndex = (index - 1 + itemCount) % itemCount;
        } else if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = itemCount - 1;
        }

        if (nextIndex !== null) {
            event.preventDefault();
            setActiveIndex(nextIndex);
        }
    }, [itemCount]);

    const handleFocus = useCallback((index) => {
        setActiveIndex(index);
    }, []);

    return children({
        getTabIndex,
        registerRef,
        onKeyDown: handleKeyDown,
        onFocus: handleFocus,
    });
}
