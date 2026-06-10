import React from 'react';
import { Spin } from 'antd';

export default function CalendarLoadingOverlay({ loading, children }) {
    return (
        <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
            {children}
            {loading && (
                <div
                    className="calendar-loading-overlay"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'color-mix(in srgb, var(--white-color) 72%, transparent)',
                        backdropFilter: 'blur(1px)',
                        zIndex: 100,
                    }}
                    aria-busy="true"
                    aria-live="polite"
                >
                    <Spin size="large" />
                </div>
            )}
        </div>
    );
}
