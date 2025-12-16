// Simplified static slider for now
import { Quote } from 'lucide-react';

const TestimonialSlider = () => {
    const testimonials = [
        {
            id: 1,
            text: "Fountain of Hope has been a blessing for our family. The staff treats my mother with such kindness and respect. It truly feels like home.",
            author: "Sarah J.",
            relation: "Daughter of Resident"
        },
        {
            id: 2,
            text: "The facility is beautiful and always clean. But what stands out most is the genuine care. Dad loves the daily activities and the food!",
            author: "Michael T.",
            relation: "Son of Resident"
        },
        {
            id: 3,
            text: "Moving here was the best decision. I've made so many friends and the nurses are wonderful. I feel safe and happy.",
            author: "Eleanor R.",
            relation: "Resident"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
                <div key={t.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6">
                        <Quote size={20} className="fill-current" />
                    </div>
                    <p className="text-gray-600 mb-6 italic">&quot;{t.text}&quot;</p>
                    <div>
                        <p className="font-bold text-gray-900">{t.author}</p>
                        <p className="text-sm text-gray-500">{t.relation}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TestimonialSlider;
