"use client";

import Link from 'next/link';
import { Menu, Phone, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
                    <span className="text-xl md:text-2xl font-bold text-primary">Fountain of Peace AFH LLC</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-gray-600 hover:text-primary transition-colors font-medium">
                        Home
                    </Link>
                    <Link href="/about" className="text-gray-600 hover:text-primary transition-colors font-medium">
                        About Us
                    </Link>
                    <Link href="/services" className="text-gray-600 hover:text-primary transition-colors font-medium">
                        Services
                    </Link>
                    <Link href="/admissions" className="text-gray-600 hover:text-primary transition-colors font-medium">
                        Admissions
                    </Link>
                    <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors font-medium">
                        Contact
                    </Link>
                </nav>

                {/* CTA Button */}
                <div className="hidden md:flex items-center gap-4">
                    <a href="tel:+12538611691" className="flex items-center gap-2 text-gray-600 hover:text-primary">
                        <Phone size={18} />
                        <span className="font-semibold">(253) 861-1691</span>
                    </a>
                    <Link
                        href="/contact"
                        className="bg-primary hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-colors"
                    >
                        Schedule a Tour
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-gray-600 hover:text-primary transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={closeMenu}
                />
            )}

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-72 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <nav className="flex flex-col p-6 space-y-4">
                    <Link
                        href="/"
                        className="text-gray-700 hover:text-primary transition-colors font-medium py-3 border-b border-gray-100"
                        onClick={closeMenu}
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className="text-gray-700 hover:text-primary transition-colors font-medium py-3 border-b border-gray-100"
                        onClick={closeMenu}
                    >
                        About Us
                    </Link>
                    <Link
                        href="/services"
                        className="text-gray-700 hover:text-primary transition-colors font-medium py-3 border-b border-gray-100"
                        onClick={closeMenu}
                    >
                        Services
                    </Link>
                    <Link
                        href="/admissions"
                        className="text-gray-700 hover:text-primary transition-colors font-medium py-3 border-b border-gray-100"
                        onClick={closeMenu}
                    >
                        Admissions
                    </Link>
                    <Link
                        href="/contact"
                        className="text-gray-700 hover:text-primary transition-colors font-medium py-3 border-b border-gray-100"
                        onClick={closeMenu}
                    >
                        Contact
                    </Link>

                    {/* Mobile CTA */}
                    <div className="pt-4 space-y-3">
                        <a
                            href="tel:+12538611691"
                            className="flex items-center justify-center gap-2 text-primary font-semibold py-3 border border-primary rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            <Phone size={18} />
                            (253) 861-1691
                        </a>
                        <Link
                            href="/contact"
                            className="block text-center bg-primary hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition-colors"
                            onClick={closeMenu}
                        >
                            Schedule a Tour
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;

