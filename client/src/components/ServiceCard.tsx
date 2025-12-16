import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface ServiceCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    link?: string;
}

const ServiceCard = ({ icon: Icon, title, description, link = '/services' }: ServiceCardProps) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-4">
                <Icon size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <Link href={link} className="text-primary font-medium hover:text-blue-700 inline-flex items-center gap-1">
                Learn More &rarr;
            </Link>
        </div>
    );
};

export default ServiceCard;
