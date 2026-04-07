import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const role = formData.get('role') as string | null;
    const company = formData.get('company') as string | null;
    const testimonial_text = formData.get('testimonial_text') as string;
    const rating = parseInt(formData.get('rating') as string) || 5;
    const userId = formData.get('userId') as string | null;
    const videoFile = formData.get('video') as File | null;

    // Validate required fields
    if (!name || !testimonial_text) {
      return NextResponse.json(
        { error: 'Name and testimonial text are required' },
        { status: 400 }
      );
    }

    // Upload video to Cloudinary if provided
    let videoUrl: string | null = null;
    if (videoFile && videoFile.size > 0) {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret) {
        return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
      }

      // Create form data for Cloudinary upload
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', videoFile);
      cloudinaryFormData.append('upload_preset', 'testimonial-widget');
      cloudinaryFormData.append('folder', 'testimonials');
      cloudinaryFormData.append('api_key', apiKey);
      cloudinaryFormData.append('timestamp', Math.floor(Date.now() / 1000).toString());

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        {
          method: 'POST',
          body: cloudinaryFormData,
        }
      );

      if (!response.ok) {
        throw new Error('Video upload failed');
      }

      const data = await response.json();
      videoUrl = data.secure_url;
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Insert testimonial
    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        user_id: userId,
        name,
        role,
        company,
        testimonial_text,
        video_url: videoUrl,
        rating,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      testimonial: data,
      message: 'Testimonial submitted successfully!' 
    });
  } catch (error: any) {
    console.error('Error submitting testimonial:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit testimonial' },
      { status: 500 }
    );
  }
}
