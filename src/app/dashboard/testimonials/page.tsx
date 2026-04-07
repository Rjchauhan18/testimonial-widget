'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  testimonial_text: string | null;
  video_url: string | null;
  rating: number | null;
  status: string;
  created_at: string;
}

export default function TestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading testimonials:', error);
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  }

  async function handleApprove(id: string) {
    const { error } = await supabase
      .from('testimonials')
      .update({ status: 'approved' })
      .eq('id', id);

    if (error) {
      alert('Error approving: ' + error.message);
    } else {
      setTestimonials(testimonials.map(t => 
        t.id === id ? { ...t, status: 'approved' } : t
      ));
    }
  }

  async function handleReject(id: string) {
    if (!confirm('Are you sure you want to reject this testimonial?')) return;

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error rejecting: ' + error.message);
    } else {
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting: ' + error.message);
    } else {
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  }

  const filteredTestimonials = testimonials.filter(t => 
    filter === 'all' ? true : t.status === filter
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and approve customer testimonials</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            All ({testimonials.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Pending ({testimonials.filter(t => t.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Approved ({testimonials.filter(t => t.status === 'approved').length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {filter === 'pending' ? 'No pending testimonials' : filter === 'approved' ? 'No approved testimonials' : 'No testimonials yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {filter === 'pending' 
                ? 'All testimonials have been reviewed' 
                : 'Share your collection page to start receiving testimonials'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h3>
                      {(testimonial.role || testimonial.company) && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {[testimonial.role, testimonial.company].filter(Boolean).join(' at ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      testimonial.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}
                  >
                    {testimonial.status}
                  </span>
                </div>

                {testimonial.rating && (
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= testimonial.rating! ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                )}

                {testimonial.testimonial_text && (
                  <p className="text-gray-700 dark:text-gray-300 mb-3 italic">
                    &quot;{testimonial.testimonial_text}&quot;
                  </p>
                )}

                {testimonial.video_url && (
                  <video
                    src={testimonial.video_url}
                    controls
                    className="w-full max-w-md h-32 object-cover rounded mb-3"
                  />
                )}

                <div className="flex gap-2">
                  {testimonial.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(testimonial.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(testimonial.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {testimonial.status === 'approved' && (
                    <span className="text-green-600 dark:text-green-400 text-sm">
                      ✓ Live on website
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="ml-auto px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    Delete
                  </button>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Submitted: {new Date(testimonial.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
