"use client";

import { useState, useEffect } from 'react';

const Gallery = () => {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/images?type=gallery');
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, index) => (
                <div key={index} className="aspect-square relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <img
                        src={`http://localhost:5000${img}`}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            ))}
        </div>
    );
};

export default Gallery;
