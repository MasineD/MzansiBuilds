import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qlviushjhkdvssxmecsq.supabase.co'
const supabaseKey = 'sb_publishable_hT1WaHKTSrMXKHIF3ZcYQQ_Q6uv_wiP'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase