"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const Hero = () => {
    const [images, setImages] = useState<string[]>([
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070"
    ]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`${API_URL}/api/images?type=hero`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        // Append backend images to the default one or replace it
                        // Let's replace the default if user supplied ANY images
                        // Cloudinary URLs are already complete
                        setImages(data);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch hero images:', error);
            }
        };
        fetchImages();
    }, []);

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [images]);

    return (
        <section className="relative h-[600px] flex items-center justify-center text-center bg-gray-900 overflow-hidden">
            {/* Background Images with Fade Transition */}
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-50' : 'opacity-0'
                        }`}
                    style={{ backgroundImage: `url("${img}")` }}
                />
            ))}

            {/* Fallback overlay color */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/80 z-0"></div>

            <div className="relative z-10 px-4 max-w-4xl mx-auto text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    Fountain of Peace<br /> AFH LLC
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-200">
                    Warm, home-like environment offering high-quality, individualized care.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/contact"
                        className="w-full sm:w-auto bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors"
                    >
                        Schedule a Tour
                    </Link>
                    <Link
                        href="/services"
                        className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors"
                    >
                        View Services
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
