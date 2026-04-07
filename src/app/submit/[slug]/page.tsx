'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SubmitTestimonialPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [rating, setRating] = useState(5);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    loadPage();
  }, [slug]);

  async function loadPage() {
    console.log('Loading page with slug:', slug);
    
    const { data, error } = await supabase
      .from('collection_pages')
      .select('*')
      .eq('slug', slug)
      .single();

    console.log('Query result:', { data, error });

    if (error) {
      console.error('Error loading page:', error);
      setPage(null);
    } else if (!data) {
      console.log('No page found for slug:', slug);
      setPage(null);
    } else {
      console.log('Page loaded successfully:', data);
      setPage(data);
    }
    setLoading(false);
  }

  async function handleVideoSelect(file: File) {
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  }

  async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'testimonials'); // Create this in Cloudinary dashboard
    formData.append('folder', 'testimonials');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setUploadProgress(10);

    try {
      let videoUrl = '';
      
      // Upload video to Cloudinary if provided
      if (videoFile) {
        setUploadProgress(30);
        videoUrl = await uploadToCloudinary(videoFile);
        setUploadProgress(70);
      }

      // Get user (or create anonymous submission)
      const { data: { user } } = await supabase.auth.getUser();
      
      // For public submissions, we'll use the page owner's ID
      const { data: pageOwner } = await supabase
        .from('users')
        .select('id')
        .eq('id', page.user_id)
        .single();

      // Save testimonial
      const { error } = await supabase.from('testimonials').insert({
        user_id: page.user_id,
        name,
        role,
        company,
        testimonial_text: testimonial,
        video_url: videoUrl || null,
        rating,
        status: 'pending', // Requires approval
      });

      if (error) throw error;

      setUploadProgress(100);
      alert('Thank you! Your testimonial has been submitted for approval.');
      
      // Reset form
      setName('');
      setRole('');
      setCompany('');
      setTestimonial('');
      setRating(5);
      setVideoFile(null);
      setVideoPreview(null);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-4">
            This testimonial collection page doesn&apos;t exist or hasn&apos;t been created yet.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <p className="text-sm font-medium text-gray-700 mb-2">Looking for your collection page?</p>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Go to your Dashboard</li>
              <li>Click &quot;Collection Pages&quot;</li>
              <li>Create a new page or copy the correct URL</li>
            </ol>
          </div>
          <a
            href="/dashboard/collection-pages"
            className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div 
          className="bg-white rounded-lg shadow-lg p-8"
          style={{ borderTop: `4px solid ${page.brand_color}` }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
            {page.description && (
              <p className="text-gray-600 mt-2">{page.description}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How would you rate your experience?
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:scale-110 transition`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            {/* Role & Company */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., CEO"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Acme Inc"
                />
              </div>
            </div>

            {/* Testimonial Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Testimonial *
              </label>
              <textarea
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                rows={4}
                placeholder="Share your experience..."
                required
              />
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Testimonial (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files && handleVideoSelect(e.target.files[0])}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <div className="text-gray-600">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2">Click to upload video</p>
                    <p className="text-xs text-gray-500">MP4, MOV, or WebM (max 100MB)</p>
                  </div>
                </label>
                {videoPreview && (
                  <div className="mt-4">
                    <video src={videoPreview} controls className="max-h-48 mx-auto rounded" />
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreview(null);
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-700"
                    >
                      Remove video
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 font-medium"
              style={{ backgroundColor: page.brand_color }}
            >
              {submitting ? 'Submitting...' : 'Submit Testimonial'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Your testimonial will be reviewed before it appears publicly.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
