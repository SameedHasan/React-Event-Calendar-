/**
 * Lightweight imperative toast replacing antd `message`.
 * Renders top-center pill notifications via direct DOM (no React root churn).
 */

let containerEl = null;

function ensureContainer() {
    if (containerEl && document.body.contains(containerEl)) return containerEl;
    containerEl = document.createElement('div');
    containerEl.className = 'rec-toast-container';
    containerEl.setAttribute('aria-live', 'polite');
    Object.assign(containerEl.style, {
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '3000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        pointerEvents: 'none',
    });
    document.body.appendChild(containerEl);
    return containerEl;
}

const ICONS = {
    success: { color: '#16a34a', glyph: '\u2713' },
    error: { color: '#dc2626', glyph: '\u2715' },
    info: { color: 'var(--primary-color)', glyph: 'i' },
    warning: { color: '#d97706', glyph: '!' },
};

function show(type, content, duration = 3000) {
    if (typeof document === 'undefined') return;
    const container = ensureContainer();

    const toast = document.createElement('div');
    toast.setAttribute('role', 'status');
    Object.assign(toast.style, {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: '#ffffff',
        color: 'rgba(0,0,0,0.88)',
        borderRadius: '8px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.12), 0 3px 6px rgba(0,0,0,0.10)',
        fontSize: '14px',
        lineHeight: '20px',
        pointerEvents: 'auto',
        opacity: '0',
        transform: 'translateY(-8px)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
    });

    const cfg = ICONS[type] || ICONS.info;
    const icon = document.createElement('span');
    Object.assign(icon.style, {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: cfg.color,
        color: '#fff',
        fontSize: '11px',
        fontWeight: '700',
        flexShrink: '0',
    });
    icon.textContent = cfg.glyph;

    const text = document.createElement('span');
    text.textContent = content;

    toast.appendChild(icon);
    toast.appendChild(text);
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    window.setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-8px)';
        window.setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
            if (containerEl && containerEl.childElementCount === 0 && containerEl.parentNode) {
                containerEl.parentNode.removeChild(containerEl);
                containerEl = null;
            }
        }, 220);
    }, duration);
}

export const toast = {
    success: (content, duration) => show('success', content, duration),
    error: (content, duration) => show('error', content, duration),
    info: (content, duration) => show('info', content, duration),
    warning: (content, duration) => show('warning', content, duration),
};

export default toast;
