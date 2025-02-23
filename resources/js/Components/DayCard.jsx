import { useState } from 'react';
import EditDayModal from '@/Components/EditDayModal';

export default function DayCard({ day, onDayUpdate }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleSave = async (updatedData) => {
        // Update each field separately
        const fields = ['weight', 'exercise_rung', 'notes'];
        
        for (const field of fields) {
            if (updatedData[field] !== day[field]) {  // Only update if value has changed
                await onDayUpdate({
                    date: day.date,
                    field: field,
                    value: updatedData[field]
                });
            }
        }
        
        setIsEditModalOpen(false);
    };

    // Helper function to format the variation with a sign and color
    const renderVariation = () => {
        if (!day.variation) return null;
        
        const isPositive = day.variation > 0;
        const color = isPositive ? 'text-red-400' : 'text-green-400';
        
        return (
            <span className={color}>
                {isPositive ? '↑' : '↓'}{Math.abs(day.variation.toFixed(1))}
            </span>
        );
    };

    return (
        <>
            <div 
                className={`p-4 rounded-lg shadow-lg border border-gray-600 ${
                    day.is_editable 
                        ? 'bg-gray-700 cursor-pointer hover:bg-gray-600 transition-colors duration-200' 
                        : 'bg-gray-800 opacity-75'
                }`}
                onClick={() => day.is_editable && setIsEditModalOpen(true)}
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-100">{day.name}</h3>
                    {day.is_editable && (
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
                    )}
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Weight:</span>
                        <span className="text-gray-100">{day.weight || '—'}</span>
                    </div>
                    {day.weight && day.trend && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">Trend:</span>
                            <div className="flex items-baseline gap-2">
                                {renderVariation()}
                                <span className="text-blue-400">
                                    {day.trend.toFixed(1)}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-gray-400">Exercise Rung:</span>
                        <span className="text-gray-100">{day.exercise_rung || '—'}</span>
                    </div>
                    {day.notes && (
                        <div className="mt-2 pt-2 border-t border-gray-600">
                            <p className="text-gray-300 text-sm">{day.notes}</p>
                        </div>
                    )}
                </div>
            </div>

            <EditDayModal
                isOpen={isEditModalOpen}
                closeModal={() => setIsEditModalOpen(false)}
                day={day}
                onSave={handleSave}
            />
        </>
    );
} 