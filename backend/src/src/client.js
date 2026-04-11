
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://fnzirkhevawzfqiyoduu.supabase.co'
const supabaseKey = 'sb_publishable_B-k_ymSCh3TN5BRM51SWhg_q3FZxN3y'
// const supabaseKey = process.env.SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)