import { Fragment, useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function EditDayModal({ isOpen, closeModal, day, onSave }) {
    const weightInputRef = useRef(null);
    const [formData, setFormData] = useState({
        weight: day.weight || '',
        exercise_rung: day.exercise_rung || '',
        notes: day.notes || ''
    });

    useEffect(() => {
        if (isOpen && weightInputRef.current) {
            setTimeout(() => {
                weightInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        setFormData({
            weight: day.weight || '',
            exercise_rung: day.exercise_rung || '',
            notes: day.notes || ''
        });
    }, [day]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Handle numeric fields
        if (name === 'weight' || name === 'exercise_rung') {
            // Allow empty string or valid numbers
            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        } else {
            // Handle notes normally
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            date: day.date,
            weight: formData.weight === '' ? null : parseFloat(formData.weight),
            exercise_rung: formData.exercise_rung === '' ? null : parseFloat(formData.exercise_rung),
            notes: formData.notes || null,
            month: day.date.substring(0, 7)
        });
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog 
                as="div" 
                className="relative z-10" 
                onClose={closeModal}
                initialFocus={weightInputRef}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-100 mb-4"
                                >
                                    Edit {day.name}
                                </Dialog.Title>
                                <form onSubmit={handleSubmit} autoComplete="off">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300">
                                                Weight
                                            </label>
                                            <input
                                                ref={weightInputRef}
                                                type="text"
                                                name="weight"
                                                value={formData.weight}
                                                onChange={handleInputChange}
                                                placeholder="Enter weight"
                                                autoComplete="off"
                                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300">
                                                Exercise Rung
                                            </label>
                                            <input
                                                type="text"
                                                name="exercise_rung"
                                                value={formData.exercise_rung}
                                                onChange={handleInputChange}
                                                placeholder="Enter rung number"
                                                autoComplete="off"
                                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300">
                                                Notes
                                            </label>
                                            <textarea
                                                name="notes"
                                                rows={3}
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                placeholder="Add notes"
                                                autoComplete="off"
                                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="inline-flex justify-center rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 