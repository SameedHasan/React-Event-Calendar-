import React from 'react';

/**
 * Lightweight replacement for antd `Spin`.
 * A CSS keyframe ring spinner colored with the calendar primary color.
 */
export function Spinner({ size = 'default', style }) {
    const dim = size === 'large' ? 32 : size === 'small' ? 16 : 24;
    return (
        <span
            className="rec-spinner"
            role="status"
            aria-label="Loading"
            style={{
                display: 'inline-block',
                width: dim,
                height: dim,
                border: `${Math.max(2, Math.round(dim / 10))}px solid color-mix(in srgb, var(--primary-color) 22%, transparent)`,
                borderTopColor: 'var(--primary-color)',
                borderRadius: '50%',
                animation: 'rec-spin 0.8s linear infinite',
                ...style,
            }}
        />
    );
}

export default Spinner;
