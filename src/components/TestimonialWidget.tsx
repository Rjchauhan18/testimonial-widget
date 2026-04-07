'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  testimonial_text: string | null;
  video_url: string | null;
  image_url: string | null;
  rating: number | null;
}

interface TestimonialWidgetProps {
  type?: 'grid' | 'carousel' | 'masonry' | 'wall';
  limit?: number;
  userId?: string;
}

export default function TestimonialWidget({ type = 'grid', limit = 10, userId }: TestimonialWidgetProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        let query = supabase
          .from('testimonials')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query;
        if (error) throw error;
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTestimonials();
  }, [userId, limit]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        No testimonials yet.
      </div>
    );
  }

  // Grid Layout (default)
  if (type === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    );
  }

  // Carousel Layout
  if (type === 'carousel') {
    return (
      <div className="overflow-x-auto flex gap-6 pb-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="min-w-[300px] md:min-w-[400px]">
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>
    );
  }

  // Masonry Layout
  if (type === 'masonry') {
    return (
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    );
  }

  // Wall of Love Layout
  if (type === 'wall') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} featured />
        ))}
      </div>
    );
  }

  return null;
}

function TestimonialCard({ testimonial, featured = false }: { testimonial: Testimonial; featured?: boolean }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${
        featured ? 'border-2 border-blue-500' : ''
      }`}
    >
      {/* Rating */}
      {testimonial.rating && (
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-xl ${
                i < testimonial.rating! ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>
      )}

      {/* Testimonial Text */}
      {testimonial.testimonial_text && (
        <p className="text-gray-700 mb-4 italic">&quot;{testimonial.testimonial_text}&quot;</p>
      )}

      {/* Video */}
      {testimonial.video_url && (
        <div className="mb-4">
          <video
            src={testimonial.video_url}
            controls
            className="w-full rounded-lg max-h-64 object-cover"
          />
        </div>
      )}

      {/* Author */}
      <div className="flex items-center gap-3">
        {testimonial.image_url ? (
          <img
            src={testimonial.image_url}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {testimonial.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900">{testimonial.name}</p>
          {(testimonial.role || testimonial.company) && (
            <p className="text-sm text-gray-500">
              {testimonial.role}
              {testimonial.role && testimonial.company && ' at '}
              {testimonial.company}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
