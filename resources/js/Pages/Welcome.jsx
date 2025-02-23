import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useState } from 'react';

export default function Welcome({ auth }) {
    const [showMore, setShowMore] = useState(false);

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-900 text-white/50">
                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    <div className="relative w-full max-w-2xl px-6">
                        {/* Centered Logo */}
                        <div className="flex justify-center mt-6">
                            <ApplicationLogo className="block h-32 w-auto fill-current text-gray-200" />
                        </div>

                        <main>
                            <div className="rounded-lg bg-gray-800 p-6">
                                <p className="text-white/70">
                                    <strong>HackTrack</strong> is a simple weight tracking app based on <a href="https://www.fourmilab.ch/hackdiet/" className="text-blue-400 hover:text-blue-300">The Hacker's Diet</a> by <a href="https://en.wikipedia.org/wiki/John_Walker_(programmer)" className="text-blue-400 hover:text-blue-300">John Walker</a>, founder of Autodesk.
                                </p>
                                <p className="text-white/70 pt-4">The Hacker's Diet approaches weight loss as an <strong>engineering problem</strong>. The process is simple:</p>
                                <ul className="list-disc text-white/70 p-4 space-y-2">
                                    <li>
                                        Weigh yourself every day
                                    </li>
                                    <li>
                                        Get regular, instant feedback on your progress
                                    </li>
                                    <li>
                                        Adjust your caloric intake as needed to achieve your goals
                                    </li>
                                    <li>
                                        Get early warning signs of plateauing or digression
                                    </li>
                                </ul>
                                
                                {showMore && (
                                    <div className="text-white/70 pt-4">
                                        <p className="mb-4">
                                            The key insight is that your weight naturally fluctuates day-to-day due to water retention, digestive status, and other factors. By tracking daily and using a moving average, we can see through the noise to identify real trends in weight change.
                                        </p>
                                        <p>
                                            This app provides the tools you need to track your weight, visualize trends, and make data-driven decisions about your health journey.
                                        </p>
                                    </div>
                                )}
                                
                                <p className="text-white/70 pt-2 text-center">
                                    <button 
                                        onClick={() => setShowMore(!showMore)}
                                        className="text-blue-400 hover:text-blue-300"
                                    >
                                        {showMore ? 'Show Less' : 'Read More'}
                                    </button>
                                </p>
                            </div>

                            {/* Auth Buttons */}
                            <div className="mt-8 flex justify-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF2D20]"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF2D20]"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF2D20]"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
