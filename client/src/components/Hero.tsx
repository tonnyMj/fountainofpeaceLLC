"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
        }, 5000);

        return () => clearInterval(interval);
    }, [images]);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <section className="relative h-[600px] flex items-center justify-center text-center bg-gray-900 overflow-hidden group">
            {/* Background Images */}
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-50' : 'opacity-0'
                        }`}
                    style={{ backgroundImage: `url("${img}")` }}
                />
            ))}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/80 z-0"></div>

            {/* Left Arrow */}
            {images.length > 1 && (
                <div className="absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition-colors z-20 hidden md:block group-hover:block">
                    <ChevronLeft onClick={prevSlide} size={30} />
                </div>
            )}

            {/* Right Arrow */}
            {images.length > 1 && (
                <div className="absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition-colors z-20 hidden md:block group-hover:block">
                    <ChevronRight onClick={nextSlide} size={30} />
                </div>
            )}

            {/* Dots */}
            {images.length > 1 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {images.map((_, slideIndex) => (
                        <div
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            className={`text-2xl cursor-pointer w-3 h-3 rounded-full transition-all ${currentIndex === slideIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/80'
                                }`}
                        ></div>
                    ))}
                </div>
            )}

            {/* Content */}
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
