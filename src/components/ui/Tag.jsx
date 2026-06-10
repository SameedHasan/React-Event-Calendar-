import React from 'react';

/**
 * Lightweight replacement for antd `Tag`.
 * A pill-shaped span. `style.borderColor` overrides the default border color,
 * matching how the calendar views previously styled antd Tags.
 */
export function Tag({ color: _color, style, className, children, ...rest }) {
    const base = {
        display: 'inline-flex',
        alignItems: 'center',
        height: '22px',
        padding: '0 8px',
        fontSize: '12px',
        lineHeight: '20px',
        whiteSpace: 'nowrap',
        background: 'var(--tag-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        color: 'var(--text-secondary)',
        boxSizing: 'border-box',
    };

    return (
        <span
            className={['rec-tag', className].filter(Boolean).join(' ')}
            style={{ ...base, ...style }}
            {...rest}
        >
            {children}
        </span>
    );
}

export default Tag;
