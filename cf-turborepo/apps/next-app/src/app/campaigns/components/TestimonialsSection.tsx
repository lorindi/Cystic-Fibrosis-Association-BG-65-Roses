'use client';

import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="my-16">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-base-content">Какво казват другите</h2>
          <p className="text-base-content/70 mt-1">Мнения на хора, които са дарили за нашите кампании</p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <span className="text-yellow-500 text-xl">★★★★★</span>
          <span className="ml-2 font-semibold">4.9/5</span>
          <span className="ml-2 text-base-content/70">(32 отзива)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-base-100 shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{testimonial.name}</h3>
                <div className="flex items-center">
                  <div className="text-yellow-500">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index} className={index < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-base-content/70">{testimonial.date}</span>
                </div>
              </div>
            </div>
            <p className="text-base-content/80">{testimonial.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 