import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import TestimonialSlider from '@/components/TestimonialSlider';
import Gallery from '@/components/Gallery';
import { Heart, Home as HomeIcon, Clock, Smile } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      {/* Hero Section */}
      <Hero />

      {/* Our Philosophy / Mission */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Fountain of Peace AFH LLC</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Our mission is to provide high-quality, individualized care that promotes dignity, independence, and overall well-being.
            We currently have six available openings and are eager to welcome new residents into our warm, home-like environment.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-primary font-medium">
            <span className="flex items-center gap-2"><HomeIcon size={20} /> Home-like Environment</span>
            <span className="flex items-center gap-2"><Heart size={20} /> Dignified Care</span>
            <span className="flex items-center gap-2"><Clock size={20} /> 24-Hour Supervision</span>
          </div>
        </div>
      </section>

      {/* Key Services Preview */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive care delivered with safety and compassion.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              icon={Clock}
              title="24-Hour Supervision"
              description="On-site staff availability ensuring safety and immediate assistance at all times."
            />
            <ServiceCard
              icon={HomeIcon}
              title="Daily Living Assistance"
              description="Support with bathing, dressing, and grooming while promoting resident independence."
            />
            <ServiceCard
              icon={Smile}
              title="Social Activities"
              description="Engaging recreational activities to maintain emotional well-being and community."
            />
          </div>
          <div className="text-center mt-8">
            <Link href="/services" className="text-primary font-semibold hover:underline">
              View All Services &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white mb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Families Say</h2>
          </div>
          <TestimonialSlider />
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Community Gallery</h2>
            <p className="text-gray-600 mb-8">Glimpses of life and joy at Fountain of Peace.</p>
          </div>
          <Gallery />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-4">We Have 6 Openings Available</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Schedule a tour today to see our newly renovated, comfortable living space.
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-full font-bold text-lg transition-colors inline-block"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
