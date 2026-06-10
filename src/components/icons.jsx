import React from 'react';

/**
 * Inline SVG icon set replacing @ant-design/icons.
 * Each icon renders like an antd icon: a `role="img"` span containing a 1em SVG
 * that inherits color via `currentColor` and size via `font-size` (1em).
 */
const IconBase = ({ children, style, className, label, ...rest }) => (
    <span
        role="img"
        aria-hidden={label ? undefined : true}
        aria-label={label}
        className={['rec-icon', className].filter(Boolean).join(' ')}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0, ...style }}
        {...rest}
    >
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            focusable="false"
            aria-hidden="true"
        >
            {children}
        </svg>
    </span>
);

export const LeftOutlined = (props) => (
    <IconBase {...props}><polyline points="15 5 8 12 15 19" /></IconBase>
);

export const RightOutlined = (props) => (
    <IconBase {...props}><polyline points="9 5 16 12 9 19" /></IconBase>
);

export const PlusOutlined = (props) => (
    <IconBase {...props}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></IconBase>
);

export const CalendarOutlined = (props) => (
    <IconBase {...props}>
        <rect x="3" y="4.5" width="18" height="16" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="8" y1="2.5" x2="8" y2="6.5" />
        <line x1="16" y1="2.5" x2="16" y2="6.5" />
    </IconBase>
);

export const TableOutlined = (props) => (
    <IconBase {...props}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="3" y1="9.5" x2="21" y2="9.5" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="4" x2="9" y2="20" />
    </IconBase>
);

export const FieldTimeOutlined = (props) => (
    <IconBase {...props}>
        <circle cx="12" cy="13" r="7.5" />
        <polyline points="12 9.5 12 13 14.5 14.5" />
        <line x1="8" y1="2.5" x2="16" y2="2.5" />
    </IconBase>
);

export const UnorderedListOutlined = (props) => (
    <IconBase {...props}>
        <line x1="8" y1="6" x2="20" y2="6" />
        <line x1="8" y1="12" x2="20" y2="12" />
        <line x1="8" y1="18" x2="20" y2="18" />
        <circle cx="4" cy="6" r="0.6" />
        <circle cx="4" cy="12" r="0.6" />
        <circle cx="4" cy="18" r="0.6" />
    </IconBase>
);

export const AppstoreOutlined = (props) => (
    <IconBase {...props}>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </IconBase>
);

export const DownloadOutlined = (props) => (
    <IconBase {...props}>
        <path d="M12 3.5v11" />
        <polyline points="7.5 10 12 14.5 16.5 10" />
        <path d="M4.5 19.5h15" />
    </IconBase>
);

export const UploadOutlined = (props) => (
    <IconBase {...props}>
        <path d="M12 14.5v-11" />
        <polyline points="7.5 8 12 3.5 16.5 8" />
        <path d="M4.5 19.5h15" />
    </IconBase>
);

export const ClockCircleOutlined = (props) => (
    <IconBase {...props}>
        <circle cx="12" cy="12" r="8.5" />
        <polyline points="12 7.5 12 12 15 13.5" />
    </IconBase>
);

export const CloseOutlined = (props) => (
    <IconBase {...props}><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></IconBase>
);

export const CheckCircleFilled = (props) => (
    <IconBase {...props}>
        <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
        <polyline points="8 12.5 11 15.5 16 9" stroke="#fff" />
    </IconBase>
);

export const CloseCircleFilled = (props) => (
    <IconBase {...props}>
        <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
        <line x1="9" y1="9" x2="15" y2="15" stroke="#fff" />
        <line x1="15" y1="9" x2="9" y2="15" stroke="#fff" />
    </IconBase>
);
