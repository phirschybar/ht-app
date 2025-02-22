import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
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
        <div className="dashboard">
            <div className="month-navigation">
                <button 
                    onClick={() => handleMonthChange(dashboardData.prev_month)}
                    className="month-nav-button"
                >
                    ← Previous
                </button>
                <h2 className="current-month">{dashboardData.current_month_name}</h2>
                <button 
                    onClick={() => handleMonthChange(dashboardData.next_month)}
                    className="month-nav-button"
                >
                    Next →
                </button>
            </div>
            {/* Additional dashboard content will go here */}
        </div>
    );
};

export default Dashboard; 