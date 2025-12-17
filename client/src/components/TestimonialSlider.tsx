"use client";

import { Quote, PlusCircle } from 'lucide-react';
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

    return (
        <div>
            {loading ? (
                <div className="text-center py-12 text-gray-400 animate-pulse">Loading stories...</div>
            ) : testimonials.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Be the first to share your story!</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {testimonials.map((t) => (
                        <div key={t.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6">
                                <Quote size={20} className="fill-current" />
                            </div>
                            <p className="text-gray-600 mb-6 italic line-clamp-6">&quot;{t.text}&quot;</p>
                            <div className="mt-auto">
                                <p className="font-bold text-gray-900">{t.author}</p>
                                <p className="text-sm text-gray-500">{t.relation}</p>
                            </div>
                        </div>
                    ))}
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
