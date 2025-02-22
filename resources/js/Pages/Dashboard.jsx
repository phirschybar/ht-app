import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        days: [],
        current_month_name: '',
        prev_month: '',
        next_month: '',
        chartData: {}
    });

    const fetchDashboardData = async (date = '') => {
        try {
            const response = await axios.get(`/api/dashboard${date ? `/${date}` : ''}`);
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleMonthChange = (date) => {
        fetchDashboardData(date);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-0">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <button 
                                    onClick={() => handleMonthChange(dashboardData.prev_month)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    &lt;
                                </button>
                                <h2 className="text-xl font-semibold min-w-[200px] text-center">
                                    {dashboardData.current_month_name}
                                </h2>
                                <button 
                                    onClick={() => handleMonthChange(dashboardData.next_month)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    &gt;
                                </button>
                            </div>
                            {/* Additional dashboard content will go here */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
