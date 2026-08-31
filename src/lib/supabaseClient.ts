import { createClient } from '@supabase/supabase-js'

// FASE 2: este cliente passa a ser usado pelos serviços em src/services/
// (auth, devices, events, incidents, locations, notifications).
// As variáveis abaixo NUNCA devem conter a service_role key — apenas a
// chave pública (anon) protegida por Row Level Security (RLS).

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Em desenvolvimento na FASE 1 isso é esperado — o app ainda usa dados mock.
  console.warn(
    '[FÔNIX] Variáveis VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não configuradas.',
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')
