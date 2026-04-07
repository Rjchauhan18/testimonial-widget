import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
      const bytes = await videoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'testimonial-widget/submissions',
            resource_type: 'video',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      videoUrl = uploadResult.secure_url;
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
