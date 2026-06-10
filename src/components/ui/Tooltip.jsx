import React, { useState, useRef, useCallback, cloneElement, isValidElement } from 'react';
import { createPortal } from 'react-dom';

/**
 * Lightweight replacement for antd `Tooltip` (top placement).
 * Clones the single child to attach hover/focus handlers (no extra wrapper DOM,
 * preserving the host layout) and renders the floating tooltip in a portal.
 *
 * Supported props mirror the subset used across the calendar views:
 *   title, placement ('top'|'bottom'), overlayStyle, overlayInnerStyle, color
 */
export function Tooltip({
    title,
    placement = 'top',
    overlayStyle,
    overlayInnerStyle,
    color,
    children,
}) {
    const [visible, setVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, placement });
    const triggerRef = useRef(null);

    const show = useCallback(() => {
        const node = triggerRef.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const below = placement === 'bottom';
        setCoords({
            top: below ? rect.bottom + 8 : rect.top - 8,
            left: rect.left + rect.width / 2,
            placement: below ? 'bottom' : 'top',
        });
        setVisible(true);
    }, [placement]);

    const hide = useCallback(() => setVisible(false), []);

    if (!isValidElement(children)) {
        return children || null;
    }

    const setRef = (node) => {
        triggerRef.current = node;
        const childRef = children.ref;
        if (typeof childRef === 'function') childRef(node);
        else if (childRef && typeof childRef === 'object') childRef.current = node;
    };

    const compose = (handler, original) => (e) => {
        if (typeof original === 'function') original(e);
        handler(e);
    };

    const trigger = cloneElement(children, {
        ref: setRef,
        onMouseEnter: compose(show, children.props.onMouseEnter),
        onMouseLeave: compose(hide, children.props.onMouseLeave),
        onFocus: compose(show, children.props.onFocus),
        onBlur: compose(hide, children.props.onBlur),
    });

    const isBottom = coords.placement === 'bottom';

    const innerStyle = {
        maxWidth: '260px',
        padding: '8px 10px',
        borderRadius: '8px',
        background: color || 'var(--white-color)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 6px 16px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.10)',
        fontSize: '13px',
        ...overlayInnerStyle,
    };

    return (
        <>
            {trigger}
            {visible && title != null && createPortal(
                <div
                    role="tooltip"
                    style={{
                        position: 'fixed',
                        top: coords.top,
                        left: coords.left,
                        transform: `translate(-50%, ${isBottom ? '0' : '-100%'})`,
                        zIndex: 2000,
                        pointerEvents: 'none',
                        ...overlayStyle,
                    }}
                >
                    <div style={innerStyle}>{title}</div>
                </div>,
                document.body
            )}
        </>
    );
}

export default Tooltip;
