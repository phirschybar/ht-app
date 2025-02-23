import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Dashboard" />

            <div className="py-0 bg-gray-900">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-gray-800 shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-100">
                            Hello World
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
