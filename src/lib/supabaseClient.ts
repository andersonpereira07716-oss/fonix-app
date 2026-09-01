import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ipobpnienaetzioqcmfp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_BEHvgnC0GyUjFJYrbBe-1w_t7R67bIC';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
