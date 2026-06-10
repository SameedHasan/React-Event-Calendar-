import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Typography } from 'antd';
import { CALENDAR_SHORTCUTS } from '../utils/a11y';

const { Text } = Typography;

export default function KeyboardShortcutsHelp() {
    const [open, setOpen] = useState(false);

    const handleKeyDown = useCallback((event) => {
        const tag = event.target.tagName;
        if (
            tag === 'INPUT' ||
            tag === 'TEXTAREA' ||
            tag === 'SELECT' ||
            event.target.isContentEditable
        ) {
            return;
        }

        if (event.ctrlKey || event.metaKey || event.altKey) return;

        if (event.key === '?' || (event.key === '/' && event.shiftKey)) {
            event.preventDefault();
            setOpen(true);
        }

        if (event.key === 'Escape' && open) {
            setOpen(false);
        }
    }, [open]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <Modal
            title="Keyboard shortcuts"
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            width={420}
            destroyOnHidden
        >
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {CALENDAR_SHORTCUTS.map(({ keys, description }) => (
                    <li
                        key={keys}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '16px',
                            padding: '8px 0',
                            borderBottom: '1px solid var(--border-color)',
                        }}
                    >
                        <Text keyboard>{keys}</Text>
                        <Text style={{ color: 'var(--text-secondary)' }}>{description}</Text>
                    </li>
                ))}
            </ul>
        </Modal>
    );
}
