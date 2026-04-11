import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://knauxgxfwcahtvadtuun.supabase.co"
const supabaseKey = "sb_publishable_LtoH1ysWFsJfkdp-Xs_3WQ_tO21VEdA"
// const supabaseKey = process.env.SUPABASE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)