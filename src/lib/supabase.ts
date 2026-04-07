import { createBrowserClient } from '@supabase/ssr'
import { createClient as createServerClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client - use this in client components for proper cookie handling
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Server client - use this in server components and API routes
export const createServerSupabaseClient = () => createServerClient(supabaseUrl, supabaseAnonKey)
