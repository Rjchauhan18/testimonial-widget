import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'
  
  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code:', error)
        return NextResponse.redirect(new URL('/login?error=verification_failed', request.url))
      }
      
      // Redirect to dashboard or the 'next' URL
      return NextResponse.redirect(new URL(next, request.url))
    } catch (err) {
      console.error('Auth callback error:', err)
      return NextResponse.redirect(new URL('/login?error=verification_failed', request.url))
    }
  }
  
  // No code, redirect to login
  return NextResponse.redirect(new URL('/login?error=no_code', request.url))
}
