import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DayCard from '@/Components/DayCard';
import WeightTrendChart from '@/Components/WeightTrendChart';

export default function Logs({ auth }) {
    const [dashboardData, setDashboardData] = useState({
        days: [],
        current_month_name: '',
        prev_month: '',
        next_month: '',
        chartData: {}
    });

    const fetchDashboardData = async (date = '') => {
        try {
            const response = await axios.get(`/api/logs${date ? `/${date}` : ''}`);
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching logs data:', error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleMonthChange = (date) => {
        fetchDashboardData(date);
    };

    const handleDayUpdate = async (dayData) => {
        try {
            
            if (dayData.field && dayData.value !== undefined) {
                await axios.post('/api/logs/update-day', {
                    date: dayData.date,
                    field: dayData.field,
                    value: dayData.value
                });
            } else {
                const updatePromises = [];
                
                if (dayData.weight !== undefined) {
                    updatePromises.push(
                        axios.post('/api/logs/update-day', {
                            date: dayData.date,
                            field: 'weight',
                            value: dayData.weight
                        })
                    );
                }
                
                if (dayData.exercise_rung !== undefined) {
                    updatePromises.push(
                        axios.post('/api/logs/update-day', {
                            date: dayData.date,
                            field: 'exercise_rung',
                            value: dayData.exercise_rung
                        })
                    );
                }
                
                if (dayData.notes !== undefined) {
                    updatePromises.push(
                        axios.post('/api/logs/update-day', {
                            date: dayData.date,
                            field: 'notes',
                            value: dayData.notes
                        })
                    );
                }
                
                await Promise.all(updatePromises);
            }
            
            const month = dayData.month || dayData.date.substring(0, 7);
            await fetchDashboardData(month);
            
        } catch (error) {
            console.error('Error updating day:', error.response?.data || error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Dashboard" />

            <div className="py-0 bg-gray-900">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-gray-800 shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between w-full mb-6">
                                <button 
                                    onClick={() => handleMonthChange(dashboardData.prev_month)}
                                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
                                >
                                    &lt;
                                </button>
                                <h2 className="text-xl font-semibold text-center text-gray-100">
                                    {dashboardData.current_month_name}
                                </h2>
                                <button 
                                    onClick={() => handleMonthChange(dashboardData.next_month)}
                                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
                                >
                                    &gt;
                                </button>
                            </div>

                            <div className="mb-0">
                                {dashboardData.days && <WeightTrendChart days={dashboardData.days} />}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {dashboardData.days && dashboardData.days.map((day) => (
                                    <DayCard 
                                        key={day.date} 
                                        day={day} 
                                        onDayUpdate={handleDayUpdate}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 