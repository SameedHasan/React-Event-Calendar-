import React from 'react';
import { createRoot } from 'react-dom/client';
import Modal from './Modal';
import Button from './Button';

/**
 * Imperative confirm dialog replacing antd `Modal.confirm`.
 * Mounts a temporary React root, resolves on confirm/cancel, then unmounts.
 */
export function confirm({
    title = 'Confirm',
    content,
    okText = 'OK',
    cancelText = 'Cancel',
    okType = 'primary',
    onOk,
    onCancel,
} = {}) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const cleanup = () => {
        root.unmount();
        if (container.parentNode) container.parentNode.removeChild(container);
    };

    const handleOk = () => {
        cleanup();
        onOk?.();
    };

    const handleCancel = () => {
        cleanup();
        onCancel?.();
    };

    const footer = (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={handleCancel}>{cancelText}</Button>
            <Button type="primary" danger={okType === 'danger'} onClick={handleOk}>
                {okText}
            </Button>
        </div>
    );

    root.render(
        <Modal open title={title} onCancel={handleCancel} width={416} footer={footer}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
                {content}
            </div>
        </Modal>
    );
}

export default confirm;
