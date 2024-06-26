'use client'
import React, { useEffect, useState } from 'react';
import { Select, Empty, Card } from 'antd';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const { Option } = Select;

const WorkArchive = () => {
    const [overview, setOverview] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedYears, setSelectedYears] = useState([]);
    const [years, setYears] = useState([]);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetchOverview();
    }, []);

    useEffect(() => {
        if (overview.length > 0) {
            const uniqueYears = Array.from(new Set(overview.map(item => item.year)));
            setYears(uniqueYears);
            setSelectedYears(uniqueYears.slice(0, 2));
        }
    }, [overview]);

    useEffect(() => {
        if (overview.length > 0 && selectedYears.length > 0) {
            generateChartData();
        }
    }, [overview, selectedYears]);

    const fetchOverview = async () => {
        try {
            const res = await fetch('/api/userWorkArchive');
            const data = await res.json();
            setOverview(data);
        } catch (error) {
            console.error('Failed to fetch Overview', error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateChartData = () => {
        const colors = [
            'rgba(75,192,192,1)',
            'rgba(255,99,132,1)',
            'rgba(54,162,235,1)',
            'rgba(255,206,86,1)',
            'rgba(75,192,192,1)',
            'rgba(153,102,255,1)',
            'rgba(255,159,64,1)',
        ];

        const datasets = selectedYears.map((year, index) => {
            const filteredData = overview.filter(item => item.year === year);
            const months = Array.from({ length: 12 }, (_, i) => i + 1);
            const dataCounts = months.map(month =>
                filteredData.filter(item => new Date(item.createdAt).getMonth() + 1 === month).length
            );

            return {
                label: `Data for ${year}`,
                data: dataCounts,
                fill: false,
                backgroundColor: colors[index % colors.length],
                borderColor: colors[index % colors.length],
            };
        });

        setChartData({
            labels: Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('en', { month: 'short' })),
            datasets,
        });
    };

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
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold ml-4">กราฟผลงานทั้งหมด</h1>
            </div>
            <Card className="max-w-6xl mx-4 px-2 shadow-2xl">
                {chartData ? (
                    <div className="h-80 w-full flex">
                        <Line data={chartData} options={{ maintainAspectRatio: false }} />
                    </div>
                ) : (
                    <Empty description="No Data" />
                )}
                {years.length > 0 ? (
                    <Select
                        mode="multiple"
                        value={selectedYears}
                        style={{ marginTop: 20, minWidth: 100}}
                        onChange={setSelectedYears}
                    >
                        {years.map(year => (
                            <Option key={year} value={year}>{year}</Option>
                        ))}
                    </Select>
                ) : (
                    <Empty description="No years available" />
                )}
            </Card>
        </div>
    );
};

export default WorkArchive;
