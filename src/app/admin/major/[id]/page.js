'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SuccessAlert, WarningAlert, ConfirmAlert } from '../../../components/sweetalert';
import { Select , Input , Button , Card , message } from 'antd';
import '/src/app/globals.css'


const EditMajor = ({ params }) => {
    const [majorName, setMajorName] = useState('');
    const [faculty, setFaculty] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const router = useRouter();
    const { id } = params;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                
                const facultyResponse = await fetch('/api/faculty');
                if (!facultyResponse.ok) throw new Error('Failed to fetch faculties');
                const facultyData = await facultyResponse.json();
                setFaculty(facultyData);

                const majorResponse = await fetch(`/api/major/${id}`);
                if (!majorResponse.ok) throw new Error('Failed to fetch major');
                const majorData = await majorResponse.json();
                setMajorName(majorData.majorName);
                setSelectedFaculty(majorData.facultyId);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const facultyIdAsNumber = parseInt(selectedFaculty);
            if (isNaN(facultyIdAsNumber)) {
                throw new Error('Invalid faculty ID');
            }
            const response = await fetch(`/api/major/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    facultyId: facultyIdAsNumber, majorName,
                }),
            });

            if (!response.ok) throw new Error('Failed to update Major');
            SuccessAlert('สำเร็จ!', 'ข้อมูลถูกอัปเดตเรียบร้อยแล้ว');
            router.push('/admin/major');
        } catch (error) {
            console.error(error);
            WarningAlert('ผิดพลาด!', 'ไม่สามารถบันทึกข้อมูลได้');
        }
    };

    const handleDelete = async () => {
        ConfirmAlert('คุณแน่ใจที่จะลบข้อมูลนี้?', 'การดำเนินการนี้ไม่สามารถย้อนกลับได้', async () => {
            try {
                const response = await fetch(`/api/major/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'เนื่องจากสาขาถูกใช้งานอยู่');
                }
                SuccessAlert('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว');
                router.push('/admin/major');
            } catch (error) {
                console.error('ไม่สามารถลบข้อมูลสาขาได้ เนื่องจากสาขาถูกใช้งานอยู่', error);
                message.error(`ไม่สามารถลบข้อมูลได้ : ${error.message}`);
            }
        });
    };
    

    const handleBack = () => {
        router.push('/admin/major');
    };

    const handleChange = (value) => {
        setSelectedFaculty(value);
        console.log(`selected ${value}`);
    };

    const facultyOptions = faculty.map(fac => ({
        label: fac.facultyName,
        value: fac.id,
        disabled: fac.disabled
    }));

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
        <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-semibold mb-6">แก้ไขชื่อสาขา {majorName}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
            <Card
                className="max-w-6xl mx-auto px-4 py-8 shadow-xl"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
                            <label htmlFor="facultyName" className="block mr-4 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> เลือกคณะ : </span>
                            </label>
                            <Select
                                defaultValue={selectedFaculty}
                                className="flex-grow mr-4 mb-4 custom-select"
                                size='large'
                                style={{
                                    flexBasis: '0%',
                                    flexGrow: 1,
                                    width: '100%',
                                    borderColor: '#DADEE9',
                                    fontSize: '16px',
                                    height: '40px',
                                    minWidth: '300px'
                                }}
                                onChange={handleChange}
                                options={[{ value: '', alignItems: 'center', label: 'กรุณาเลือกคณะ', disabled: true }, ...facultyOptions]}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <label className="block mr-7 mb-4">
                                <span style={{ fontSize: '16px' }}><span style={{ color: 'red' }}>*</span> ชื่อสาขา : </span>
                            </label>
                            <Input
                                placeholder="ชื่อสาขา"
                                size="large"
                                name="majorName"
                                id="majorName"
                                required
                                value={majorName}
                                onChange={(e) => setMajorName(e.target.value)}
                                className="flex-grow mr-4 mb-4"
                                showCount
                                maxLength={50}
                                style={{
                                    flexGrow: 1,
                                    flexShrink: 1,
                                    flexBasis: '50%',
                                    minWidth: '300px',
                                    fontSize: '16px',
                                    height: '40px'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' , padding: '8px 0' }}>
                            <Button className="inline-flex justify-center"
                                type="primary"
                                size="middle"
                                onClick={handleSubmit}
                                style={{ backgroundColor: '#02964F', borderColor: '#02964F', marginRight: '8px' }}
                            >
                                บันทึก
                            </Button>
                            <Button className="inline-flex justify-center"
                                type="primary" danger
                                size="middle"
                                onClick={handleDelete}
                                style={{ backgroundColor: '#E50000', borderColor: '#E50000', marginRight: '8px' }}
                            >
                                ลบ
                            </Button>
                            <Button className="inline-flex justify-center"
                                onClick={handleBack}
                                style={{ marginRight: '15px' }}
                            >
                                ยกเลิก
                            </Button>
                        </div>
                    </div>
                </Card>

            </form>
        </div>
    );
};

export default EditMajor;
