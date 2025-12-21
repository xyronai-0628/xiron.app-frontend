import { createClient } from '@supabase/supabase-js'

// Require environment variables - no hardcoded fallbacks for security
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase configuration is missing!')
    console.error('   Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        storageKey: 'xiron-auth',
        storage: window.localStorage
    }
})

// Helper to get current session token
export async function getAuthToken() {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || null
}
