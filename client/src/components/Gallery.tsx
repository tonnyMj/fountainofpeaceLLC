"use client";

import { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const Gallery = () => {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`${API_URL}/api/images?type=gallery`, { cache: 'no-store' });
                if (response.ok) {
                    const data = await response.json();
                    setImages(data);
                }
            } catch (error) {
                console.error('Failed to load gallery:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    if (loading) {
        return <div className="text-center py-12 text-gray-500">Loading gallery...</div>;
    }

    if (images.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500">No images shared yet. Check back soon!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((img, index) => (
                <div key={index} className="group relative">
                    <div className="aspect-square relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <img
                            src={img}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs text-center truncate">Community Moment</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Gallery;
