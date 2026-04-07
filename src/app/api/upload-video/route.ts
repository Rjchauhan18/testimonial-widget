import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File | null;
    
    if (!videoFile) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload to Cloudinary using their upload API directly
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
    }

    // Create form data for Cloudinary upload
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', videoFile);
    cloudinaryFormData.append('upload_preset', 'testimonial-widget'); // You'll need to create this in Cloudinary dashboard
    cloudinaryFormData.append('folder', 'testimonials');

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();

    return NextResponse.json({ 
      url: data.secure_url,
      public_id: data.public_id,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
