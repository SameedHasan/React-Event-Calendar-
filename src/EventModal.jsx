import React, { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useCalendarStore from './store/useCalendarStore';
import Modal from './components/ui/Modal';
import Button from './components/ui/Button';
import Select from './components/ui/Select';
import { toast } from './components/ui/toast';
import { confirm } from './components/ui/confirm';
import {
    RECURRENCE_PRESETS,
    buildRecurrenceRule,
    parseRecurrencePreset,
    parseRecurrenceCount,
} from './utils/recurrence';

const PRESET_COLORS = [
    { name: 'Default HSL Hash', value: '' },
    { name: 'Rose Red', value: '#e11d48' },
    { name: 'Emerald Green', value: '#10b981' },
    { name: 'Ocean Blue', value: '#0284c7' },
    { name: 'Amber Yellow', value: '#d97706' },
    { name: 'Amethyst Purple', value: '#7c3aed' },
];

const toDate = (value) => (value instanceof Date ? value : value ? new Date(value) : null);

const EMPTY_FORM = {
    title: '',
    type: '',
    description: '',
    color: '',
    start: null,
    end: null,
    recurrencePreset: 'none',
    recurrenceCount: '',
};

const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '6px',
};

const fieldWrap = { marginBottom: '16px' };

export default function EventModal() {
    const {
        isModalOpen,
        selectedEvent,
        prepopulatedStartDate,
        closeModal,
        addEvent,
        updateEvent,
        deleteEvent,
        categories,
        timeFormat,
        readOnly,
    } = useCalendarStore();

    const [form, setForm] = useState(EMPTY_FORM);
    const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

    const is12h = timeFormat !== '24h';
    const pickerProps = useMemo(() => ({
        showTimeSelect: true,
        timeIntervals: 15,
        timeFormat: is12h ? 'h:mm aa' : 'HH:mm',
        dateFormat: is12h ? 'yyyy-MM-dd h:mm aa' : 'yyyy-MM-dd HH:mm',
    }), [is12h]);

    useEffect(() => {
        if (!isModalOpen || readOnly) return;

        if (selectedEvent) {
            setForm({
                title: selectedEvent.title || '',
                type: selectedEvent.type || categories[0] || 'Meeting',
                description: selectedEvent.description || '',
                color: selectedEvent.color || '',
                start: toDate(selectedEvent.start),
                end: toDate(selectedEvent.end),
                recurrencePreset: parseRecurrencePreset(selectedEvent.recurrence) || 'none',
                recurrenceCount: parseRecurrenceCount(selectedEvent.recurrence) || '',
            });
        } else {
            const start = prepopulatedStartDate ? new Date(prepopulatedStartDate) : new Date();
            const end = new Date(start.getTime() + 60 * 60 * 1000);
            setForm({
                ...EMPTY_FORM,
                type: categories[0] || 'Meeting',
                start,
                end,
            });
        }
    }, [isModalOpen, selectedEvent, prepopulatedStartDate, categories, readOnly]);

    const handleDelete = () => {
        if (!selectedEvent) return;
        confirm({
            title: 'Delete Event',
            content: selectedEvent.recurrence
                ? `Delete the entire recurring series "${selectedEvent.title}"?`
                : `Are you sure you want to delete "${selectedEvent.title}"?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => {
                deleteEvent(selectedEvent.id);
                toast.success('Event deleted successfully');
                closeModal();
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const title = form.title.trim();
        if (!title) {
            toast.error('Please enter a title');
            return;
        }
        if (!form.type) {
            toast.error('Please select or type a category');
            return;
        }
        if (!form.start || !form.end) {
            toast.error('Please specify start and end times');
            return;
        }
        if (form.end <= form.start) {
            toast.error('End time must be strictly after start time');
            return;
        }

        const count = form.recurrenceCount ? Number(form.recurrenceCount) : undefined;
        const recurrence = buildRecurrenceRule(
            form.recurrencePreset,
            form.start,
            count ? { count } : {}
        );

        const eventPayload = {
            title,
            type: form.type,
            description: form.description ? form.description.trim() : '',
            color: form.color || undefined,
            start: form.start,
            end: form.end,
            recurrence,
        };

        if (selectedEvent) {
            updateEvent({ ...selectedEvent, ...eventPayload });
            toast.success('Event updated successfully');
        } else {
            addEvent({ id: `evt-${Date.now()}`, ...eventPayload });
            toast.success('Event created successfully');
        }

        closeModal();
    };

    if (readOnly) return null;

    const showCount = form.recurrencePreset && form.recurrencePreset !== 'none';

    const footer = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                {selectedEvent && (
                    <Button danger onClick={handleDelete}>
                        Delete Event
                    </Button>
                )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <Button onClick={closeModal}>Cancel</Button>
                <Button type="primary" htmlType="submit" form="rec-event-form">
                    {selectedEvent ? 'Save Changes' : 'Create Event'}
                </Button>
            </div>
        </div>
    );

    return (
        <Modal
            open={isModalOpen}
            title={selectedEvent ? 'Edit Event' : 'Create Event'}
            onCancel={closeModal}
            footer={footer}
            styles={{ body: { paddingTop: '12px' } }}
        >
            <form id="rec-event-form" onSubmit={handleSubmit}>
                <div style={fieldWrap}>
                    <label htmlFor="rec-evt-title" style={labelStyle}>Event Title</label>
                    <input
                        id="rec-evt-title"
                        className="rec-input"
                        placeholder="e.g. Design Sync"
                        maxLength={100}
                        value={form.title}
                        onChange={(e) => setField('title', e.target.value)}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', ...fieldWrap }}>
                    <div>
                        <label htmlFor="rec-evt-type" style={labelStyle}>Category / Type</label>
                        <Select
                            id="rec-evt-type"
                            value={form.type}
                            onChange={(v) => setField('type', v)}
                            placeholder="Select category"
                            options={categories.map((t) => ({ value: t, label: t }))}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Color Theme</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '32px' }}>
                            {PRESET_COLORS.map((c) => {
                                const isSelectedColor = form.color === c.value;
                                const isAuto = c.value === '';
                                return (
                                    <button
                                        key={c.name}
                                        type="button"
                                        title={c.name}
                                        aria-label={c.name}
                                        aria-pressed={isSelectedColor}
                                        onClick={() => setField('color', c.value)}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            padding: 0,
                                            background: isAuto
                                                ? 'conic-gradient(#e11d48,#d97706,#10b981,#0284c7,#7c3aed,#e11d48)'
                                                : c.value,
                                            border: isSelectedColor
                                                ? '2px solid var(--primary-color)'
                                                : '2px solid var(--border-color)',
                                            boxShadow: isSelectedColor
                                                ? '0 0 0 2px color-mix(in srgb, var(--primary-color) 30%, transparent)'
                                                : 'none',
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div style={fieldWrap}>
                    <label style={labelStyle}>Event Duration (Start &amp; End)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <DatePicker
                            {...pickerProps}
                            selected={form.start}
                            onChange={(date) => setField('start', date)}
                            selectsStart
                            startDate={form.start}
                            endDate={form.end}
                            placeholderText="Start"
                            className="rec-input"
                            wrapperClassName="rec-datepicker-wrap"
                            popperClassName="rec-datepicker-popper"
                        />
                        <DatePicker
                            {...pickerProps}
                            selected={form.end}
                            onChange={(date) => setField('end', date)}
                            selectsEnd
                            startDate={form.start}
                            endDate={form.end}
                            minDate={form.start}
                            placeholderText="End"
                            className="rec-input"
                            wrapperClassName="rec-datepicker-wrap"
                            popperClassName="rec-datepicker-popper"
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', ...fieldWrap }}>
                    <div>
                        <label htmlFor="rec-evt-repeat" style={labelStyle}>Repeats</label>
                        <Select
                            id="rec-evt-repeat"
                            value={form.recurrencePreset}
                            onChange={(v) => setField('recurrencePreset', v)}
                            options={RECURRENCE_PRESETS}
                        />
                    </div>

                    {showCount && (
                        <div>
                            <label htmlFor="rec-evt-count" style={labelStyle}>Occurrences (optional)</label>
                            <input
                                id="rec-evt-count"
                                className="rec-input"
                                type="number"
                                min={2}
                                max={999}
                                placeholder="e.g. 10"
                                value={form.recurrenceCount}
                                onChange={(e) => setField('recurrenceCount', e.target.value)}
                                title="Leave empty for no end date. Instances are generated for the visible range only."
                            />
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: 0 }}>
                    <label htmlFor="rec-evt-desc" style={labelStyle}>Description</label>
                    <textarea
                        id="rec-evt-desc"
                        className="rec-input rec-textarea"
                        rows={3}
                        placeholder="Add some details..."
                        maxLength={500}
                        value={form.description}
                        onChange={(e) => setField('description', e.target.value)}
                    />
                    <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {form.description.length} / 500
                    </div>
                </div>
            </form>
        </Modal>
    );
}
