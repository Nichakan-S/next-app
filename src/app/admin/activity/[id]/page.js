'use client'

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { SuccessAlert, WarningAlert } from '../../../components/sweetalert';
import { Select, Button, Modal, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const EditActivity = ({ params }) => {
    const { id } = params;
    const { data: session } = useSession();
    const [file, setFile] = useState('');
    const [activity, setActivity] = useState([]);
    const [activityData, setActivityData] = useState(null);
    const [audit] = useState('wait');
    const [approve] = useState('wait');
    const [activityRole, setActivityRole] = useState('joiner');
    const [previewFile, setPreviewFile] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState('');

    useEffect(() => {
        const fetchActivity = async () => {
            const response = await fetch('/api/activityHeader');
            const data = await response.json();
            setActivity(data);
        };

        const fetchActivityData = async () => {
            const response = await fetch(`/api/activity/${id}`);
            const data = await response.json();
            setActivityData(data);
            setSelectedActivity(data.activityId);
            setActivityRole(data.activityRole);
            setFile(data.file);
            setPreviewFile(data.file);
        };

        fetchActivity();
        fetchActivityData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedActivity) {
            WarningAlert('ผิดพลาด!', 'กรุณาเลือกกิจกรรม');
            return;
        }

        try {
            const response = await fetch(`/api/activity/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ activityRole, activityId: selectedActivity, userId: session.user.id, file, audit, approve })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');
            setFile('');
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };

    const handleChange = (value) => {
        setSelectedActivity(value);
        console.log(`selected ${value}`);
    };

    const beforeUpload = (file) => {
        const isPDF = file.type === 'application/pdf';
        const isLt30M = file.size / 1024 / 1024 < 30;
        if (!isPDF) {
            WarningAlert('ผิดพลาด!', 'กรุณาอัปโหลดไฟล์ PDF เท่านั้น!');
        }
        if (!isLt30M) {
            WarningAlert('ผิดพลาด!', 'ไฟล์ต้องมีขนาดไม่เกิน 30 MB!');
        }
        return isPDF && isLt30M;
    };

    const customRequest = ({ file }) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setFile(reader.result);
            setPreviewFile(reader.result);
        };
    };

    const handleBack = () => {
        window.history.back();
    };

    const activityOptions = activity.map(fac => ({
        label: fac.name,
        value: fac.id,
        disabled: fac.disabled
    }));

    if (!activityData) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="mt-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6" style={{ color: "#2D427C" }}>แก้ไขกิจกรรม</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="activity" className="block text-base font-medium text-gray-700 mr-2 mb-4">
                        เลือกกิจกรรม
                    </label>
                    <Select
                        value={selectedActivity}
                        style={{ width: '100%' }}
                        size="large"
                        onChange={handleChange}
                        options={activityOptions}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                    <label htmlFor="activityRole" className="block text-base font-medium mr-4 mb-4">
                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> หน้าที่ : </span>
                    </label>
                    <Select
                        value={activityRole}
                        size="large"
                        onChange={(value) => setActivityRole(value)}
                        required
                        className="flex-grow mr-4 mb-4 custom-select"
                        style={{
                            width: '50%',
                            borderColor: '#DADEE9',
                            fontSize: '16px',
                            height: '40px'
                        }}
                    >
                        <Option value="joiner">ผู้เข้าร่วม</Option>
                        <Option value="operator">ผู้ดำเนินงาน</Option>
                    </Select>
                </div>
                <div>
                    <label htmlFor="file" className="block text-base font-medium text-gray-700 mb-4">
                        ไฟล์ PDF
                    </label>
                    <Upload
                        customRequest={customRequest}
                        beforeUpload={beforeUpload}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
                    </Upload>
                    <Button onClick={() => setModalVisible(true)}>ดูตัวอย่างไฟล์ PDF</Button>
                    <Modal
                        title="ตัวอย่างไฟล์ PDF"
                        open={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        footer={[]}
                        width="70%"
                        style={{ top: 20 }}
                    >
                        {previewFile && (
                            <embed src={previewFile} type="application/pdf" style={{ width: '100%', height: '75vh' }} />
                        )}
                    </Modal>
                </div>
                <div>
                    <Button className="inline-flex justify-center mr-4 "
                        type="primary"
                        size="middle"
                        onClick={handleSubmit}
                        style={{ backgroundColor: '#00B96B', borderColor: '#00B96B' }}
                    >
                        บันทึก
                    </Button>
                    <Button className="inline-flex justify-center mr-4"
                        onClick={handleBack}
                    >
                        ยกเลิก
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditActivity;
