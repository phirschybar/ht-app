import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeightTrendChart from '@/Components/WeightTrendChart';

export default function Dashboard({ auth }) {
    const [dashboardData, setDashboardData] = useState({
        days: [],
        stats: {}
    });

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="py-0 sm:mt-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-gray-800 shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Chart Section */}
                            <div className="mb-6">
                                <h2 className="mb-4 text-xl font-semibold text-center text-gray-100">Last 30 Days</h2>
                                {dashboardData.days && dashboardData.days.length > 0 && (
                                    <WeightTrendChart days={dashboardData.days} />
                                )}
                            </div>

                            {/* Stats Section */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="p-4 bg-gray-700 rounded-lg">
                                    <h3 className="text-gray-400">Current Weight</h3>
                                    <p className="text-2xl text-white">
                                        {dashboardData.stats?.current_weight || '-'} kg
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-700 rounded-lg">
                                    <h3 className="text-gray-400">Days Logged</h3>
                                    <p className="text-2xl text-white">
                                        {dashboardData.stats?.total_days_logged || '0'}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-700 rounded-lg">
                                    <h3 className="text-gray-400">30-Day Change</h3>
                                    <p className="text-2xl text-white">
                                        {dashboardData.stats?.weight_change ? `${dashboardData.stats.weight_change > 0 ? '+' : ''}${dashboardData.stats.weight_change} kg` : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
