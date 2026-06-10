import React from 'react';

/**
 * Lightweight replacement for antd `Typography.Text`.
 * Renders a span; supports the `keyboard` prop (renders a <kbd>-style chip).
 */
export function Text({ keyboard, style, className, children, ...rest }) {
    if (keyboard) {
        return (
            <kbd
                className={['rec-kbd', className].filter(Boolean).join(' ')}
                style={style}
                {...rest}
            >
                {children}
            </kbd>
        );
    }

    return (
        <span
            className={['rec-text', className].filter(Boolean).join(' ')}
            style={style}
            {...rest}
        >
            {children}
        </span>
    );
}

export default Text;
