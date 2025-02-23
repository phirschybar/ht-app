import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { streakLevels } from '@/utils/streakEmoji';

export default function StreakInfoModal({ isOpen, closeModal, currentStreak }) {
    // Find current level and next level
    const currentLevel = [...streakLevels]
        .reverse()
        .find(level => currentStreak >= level.threshold);
    
    const nextLevel = streakLevels.find(level => level.threshold > currentStreak);
    
    const daysUntilNext = nextLevel 
        ? nextLevel.threshold - currentStreak
        : 0;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                                    Streak Level Progress
                                </Dialog.Title>
                                
                                <div className="mt-2">
                                    <p className="text-gray-300 text-2xl mb-4">
                                        Current Level: {currentLevel.emoji}
                                        <span className="text-base ml-2">({currentStreak} days)</span>
                                    </p>
                                    
                                    {nextLevel && (
                                        <p className="text-gray-400">
                                            {daysUntilNext} days until {nextLevel.emoji}
                                        </p>
                                    )}
                                    
                                    <div className="mt-6 border-t border-gray-700 pt-4">
                                        <h4 className="text-gray-300 mb-2">Achievement Levels:</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {streakLevels.map((level, index) => {
                                                let emoji;
                                                if (currentStreak >= level.threshold) {
                                                    emoji = level.emoji; // Show achieved level
                                                } else if (level === nextLevel) {
                                                    emoji = level.emoji; // Show next level
                                                } else if (currentStreak < level.threshold) {
                                                    emoji = '❓'; // Mystery level
                                                }
                                                
                                                return (
                                                    <div 
                                                        key={index}
                                                        className={`p-2 rounded ${currentStreak >= level.threshold ? 'bg-gray-700' : 'bg-gray-900'}`}
                                                    >
                                                        <span className="mr-2">{emoji}</span>
                                                        <span className="text-gray-400">{level.threshold}+ days</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={closeModal}
                                    >
                                        Got it!
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 