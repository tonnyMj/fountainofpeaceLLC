"use client";

import { useState, useEffect } from 'react';
import { Upload, Check, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';


const serviceTypes = [
    { type: 'service_supervision', label: '24-Hour Supervision' },
    { type: 'service_healthcare', label: 'Healthcare Coordination' },
    { type: 'service_adl', label: 'Assistance with ADLs' },
    { type: 'service_meals', label: 'Nutritious Meals' },
    { type: 'service_housekeeping', label: 'Housekeeping' },
    { type: 'service_social', label: 'Social Activities' },
];

const ServiceImageManager = () => {
    const { showToast } = useToast();
    const [images, setImages] = useState<Record<string, string>>({});
    const [uploading, setUploading] = useState<string | null>(null);

    const fetchImages = async () => {
        const loadedImages: Record<string, string> = {};
        for (const service of serviceTypes) {
            try {
                const res = await fetch(`${API_URL}/api/images?type=${service.type}`);
                const data = await res.json();
                if (data.length > 0) {
                    // Cloudinary URLs are already complete
                    loadedImages[service.type] = data[0];
                }
            } catch (err) {
                console.error(`Failed to load image for ${service.type}`);
            }
        }
        setImages(loadedImages);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload = async (serviceType: string, file: File) => {
        setUploading(serviceType);
        const formData = new FormData();
        formData.append('images', file);
        formData.append('type', serviceType);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (response.ok) {
                showToast(`Updated ${serviceTypes.find(s => s.type === serviceType)?.label} image!`, 'success');
                fetchImages();
            } else {
                showToast('Upload failed', 'error');
            }
        } catch (err) {
            showToast('Upload error', 'error');
        } finally {
            setUploading(null);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <ImageIcon size={20} className="text-primary" />
                Service Images
            </h3>
            <p className="text-sm text-gray-500 mb-6">Click on any service to upload a new image.</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {serviceTypes.map((service) => (
                    <label key={service.type} className="cursor-pointer group">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    handleUpload(service.type, e.target.files[0]);
                                }
                            }}
                        />
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-primary transition-colors">
                            {images[service.type] ? (
                                <img
                                    src={images[service.type]}
                                    alt={service.label}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <Upload size={24} className="text-gray-400" />
                                </div>
                            )}

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                {uploading === service.type ? (
                                    <div className="text-white text-sm">Uploading...</div>
                                ) : (
                                    <Upload size={24} className="text-white" />
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2 text-center font-medium truncate">{service.label}</p>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default ServiceImageManager;
