import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand & Description */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">Fountain of Peace AFH LLC</h3>
                        <p className="mb-4 text-gray-400">
                            Your warm, home-like environment for high-quality, individualized care. Promoting dignity, independence, and overall well-being.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-primary transition-colors">
                                    Our Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/admissions" className="hover:text-primary transition-colors">
                                    Admissions
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-primary mt-1" />
                                <span>
                                    21818 42nd Ave E<br />
                                    Spanaway, WA 98387
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-primary" />
                                <a href="tel:+12538611691" className="hover:text-white transition-colors">
                                    (253) 861-1691
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-primary" />
                                <a href="mailto:fopeaceafh@gmail.com" className="hover:text-white transition-colors">
                                    fopeaceafh@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Fountain of Peace AFH LLC. All rights reserved.</p>
                </div>
            </div>
        </footer >
    );
};

export default Footer;
