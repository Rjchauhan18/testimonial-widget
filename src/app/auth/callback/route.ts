import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'
  
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url))
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code:', error)
      return NextResponse.redirect(new URL('/login?error=verification_failed', request.url))
    }
    
    // Successfully exchanged code for session
    // data.session contains the session, data.user contains user info
    
    // Create NextResponse with cookies from the session
    const response = NextResponse.redirect(new URL(next, request.url))
    
    // The session is already set by exchangeCodeForSession via cookies
    // Just redirect to dashboard
    return response
  } catch (err: any) {
    console.error('Auth callback error:', err)
    return NextResponse.redirect(new URL('/login?error=verification_failed', request.url))
  }
}
