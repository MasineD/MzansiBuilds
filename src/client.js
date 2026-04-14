// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://qlviushjhkdvssxmecsq.supabase.co'
// const supabaseKey = 'sb_publishable_hT1WaHKTSrMXKHIF3ZcYQQ_Q6uv_wiP'
// const supabase = createClient(supabaseUrl, supabaseKey)

// export default supabase
import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Create and export the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase