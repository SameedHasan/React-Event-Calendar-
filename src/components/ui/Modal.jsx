import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CloseOutlined } from '../icons';

/**
 * Lightweight replacement for antd `Modal` (controlled, footer rendered by caller).
 * Renders a dimmed backdrop + centered card in a portal. Escape and backdrop
 * click invoke onCancel. Styled to match the previous antd modal appearance.
 */
export function Modal({
    open,
    title,
    onCancel,
    footer = null,
    width = 520,
    children,
    styles = {},
    closable = true,
}) {
    const cardRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') onCancel?.(e);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onCancel]);

    useEffect(() => {
        if (open && cardRef.current) {
            const focusable = cardRef.current.querySelector(
                'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
            );
            focusable?.focus?.();
        }
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div
            className="rec-modal-root"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}
        >
            <div
                className="rec-modal-mask"
                onClick={(e) => onCancel?.(e)}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.45)',
                }}
            />
            <div
                ref={cardRef}
                role="dialog"
                aria-modal="true"
                aria-label={typeof title === 'string' ? title : undefined}
                className="rec-modal-card"
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: typeof width === 'number' ? `${width}px` : width,
                    maxHeight: 'calc(100vh - 40px)',
                    overflowY: 'auto',
                    background: 'var(--white-color)',
                    borderRadius: '12px',
                    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.24)',
                    padding: '20px 24px 24px',
                    boxSizing: 'border-box',
                    ...styles.content,
                }}
            >
                {title != null && (
                    <div
                        className="rec-modal-title"
                        style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            marginBottom: '4px',
                            paddingRight: '24px',
                            ...styles.header,
                        }}
                    >
                        {title}
                    </div>
                )}
                {closable && (
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={(e) => onCancel?.(e)}
                        className="rec-modal-close"
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            background: 'transparent',
                            borderRadius: '6px',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '14px',
                        }}
                    >
                        <CloseOutlined />
                    </button>
                )}
                <div className="rec-modal-body" style={styles.body}>
                    {children}
                </div>
                {footer != null && (
                    <div className="rec-modal-footer" style={{ marginTop: '16px' }}>
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}

export default Modal;
