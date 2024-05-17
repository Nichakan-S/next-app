'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmAlert, SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Input, Button, TimePicker, Select } from 'antd';

import moment from 'moment';

const { Option } = Select;

const EditSubject = ({ params }) => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [day, setDay] = useState('');
    const [group, setGroup] = useState('');
    const [starttime, setStartTime] = useState('');
    const [endtime, setEndTime] = useState('');
    const [term, setTerm] = useState('');
    const [year, setYear] = useState('');
    const router = useRouter();
    const { id } = params;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchSubject(parseInt(id));
        }
    }, [id]);

    const fetchSubject = async (id) => {
        try {
            const response = await fetch(`/api/subject/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error('Failed to fetch Subject');
            setName(data.name);
            setCode(data.code);
            setDay(data.day);
            setGroup(data.group);
            setStartTime(data.starttime);
            setEndTime(data.endtime);
            setTerm(data.term);
            setYear(data.year);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedStartTime = starttime ? moment(starttime, 'HH:mm').format('HH:mm') : '';
        const formattedEndTime = endtime ? moment(endtime, 'HH:mm').format('HH:mm') : '';

        try {
            const response = await fetch(`/api/subject/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, code, day, group, starttime: formattedStartTime, endtime: formattedEndTime, term: parseInt(term, 10), year: parseInt(year, 10) })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
            router.push('/admin/subject');

        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };

    const handleDelete = async () => {
        ConfirmAlert('คุณแน่ใจที่จะลบข้อมูลนี้?', 'การดำเนินการนี้ไม่สามารถย้อนกลับได้', async () => {
            try {
                const response = await fetch(`/api/subject/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete the subject.');
                SuccessAlert('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว');
                router.push('/admin/subject');
            } catch (error) {
                console.error('Failed to delete the subject', error);
                WarningAlert('ผิดพลาด!', 'ไม่สามารถลบข้อมูลได้');
            }
        });
    };

    const handleBack = () => {
        router.push('/admin/subject');
    };

    const yearOptions = [];
    const currentYear = moment().year();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        const thaiYear = moment(i.toString()).add(543, 'years').format('YYYY');
        yearOptions.push(<Option key={i} value={i}>{thaiYear}</Option>);
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="mt-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Edit Subject</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-4">
                        Subject Name
                    </label>
                    <Input
                        placeholder="Subject Name"
                        size="large"
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="code" className="block text-base font-medium text-gray-700 mb-4">
                        รหัสวิชา
                    </label>
                    <Input
                        placeholder="รหัสวิชา "
                        size="large"
                        type="text"
                        name="code"
                        id="code"
                        required
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="day" className="block text-base font-medium text-gray-700 mb-4">
                        Day
                    </label>
                    <Select
                        placeholder="Select Day"
                        style={{ width: 200 }}
                        value={day}
                        required
                        onChange={(value) => setDay(value)}
                    >
                        <Select.Option value="mon">Monday</Select.Option>
                        <Select.Option value="tue">Tuesday</Select.Option>
                        <Select.Option value="wed">Wednesday</Select.Option>
                        <Select.Option value="thu">Thursday</Select.Option>
                        <Select.Option value="fri">Friday</Select.Option>
                        <Select.Option value="sat">Saturday</Select.Option>
                        <Select.Option value="sun">Sunday</Select.Option>
                    </Select>

                </div>
                <div>
                    <label htmlFor="group" className="block text-base font-medium text-gray-700 mb-4">
                        Group
                    </label>
                    <Input
                        placeholder="Group"
                        size="large"
                        type="text"
                        name="group"
                        id="group"
                        required
                        value={group}
                        onChange={(e) => setGroup(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="startTime" className="block text-base font-medium text-gray-700 mb-4">
                        Start Time
                    </label>
                    <TimePicker
                        placeholder="Start Time"
                        format="HH:mm"
                        required
                        value={starttime ? moment(starttime, 'HH:mm') : null}
                        onChange={(time) => setStartTime(time ? time.format('HH:mm') : '')}
                    />
                </div>
                <div>
                    <label htmlFor="endTime" className="block text-base font-medium text-gray-700 mb-4">
                        End Time
                    </label>
                    <TimePicker
                        placeholder="End Time"
                        format="HH:mm"
                        required
                        value={endtime ? moment(endtime, 'HH:mm') : null}
                        onChange={(time) => setEndTime(time ? time.format('HH:mm') : '')}
                    />
                </div>
                <div>
                    <label htmlFor="term" className="block text-base font-medium text-gray-700 mb-4">
                        Term
                    </label>
                    <Select
                        placeholder="Select term"
                        style={{ width: 200 }}
                        required
                        value={term}
                        onChange={(value) => setTerm(value)}
                    >
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                    </Select>
                </div>
                <div>
                    <label htmlFor="year" className="block text-base font-medium text-gray-700 mb-4">
                        Year
                    </label>
                    <Select
                        placeholder="Select year"
                        style={{ width: 200 }}
                        required
                        value={year}
                        onChange={(value) => setYear(value)}
                    >
                        {yearOptions}
                    </Select>
                </div>
                <div>
                    <Button className="inline-flex justify-center mr-4"
                        type="primary"
                        size="middle"
                        onClick={handleSubmit}
                        style={{ backgroundColor: '#00B96B', borderColor: '#00B96B' }}
                    >
                        Save
                    </Button>
                    <Button
                        className="inline-flex justify-center mr-4"
                        type="primary"
                        danger
                        size="middle"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>

                    <Button className="inline-flex justify-center mr-4"
                        onClick={handleBack}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );

};

export default EditSubject;
