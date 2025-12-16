import Link from 'next/link';
import { Menu, Phone } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">Fountain of Peace AFH LLC</span>
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

                {/* Mobile Menu Button - Placeholder for interactivity if needed */}
                <button className="md:hidden text-gray-600">
                    <Menu size={24} />
                </button>
            </div>
        </header>
    );
};

export default Header;
