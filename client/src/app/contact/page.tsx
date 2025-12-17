import ContactForm from '@/components/ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
    return (
        <div className="min-h-screen bg-gray-50">
            <section className="bg-primary text-white py-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        We are here to answer your questions and help you explore your options.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-6 py-12 -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info & Map */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">Visit Us</p>
                                        <p className="text-gray-600">21818 42nd Ave E, Spanaway, WA 98387</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">Call Us</p>
                                        <p className="text-gray-600">(253) 861-1691</p>
                                        <p className="text-sm text-gray-400">24/7 Availability</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">Email Us</p>
                                        <p className="text-gray-600">fopeaceafh@gmail.com</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Map Embed Placeholder */}
                        <div className="bg-gray-200 h-80 rounded-2xl overflow-hidden relative shadow-sm border border-gray-100">
                            <iframe
                                src="https://maps.google.com/maps?q=21818+42nd+Ave+E,+Spanaway,+WA+98387&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                title="Google Maps Location"
                            ></iframe>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
