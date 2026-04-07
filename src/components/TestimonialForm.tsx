'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface TestimonialFormProps {
  collectionPageSlug?: string;
  onSuccess?: () => void;
}

export default function TestimonialForm({ collectionPageSlug, onSuccess }: TestimonialFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    testimonial_text: '',
    rating: 5,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let videoUrl = null;

      // Upload video if provided
      if (videoFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('video', videoFile);
        
        const uploadResponse = await fetch('/api/upload-video', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Video upload failed');
        }
        
        const uploadResult = await uploadResponse.json();
        videoUrl = uploadResult.url;
      }

      // Submit testimonial
      const { error: submitError } = await supabase
        .from('testimonials')
        .insert({
          ...formData,
          video_url: videoUrl,
          status: 'pending',
        });

      if (submitError) throw submitError;

      // Success
      setFormData({
        name: '',
        role: '',
        company: '',
        testimonial_text: '',
        rating: 5,
      });
      setVideoFile(null);
      
      if (onSuccess) onSuccess();
      alert('Thank you! Your testimonial has been submitted for review.');
    } catch (err: any) {
      setError(err.message || 'Failed to submit testimonial');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError('Please upload a video file');
        return;
      }
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError('Video must be less than 50MB');
        return;
      }
      setVideoFile(file);
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="John Doe"
        />
      </div>

      {/* Role & Company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Your Role
          </label>
          <input
            type="text"
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="CEO"
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Company
          </label>
          <input
            type="text"
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Acme Inc"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              className={`text-3xl ${
                star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
              } hover:scale-110 transition-transform`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Testimonial Text */}
      <div>
        <label htmlFor="testimonial_text" className="block text-sm font-medium text-gray-700 mb-2">
          Your Testimonial *
        </label>
        <textarea
          id="testimonial_text"
          required
          rows={4}
          value={formData.testimonial_text}
          onChange={(e) => setFormData({ ...formData, testimonial_text: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Share your experience..."
        />
      </div>

      {/* Video Upload */}
      <div>
        <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-2">
          Add a Video Testimonial (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleVideoChange}
            className="hidden"
          />
          <label
            htmlFor="video"
            className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
          >
            {videoFile ? videoFile.name : 'Click to upload video'}
          </label>
          <p className="text-sm text-gray-500 mt-2">Max 50MB. MP4, MOV, or AVI.</p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Submitting...' : 'Submit Testimonial'}
      </button>
    </form>
  );
}
