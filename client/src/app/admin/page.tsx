"use client";

import ImageUploader from '@/components/ImageUploader';
import ServiceImageManager from '@/components/ServiceImageManager';
import { Lock, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setAuthorized(true);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (!authorized) {
        return null; // Don't render anything while checking/redirecting
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600 mb-4">Manage website content and uploads.</p>
                    <button onClick={handleLogout} className="text-sm text-red-500 hover:underline flex items-center justify-center gap-1 mx-auto">
                        <LogOut size={16} /> Logout
                    </button>
                </div>

                {/* Service Images Section */}
                <div className="mb-8">
                    <ServiceImageManager />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Gallery Management */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Community Gallery</h2>
                        <p className="text-sm text-gray-500 mb-4">Upload new photos to the &quot;Our Community Gallery&quot; section.</p>
                        <ImageUploader imageType="gallery" />
                    </div>

                    {/* Hero Banner Management */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Home Page Banner</h2>
                        <p className="text-sm text-gray-500 mb-4">Upload background images for the main Hero section.</p>
                        <ImageUploader imageType="hero" />
                    </div>
                </div>
            </div>
        </div>
    );
}

