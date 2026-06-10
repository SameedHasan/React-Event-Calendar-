import React from 'react';

/**
 * Lightweight replacement for antd `Button`.
 * Variants: type='default'|'primary', danger boolean. Sized to match the
 * previous antd default button (32px height).
 */
export function Button({
    type = 'default',
    danger = false,
    htmlType = 'button',
    style,
    className,
    children,
    ...rest
}) {
    const variant = danger
        ? (type === 'primary' ? 'primary-danger' : 'danger')
        : type;
    return (
        <button
            type={htmlType}
            className={['rec-btn', `rec-btn-${variant}`, className].filter(Boolean).join(' ')}
            style={style}
            {...rest}
        >
            {children}
        </button>
    );
}

export default Button;
