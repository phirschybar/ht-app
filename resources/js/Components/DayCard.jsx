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

    return (
        <>
            <div className="p-4 bg-white rounded-lg shadow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{day.name}</h3>
                    {day.is_editable && (
                        <button 
                            onClick={() => setIsEditModalOpen(true)}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>
                    )}
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span>{day.weight || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Exercise Rung:</span>
                        <span>{day.exercise_rung || '—'}</span>
                    </div>
                    {day.notes && (
                        <div className="mt-2 pt-2 border-t">
                            <p className="text-gray-600 text-sm">{day.notes}</p>
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