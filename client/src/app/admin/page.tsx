"use client";

import ImageUploader from '@/components/ImageUploader';
import ServiceImageManager from '@/components/ServiceImageManager';
import InquiryManager from '@/components/admin/InquiryManager';
import { Lock, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [activeTab, setActiveTab] = useState<'content' | 'inquiries'>('inquiries'); // Default to Inquiries for visibility

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
        <div className="min-h-screen bg-gray-50 py-8 md:py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full mb-3">
                            <Lock size={14} />
                            <span className="text-xs font-bold uppercase tracking-wider">Admin Dashboard</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-600 mt-1">Manage your facility content and visitor inquiries.</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="self-start md:self-auto bg-white border border-gray-200 text-gray-700 hover:text-red-600 hover:border-red-100 hover:bg-red-50 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>

                {/* Tabs Navigation */}
                <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 inline-flex mb-8 w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('inquiries')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'inquiries'
                                ? 'bg-primary text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        📧 Inquiries
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'content'
                                ? 'bg-primary text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        🖼️ Content
                    </button>
                </div>

                {/* Tab Content */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {activeTab === 'inquiries' ? (
                        <InquiryManager />
                    ) : (
                        <div className="grid gap-12">
                            {/* Service Images Section */}
                            <ServiceImageManager />

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
                    )}
                </div>
            </div>
        </div>
    );
}

