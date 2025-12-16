import { Users, Award, Heart } from 'lucide-react';

export default function About() {
    return (
        <div className="bg-white">
            {/* Hero / Header */}
            <section className="bg-primary text-white py-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About Fountain of Peace AFH LLC</h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        A fully licensed home committed to upholding the highest standards of care, safety, and compassion.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            Our mission is to provide high-quality, individualized care that promotes dignity, independence, and overall well-being. We are eager to welcome new residents into our warm, home-like environment.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            We currently have six available openings and offer a level of care that prioritizes the comfort and emotional well-being of every resident.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-6 rounded-xl text-center">
                            <Heart className="w-10 h-10 text-primary mx-auto mb-3" />
                            <h3 className="font-bold text-gray-900">Dignity</h3>
                        </div>
                        <div className="bg-green-50 p-6 rounded-xl text-center">
                            <Users className="w-10 h-10 text-secondary mx-auto mb-3" />
                            <h3 className="font-bold text-gray-900">Independence</h3>
                        </div>
                        <div className="bg-yellow-50 p-6 rounded-xl text-center">
                            <Award className="w-10 h-10 text-accent mx-auto mb-3" />
                            <h3 className="font-bold text-gray-900">Well-being</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values / Strengths */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-primary">Home-like Environment</h3>
                            <p className="text-gray-600">A nurturing space that fosters comfort and emotional well-being.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-primary">Personalized Care</h3>
                            <p className="text-gray-600">Higher staff-to-resident ratio ensuring attentive care.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-primary">Cost-Effective</h3>
                            <p className="text-gray-600">Quality care solutions that are affordable.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-primary">Modern Living</h3>
                            <p className="text-gray-600">Clean, safe, and newly renovated spaces designed for comfort.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
