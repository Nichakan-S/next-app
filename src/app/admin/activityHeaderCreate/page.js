'use client';

import React, { useState } from 'react';
import { SuccessAlert, WarningAlert } from '../../components/sweetalert';
import { Input, Button, Upload, Modal, Select, Col, Card, Row } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

const CreateActivityHeader = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [file, setFile] = useState('');
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [year, setYear] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [previewFile, setPreviewFile] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!start || !end) {
            WarningAlert('ผิดพลาด!', 'กรุณาเลือกเวลาเริ่มและเวลาสิ้นสุด!');
            return;
        }

        if (moment(end).isBefore(moment(start))) {
            WarningAlert('ผิดพลาด!', 'เวลาเริ่มต้องไม่เกินเวลาสิ้นสุด!');
            return;
        }

        try {
            const formattedStart = moment(start).format('YYYY-MM-DD HH:mm');
            const formattedEnd = moment(end).format('YYYY-MM-DD HH:mm');
            
            const response = await fetch('/api/activityHeader', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    type,
                    file,
                    start: formattedStart,
                    end: formattedEnd,
                    year: parseInt(year, 10)
                })
            });

            if (!response.ok) throw new Error('Something went wrong');

            SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกบันทึกแล้ว');

            setName('');
            setType('');
            setFile('');
            setStart(null);
            setEnd(null);
            setYear('');
            setPreviewFile('');
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };

    const customRequest = ({ file }) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setFile(reader.result);
            setPreviewFile(reader.result);
        };
    };

    const beforeUpload = (file) => {
        return file.type === 'application/pdf';
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6" style={{ color: "#2D427C" }}>เพิ่มกิจกรรม</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="max-w-6xl mx-auto px-4 py-8 shadow-xl">
                    <Row gutter={16}>
                        <Col span={12}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <label htmlFor="name" className="block text-base font-medium mr-4 mb-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ชื่อกิจกรรม : </span>
                                    </label>
                                    <Input
                                        placeholder="ชื่อกิจกรรม"
                                        size="large"
                                        name="name"
                                        id="name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="flex-grow mr-4 mb-4"
                                        style={{
                                            flexGrow: 1,
                                            flexShrink: 1,
                                            flexBasis: '50%',
                                            padding: '8px',
                                            minWidth: '300px'
                                        }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                    <label htmlFor="type" className="block text-base font-medium mr-4 mb-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ประเภท : </span>
                                    </label>
                                    <Select
                                        value={type}
                                        size="large"
                                        onChange={(value) => setType(value)}
                                        required
                                        className="flex-grow mr-4 mb-4 custom-select"
                                        style={{
                                            width: '50%',
                                            borderColor: '#DADEE9',
                                            fontSize: '16px',
                                            height: '40px'
                                        }}
                                    >
                                        <Select.Option value="">เลือกประเภท</Select.Option>
                                        <Select.Option value="culture">ศิลปะวัฒนธรรม</Select.Option>
                                        <Select.Option value="service">บริการวิชาการ</Select.Option>
                                        <Select.Option value="other">อื่น ๆ</Select.Option>
                                    </Select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <label htmlFor="start" className="block text-base font-medium mr-4 mb-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> เวลาเริ่ม : </span>
                                    </label>
                                    <DatePicker
                                        selected={start}
                                        onChange={(date) => setStart(date)}
                                        showTimeSelect
                                        dateFormat="dd-MM-yyyy HH:mm"
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        required
                                        calendarClassName="border rounded-lg shadow-md"
                                        className="w-full border rounded-lg py-2 px-4 flex-grow mr-4 mb-4"
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <label htmlFor="end" className="block text-base font-medium mr-4 mb-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> สิ้นสุดเวลา : </span>
                                    </label>
                                    <DatePicker
                                        selected={end}
                                        onChange={(date) => setEnd(date)}
                                        showTimeSelect
                                        dateFormat="dd-MM-yyyy HH:mm"
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        required
                                        calendarClassName="border rounded-lg shadow-md"
                                        className="w-full border rounded-lg py-2 px-4 flex-grow mr-4 mb-4"
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                                    <label htmlFor="year" className="block text-base font-medium mr-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ปี : </span>
                                    </label>
                                    <Input
                                        placeholder="เลือกปี"
                                        size="large"
                                        type="number"
                                        name="year"
                                        id="year"
                                        required
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        style={{ width: 200 }}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <label htmlFor="file" className="block text-base font-medium mr-4 mb-4">
                                        <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ไฟล์ PDF : </span>
                                    </label>
                                    <Upload
                                        customRequest={customRequest}
                                        beforeUpload={beforeUpload}
                                        showUploadList={false}
                                    >
                                        <Button
                                            icon={<UploadOutlined />}
                                            className="mr-4 mb-4">เลือกไฟล์</Button>
                                    </Upload>
                                    <Button onClick={() => setModalVisible(true)} className="mr-4 mb-4">ดูตัวอย่างไฟล์ PDF</Button>
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
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '102%', padding: '15px' }}>
                                <Button
                                    className="inline-flex justify-center mr-4"
                                    type="primary"
                                    size="middle"
                                    htmlType="submit"
                                    style={{ backgroundColor: '#00B96B', borderColor: '#00B96B' }}
                                >
                                    บันทึก
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </form>
        </div>
    );
};

export default CreateActivityHeader;