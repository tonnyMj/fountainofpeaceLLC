"use client";

import { Quote, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import TestimonialForm from './TestimonialForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Testimonial {
    id: number;
    text: string;
    author: string;
    relation: string;
}

const TestimonialSlider = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchTestimonials = async () => {
        try {
            const response = await fetch(`${API_URL}/api/testimonials`);
            if (response.ok) {
                const data = await response.json();
                setTestimonials(data);
            }
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    // Auto-advance
    useEffect(() => {
        if (testimonials.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    return (
        <div className="max-w-4xl mx-auto">
            {loading ? (
                <div className="text-center py-12 text-gray-400 animate-pulse">Loading stories...</div>
            ) : testimonials.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Be the first to share your story!</div>
            ) : (
                <div className="relative bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12 mb-12">
                    {/* Large Quote Icon Background */}
                    <div className="absolute top-6 left-8 text-primary/5">
                        <Quote size={80} className="fill-current" />
                    </div>

                    {/* Carousel Content */}
                    <div className="relative z-10 min-h-[250px] flex flex-col justify-center items-center text-center">
                        <div className="mb-8">
                            <Quote size={32} className="text-primary mx-auto mb-6 fill-current" />
                            <p className="text-xl md:text-2xl text-gray-700 font-medium italic leading-relaxed">
                                &quot;{testimonials[currentIndex].text}&quot;
                            </p>
                        </div>

                        <div className="mt-auto">
                            <h3 className="text-lg font-bold text-gray-900">{testimonials[currentIndex].author}</h3>
                            <p className="text-primary font-medium">{testimonials[currentIndex].relation}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    {testimonials.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-2 md:-left-5 top-1/2 -translate-y-1/2 bg-white text-gray-400 hover:text-primary p-2 rounded-full shadow-md border border-gray-100 hover:scale-110 transition-all"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-2 md:-right-5 top-1/2 -translate-y-1/2 bg-white text-gray-400 hover:text-primary p-2 rounded-full shadow-md border border-gray-100 hover:scale-110 transition-all"
                            >
                                <ChevronRight size={24} />
                            </button>

                            {/* Dots */}
                            <div className="flex justify-center gap-2 mt-8">
                                {testimonials.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-primary w-6' : 'bg-gray-200 hover:bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="text-center pb-8 animate-fade-in-up">
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all transform hover:scale-105 shadow-sm"
                >
                    <PlusCircle size={20} /> Share Your Experience
                </button>
            </div>

            <TestimonialForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={() => {
                    fetchTestimonials();
                }}
            />
        </div>
    );
};

export default TestimonialSlider;
