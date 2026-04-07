'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import TestimonialWidget from '@/components/TestimonialWidget';

interface User {
  id: string;
  email: string;
  plan: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  testimonial_text: string | null;
  video_url: string | null;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [embedCode, setEmbedCode] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setUser(userData);

      // Fetch testimonials
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      setTestimonials(data || []);

      // Generate embed code
      setEmbedCode(`<script src="${window.location.origin}/api/embed?userId=${userData.id}" async></script>`);
      
      setIsLoading(false);
    }

    checkUser();
  }, [router]);

  const handleApprove = async (id: string) => {
    await supabase
      .from('testimonials')
      .update({ status: 'approved' })
      .eq('id', id);
    
    setTestimonials(testimonials.map(t => 
      t.id === id ? { ...t, status: 'approved' } : t
    ));
  };

  const handleReject = async (id: string) => {
    await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
              {user?.plan}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            label="Total Testimonials"
            value={testimonials.length}
            color="blue"
          />
          <StatCard
            label="Approved"
            value={testimonials.filter(t => t.status === 'approved').length}
            color="green"
          />
          <StatCard
            label="Pending"
            value={testimonials.filter(t => t.status === 'pending').length}
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Testimonials List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Testimonials ({testimonials.length})</h2>
            
            {testimonials.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No testimonials yet.</p>
            ) : (
              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                        {testimonial.role && (
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          testimonial.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {testimonial.status}
                      </span>
                    </div>

                    {testimonial.testimonial_text && (
                      <p className="text-gray-700 mb-2 italic">&quot;{testimonial.testimonial_text}&quot;</p>
                    )}

                    {testimonial.video_url && (
                      <video
                        src={testimonial.video_url}
                        controls
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}

                    <div className="flex gap-2 mt-3">
                      {testimonial.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(testimonial.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(testimonial.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {testimonial.status === 'approved' && (
                        <span className="text-green-600 text-sm">✓ Live on website</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Embed Widget */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Embed on Your Website</h2>
            
            <div className="mb-6">
              <TestimonialWidget userId={user?.id} limit={5} type="grid" />
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Embed Code:</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                {embedCode}
              </pre>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-2">Widget Types:</h3>
              <div className="space-y-2">
                <code className="bg-gray-100 px-3 py-1 rounded text-sm">type="grid"</code>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm">type="carousel"</code>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm">type="masonry"</code>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm">type="wall"</code>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
