import React from 'react';

/**
 * Lightweight replacement for antd `Select` built on a native <select>.
 * `onChange` receives the selected value (not the event) to mirror antd usage.
 */
export function Select({ value, onChange, options = [], placeholder, id, style, className, ...rest }) {
    return (
        <div className="rec-select" style={{ position: 'relative', ...style }}>
            <select
                id={id}
                className={['rec-select-input', className].filter(Boolean).join(' ')}
                value={value ?? ''}
                onChange={(e) => onChange?.(e.target.value)}
                {...rest}
            >
                {placeholder != null && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((opt) => (
                    <option key={String(opt.value)} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <span className="rec-select-arrow" aria-hidden="true" />
        </div>
    );
}

export default Select;
