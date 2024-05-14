'use client'

import React, { useEffect, useState } from 'react'
import { Button, Input, Modal, Select } from 'antd';
import { SuccessAlert, WarningAlert, EvaluationAlert } from '../../../components/sweetalert';

const ResearchType = {
    journalism: 'ผ่านสื่อ',
    researchreports: 'เล่มตีพิมพ์',
    posterpresent: 'โปสเตอร์'
};
const Status = {
    wait: 'รอ',
    pass: 'ผ่าน',
    fail: 'ไม่ผ่าน'
};

const ResearchList = () => {
    const [research, setResearch] = useState([])
    const [searchTerm, setSearchTerm] = useState('รอ');
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        fetchresearch()
    }, [])

    const fetchresearch = async () => {
        try {
            const res = await fetch('/api/research')
            const data = await res.json()
            console.log('research data fetched:', data);
            setResearch(data)
        } catch (error) {
            console.error('Failed to fetch research', error)
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async (status, id) => {
        EvaluationAlert('ยืนยันการประเมิน', 'คุณแน่ใจหรือไม่ที่จะทำการประเมินผลงานนี้?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    console.log(status, id)
                    try {
                        const response = await fetch(`/api/evaluateReseardh/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ status })
                        });
                        if (!response.ok) throw new Error('Something went wrong');
                        SuccessAlert('สำเร็จ!', 'ข้อมูลได้ถูกประเมินแล้ว');
                        fetchresearch();
                    } catch (error) {
                        console.error(error);
                        WarningAlert('ผิดพลาด!', 'ไม่สามารถประเมินข้อมูลได้');
                    }
                }
            }).catch((error) => {
                console.error('Promise error:', error);
            });
    };

    const showModal = (file, id) => {
        setModalContent({ file, id });
        console.log(file, id);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const filteredresearch = research.filter((research) => {
        return research.nameTH.toLowerCase().includes(searchTerm.toLowerCase()) ||
            research.researchfund.toLowerCase().includes(searchTerm.toLowerCase()) ||
            research.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            research.year.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            Status[research.status].includes(searchTerm.toLowerCase());
    });

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold mb-6">ผลงานวิจัย</h1>
                <div className="flex items-center">
                    <Select
                        value={searchTerm}
                        onChange={(value) => setSearchTerm(value)}
                        className="flex-grow mr-4 "
                        style={{
                            flexBasis: '0%',
                            flexGrow: 1,
                            width: '100%',
                            borderColor: '#DADEE9',
                            minWidth: '100px'
                        }}
                        options={[
                            { value: 'รอ', label: 'รอ' },
                            { value: 'ผ่าน', label: 'ผ่าน' },
                            { value: 'ไม่ผ่าน', label: 'ไม่ผ่าน' }
                        ]}
                    />
                    <Input
                        type="text"
                        placeholder="ค้นหาผลงานวิจัย..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow mr-2"
                    />
                </div>
            </div>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-gray-50 ">
                        <tr>
                            <th scope="col" className="w-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่องานวิจัย</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ทุน</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ปีที่ตีพิมพ์</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้ใช้</th>
                            <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ไฟล์</th>
                        </tr>
                    </thead>
                </table>
                <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full">
                        <tbody className="divide-y divide-gray-200">
                            {filteredresearch.length > 0 ? (
                                filteredresearch.map((research, index) => (
                                    <tr key={research.id}>
                                        <td className="w-1 px-6 py-4 whitespace-nowrap">
                                            {index + 1}
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {research.nameTH}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {research.researchfund}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {ResearchType[research.type]}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {research.year}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {Status[research.status]}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {research.user?.username}
                                            </div>
                                        </td>
                                        <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                                            <Button
                                                onClick={() => showModal(research.file, research.id)}
                                                type="link"
                                                style={{ color: '#FFD758' }}
                                            >
                                                เปิดไฟล์
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        ไม่มีข้อมูล
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Modal
                    title="Preview File"
                    open={isModalVisible}
                    onCancel={closeModal}
                    footer={[
                        <div key="footer" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Button key="download" type="primary" href={modalContent.file} target="_blank" download>
                                ดาวน์โหลด PDF
                            </Button>
                            <div>
                                <Button
                                    type="primary"
                                    className="mr-2"
                                    style={{ backgroundColor: '#02964F', borderColor: '#02964F' }}
                                    onClick={() => handleSubmit('pass', modalContent.id)}
                                >
                                    ผ่าน
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    className="mr-2"
                                    style={{ backgroundColor: '#E50000', borderColor: '#E50000' }}
                                    onClick={() => handleSubmit('fail', modalContent.id)}
                                >
                                    ไม่ผ่าน
                                </Button>
                                <Button key="cancel" onClick={closeModal}>
                                    ยกเลิก
                                </Button>
                            </div>
                        </div>
                    ]}
                    width="70%"
                    style={{ top: 20 }}
                >
                    {modalContent ? (
                        <iframe src={modalContent.file} loading="lazy" style={{ width: '100%', height: '75vh' }}></iframe>
                    ) : (
                        <p>Error displaying the document. Please try again.</p>
                    )}
                </Modal>
            </div>
        </div>
    )
}

export default ResearchList
