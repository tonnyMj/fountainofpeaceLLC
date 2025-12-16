"use client";

import { Clock, ShieldCheck, Heart, Utensils, Home, Smile } from 'lucide-react';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ServiceImage {
    type: string;
    url: string;
}

export default function Services() {
    const [serviceImages, setServiceImages] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchServiceImages = async () => {
            const types = ['service_supervision', 'service_healthcare', 'service_adl', 'service_meals', 'service_housekeeping', 'service_social'];
            const images: Record<string, string> = {};

            for (const type of types) {
                try {
                    const res = await fetch(`${API_URL}/api/images?type=${type}`);
                    const data = await res.json();
                    if (data.length > 0) {
                        images[type] = `${API_URL}${data[0]}`;
                    }
                } catch (err) {
                    console.error(`Failed to fetch ${type} image`);
                }
            }
            setServiceImages(images);
        };
        fetchServiceImages();
    }, []);

    const services = [
        {
            icon: Clock,
            title: "24-Hour Supervision",
            description: "Round-the-clock on-site staff availability to ensure safety and immediate assistance whenever needed.",
            imageType: "service_supervision"
        },
        {
            icon: ShieldCheck,
            title: "Healthcare Coordination",
            description: "We manage medication and coordinate with healthcare providers to maintain optimal health for our residents.",
            imageType: "service_healthcare"
        },
        {
            icon: Heart,
            title: "Assistance with ADLs",
            description: "Support with Activities of Daily Living such as bathing, dressing, and grooming, respecting dignity and independence.",
            imageType: "service_adl"
        },
        {
            icon: Utensils,
            title: "Nutritious Meals",
            description: "Freshly prepared, balanced meals with dietary support to meet individual health needs and preferences.",
            imageType: "service_meals"
        },
        {
            icon: Home,
            title: "Housekeeping",
            description: "Regular laundry and housekeeping services to maintain a clean, comfortable, and worry-free living environment.",
            imageType: "service_housekeeping"
        },
        {
            icon: Smile,
            title: "Social Activities",
            description: "Engaging recreational and social activities designed to stimulate the mind and foster community connections.",
            imageType: "service_social"
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <section className="bg-primary text-white py-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        Comprehensive care tailored to the unique needs of each individual.
                    </p>
                </div>
            </section>

            <section className="py-16 container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                            {/* Service Image */}
                            <div className="h-48 bg-gray-100 overflow-hidden">
                                {serviceImages[service.imageType] ? (
                                    <img
                                        src={serviceImages[service.imageType]}
                                        alt={service.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                        <service.icon size={48} className="text-primary/30" />
                                    </div>
                                )}
                            </div>
                            <div className="p-8">
                                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-4 -mt-12 relative z-10 shadow-md border-4 border-white">
                                    <service.icon size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Key Strengths */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Home Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                        <div className="flex items-start gap-4">
                            <span className="text-primary font-bold text-xl">✓</span>
                            <p className="text-gray-700">Openings available now for new residents.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="text-primary font-bold text-xl">✓</span>
                            <p className="text-gray-700">Newly renovated living spaces designed for comfort.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="text-primary font-bold text-xl">✓</span>
                            <p className="text-gray-700">Higher staff-to-resident ratio for personalized care.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="text-primary font-bold text-xl">✓</span>
                            <p className="text-gray-700">Cost-effective care without compromising quality.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
