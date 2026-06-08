import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, Space, message } from 'antd';
import useCalendarStore from './store/useCalendarStore';
import dayjs from 'dayjs';

const { TextArea } = Input;



// Premium preset colors for manual color overrides.
const PRESET_COLORS = [
    { name: 'Default HSL Hash', value: '' },
    { name: 'Rose Red', value: '#e11d48' },
    { name: 'Emerald Green', value: '#10b981' },
    { name: 'Ocean Blue', value: '#0284c7' },
    { name: 'Amber Yellow', value: '#d97706' },
    { name: 'Amethyst Purple', value: '#7c3aed' },
];

export default function EventModal() {
    const [form] = Form.useForm();
    const {
        isModalOpen,
        selectedEvent,
        prepopulatedStartDate,
        closeModal,
        addEvent,
        updateEvent,
        deleteEvent,
        categories,
    } = useCalendarStore();

    // Reset or populate form when modal state changes
    useEffect(() => {
        if (!isModalOpen) return;

        if (selectedEvent) {
            form.setFieldsValue({
                title: selectedEvent.title,
                type: selectedEvent.type || (categories[0] || 'Meeting'),
                description: selectedEvent.description || '',
                color: selectedEvent.color || '',
                range: [dayjs(selectedEvent.start), dayjs(selectedEvent.end)],
            });
        } else {
            const start = prepopulatedStartDate ? dayjs(prepopulatedStartDate) : dayjs();
            // Default duration: 1 hour
            const end = start.add(1, 'hour');

            form.setFieldsValue({
                title: '',
                type: categories[0] || 'Meeting',
                description: '',
                color: '',
                range: [start, end],
            });
        }
    }, [isModalOpen, selectedEvent, prepopulatedStartDate, form]);

    const handleCancel = () => {
        closeModal();
    };

    const handleDelete = () => {
        if (selectedEvent) {
            Modal.confirm({
                title: 'Delete Event',
                content: `Are you sure you want to delete "${selectedEvent.title}"?`,
                okText: 'Delete',
                okType: 'danger',
                cancelText: 'Cancel',
                centered: true,
                onOk() {
                    deleteEvent(selectedEvent.id);
                    message.success('Event deleted successfully');
                    closeModal();
                },
            });
        }
    };

    const handleFinish = (values) => {
        const [startVal, endVal] = values.range || [];
        if (!startVal || !endVal) {
            message.error('Please specify start and end times');
            return;
        }

        if (endVal.isBefore(startVal) || endVal.isSame(startVal)) {
            message.error('End time must be strictly after start time');
            return;
        }

        const eventPayload = {
            title: values.title.trim(),
            type: values.type,
            description: values.description ? values.description.trim() : '',
            color: values.color || undefined,
            start: startVal.toDate(),
            end: endVal.toDate(),
        };

        if (selectedEvent) {
            // Edit existing event
            updateEvent({
                ...selectedEvent,
                ...eventPayload,
            });
            message.success('Event updated successfully');
        } else {
            // Create new event
            addEvent({
                id: `evt-${Date.now()}`,
                ...eventPayload,
            });
            message.success('Event created successfully');
        }

        closeModal();
    };

    return (
        <Modal
            open={isModalOpen}
            title={selectedEvent ? 'Edit Event' : 'Create Event'}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
            centered
            bodyStyle={{ paddingTop: '12px' }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{ type: categories[0] || 'Meeting', color: '' }}
            >
                <Form.Item
                    name="title"
                    label="Event Title"
                    rules={[{ required: true, message: 'Please enter a title' }]}
                >
                    <Input placeholder="e.g. Design Sync" maxLength={100} />
                </Form.Item>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Form.Item
                        name="type"
                        label="Category / Type"
                        rules={[{ required: true, message: 'Please select or type a category' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select category"
                            options={categories.map(t => ({ value: t, label: t }))}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="color"
                        label="Color Theme"
                    >
                        <Select
                            placeholder="Auto (Hash-based)"
                            options={PRESET_COLORS.map(c => ({
                                value: c.value,
                                label: (
                                    <Space>
                                        {c.value && (
                                            <div style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                background: c.value
                                            }} />
                                        )}
                                        {c.name}
                                    </Space>
                                )
                            }))}
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    name="range"
                    label="Event Duration (Start & End)"
                    rules={[{ required: true, message: 'Please select a duration' }]}
                >
                    <DatePicker.RangePicker
                        showTime={{ format: 'hh:mm A', use12Hours: true }}
                        format="YYYY-MM-DD hh:mm A"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                >
                    <TextArea
                        rows={3}
                        placeholder="Add some details..."
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            {selectedEvent && (
                                <Button danger onClick={handleDelete}>
                                    Delete Event
                                </Button>
                            )}
                        </div>
                        <Space>
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {selectedEvent ? 'Save Changes' : 'Create Event'}
                            </Button>
                        </Space>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
}
