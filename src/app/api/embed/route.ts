import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const type = searchParams.get('type') || 'grid';
  const limit = parseInt(searchParams.get('limit') || '10');

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

    // Return JavaScript that renders the widget
    const widgetJS = `
      (function() {
        const testimonials = ${JSON.stringify(data)};
        
        function renderWidget() {
          const container = document.getElementById('testimonial-widget');
          if (!container) return;
          
          container.innerHTML = testimonials.map(t => {
            const stars = t.rating ? '<div style="color: #fbbf24; font-size: 20px; margin-bottom: 12px;">' + '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating) + '</div>' : '';
            const text = t.testimonial_text ? '<p style="color: #374151; font-style: italic; margin-bottom: 16px;">"' + t.testimonial_text + '"</p>' : '';
            const video = t.video_url ? '<video src="' + t.video_url + '" controls style="width: 100%; max-height: 256px; border-radius: 8px; margin-bottom: 16px;"></video>' : '';
            const avatar = t.image_url ? '<img src="' + t.image_url + '" alt="' + t.name + '" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;">' : '<div style="width: 48px; height: 48px; border-radius: 50%; background: #dbeafe; display: flex; align-items: center; justify-content: center; color: #2563eb; font-weight: bold;">' + t.name.charAt(0).toUpperCase() + '</div>';
            const roleText = t.role ? '<p style="font-size: 14px; color: #6b7280; margin: 0;">' + t.role + (t.company ? ' at ' + t.company : '') + '</p>' : '';
            
            return '<div class="testimonial-card" style="background: white; border-radius: 8px; padding: 24px; margin: 16px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">' +
              stars + text + video +
              '<div style="display: flex; align-items: center; gap: 12px;">' +
                avatar +
                '<div>' +
                  '<p style="font-weight: 600; color: #111827; margin: 0;">' + t.name + '</p>' +
                  roleText +
                '</div>' +
              '</div>' +
            '</div>';
          }).join('');
        }
        
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', renderWidget);
        } else {
          renderWidget();
        }
      })();
    `;

    return new NextResponse(widgetJS, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
