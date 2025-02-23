import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeightTrendChart from '@/Components/WeightTrendChart';
import EditDayModal from '@/Components/EditDayModal';

export default function Dashboard({ auth }) {
    const [dashboardData, setDashboardData] = useState({
        days: [],
        stats: {}
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const handleDayUpdate = async ({ date, field, value }) => {
        try {
            await axios.post('/api/logs/update-day', {
                date,
                field,
                value
            });
            fetchDashboardData(); // Refresh dashboard data after update
        } catch (error) {
            console.error('Error updating day:', error);
        }
    };

    const handleSave = async (updatedData) => {
        const fields = ['weight', 'exercise_rung', 'notes'];
        const today = new Date().toISOString().split('T')[0];
        
        for (const field of fields) {
            if (updatedData[field] !== dashboardData.stats?.today?.[field]) {
                await handleDayUpdate({
                    date: today,
                    field: field,
                    value: updatedData[field]
                });
            }
        }
        
        setIsEditModalOpen(false);
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
                        <div className="p-6 pt-4">
                            {/* Chart Section */}
                            <div className="mb-0">
                                <h2 className="mb-0 text-xl font-semibold text-center text-gray-100">Last 30 Days</h2>
                                {dashboardData.days && dashboardData.days.length > 0 && (
                                    <WeightTrendChart days={dashboardData.days} />
                                )}
                            </div>

                            {/* Stats Section */}
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                <div 
                                    className="a-stat p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors duration-200 min-h-[140px]"
                                    onClick={() => setIsEditModalOpen(true)}
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-gray-400 text-xs md:text-base">Weight for {new Date().toLocaleDateString('en-US', {month: 'numeric', day: 'numeric'})}</h3>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsEditModalOpen(true);
                                            }}
                                            className="text-blue-400 hover:text-blue-300"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-100 text-3xl mt-2">{dashboardData.stats?.current_weight || ''}</span>
                                        </div>
                                        {dashboardData.stats?.current_weight && dashboardData.stats?.current_trend && (
                                            <div className="flex justify-between">
                                                <div className="flex items-baseline gap-2 text-1xl">
                                                    <span className="text-blue-400">
                                                        {dashboardData.stats.current_trend.toFixed(1)}
                                                    </span>
                                                    {dashboardData.stats.current_variation && (
                                                        <span className={dashboardData.stats.current_variation > 0 ? 'text-red-400' : 'text-green-400'}>
                                                            {dashboardData.stats.current_variation > 0 ? '↑' : '↓'}
                                                            {Math.abs(dashboardData.stats.current_variation.toFixed(1))}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="a-stat p-4 bg-gray-700 rounded-lg min-h-[140px]">
                                    <h3 className="text-gray-400 text-xs md:text-base">Trend Streak</h3>
                                    <p className="text-3xl mt-2 text-white">
                                        24d &nbsp;🔥
                                    </p>
                                </div>
                                <div className="a-stat p-4 bg-gray-700 rounded-lg min-h-[140px]">
                                    <h3 className="text-gray-400 text-xs md:text-base">30-Day Change</h3>
                                    <p className="text-3xl mt-2 text-white">
                                        <span className="text-green-400">↓</span> 1.2 lbs
                                    </p>
                                </div>
                                <div className="a-stat p-4 bg-gray-700 rounded-lg min-h-[140px]">
                                    <h3 className="text-gray-400 text-xs md:text-base">Body Mass Index</h3>
                                    <p className="text-3xl mt-2 text-white">
                                         25.9 &nbsp;<span className="text-orange-400">🟡</span>
                                    </p>
                                </div>
                                <div className="a-stat p-4 bg-gray-700 rounded-lg min-h-[140px]">
                                    <h3 className="text-gray-400 text-xs md:text-base">Daily Calorie Deficit</h3>
                                    <p className="text-3xl mt-2 text-white">
                                        <span className="text-green-400">↓</span> 1,200
                                    </p>
                                </div>
                                <div className="a-stat p-4 bg-gray-700 rounded-lg min-h-[140px]">
                                    <h3 className="text-gray-400 text-xs md:text-base">Avg Weekly Loss</h3>
                                    <p className="text-3xl mt-2 text-white">
                                        <span className="text-green-400">↓</span> 0.4 lbs
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <EditDayModal
                isOpen={isEditModalOpen}
                closeModal={() => setIsEditModalOpen(false)}
                day={{
                    date: new Date().toISOString().split('T')[0],
                    name: new Date().toLocaleDateString('en-US', {month: 'numeric', day: 'numeric'}),
                    weight: dashboardData.stats?.current_weight || null,
                    exercise_rung: dashboardData.stats?.today?.exercise_rung || null,
                    notes: dashboardData.stats?.today?.notes || '',
                    is_editable: true
                }}
                onSave={handleSave}
            />
        </AuthenticatedLayout>
    );
}
