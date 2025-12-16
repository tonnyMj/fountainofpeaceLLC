import Link from 'next/link';
import { FileText, UserCheck, Home } from 'lucide-react';

export default function Admissions() {
    return (
        <div className="bg-white">
            <section className="bg-primary text-white py-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Admissions</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        We make the transition as smooth and comfortable as possible for you and your family.
                    </p>
                </div>
            </section>

            {/* Steps */}
            <section className="py-16 container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">The Admissions Process</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop only) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-100 -z-10 transform -translate-y-1/2"></div>

                    <div className="bg-white p-6 text-center">
                        <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
                        <h3 className="text-xl font-bold mb-3">Schedule a Visit</h3>
                        <p className="text-gray-600">
                            <Link href="/contact" className="text-primary underline">Contact us</Link> to schedule a tour. Meet our team, see our facilities, and ask any questions you have.
                        </p>
                    </div>

                    <div className="bg-white p-6 text-center">
                        <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
                        <h3 className="text-xl font-bold mb-3">Assessment</h3>
                        <p className="text-gray-600">
                            Our Director of Nursing will conduct a compassionate assessment to understand care needs and ensure we are the right fit.
                        </p>
                    </div>

                    <div className="bg-white p-6 text-center">
                        <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
                        <h3 className="text-xl font-bold mb-3">Welcome Home</h3>
                        <p className="text-gray-600">
                            Complete the paperwork, coordinate the move-in date, and let us welcome your loved one to the Fountain of Hope family.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
