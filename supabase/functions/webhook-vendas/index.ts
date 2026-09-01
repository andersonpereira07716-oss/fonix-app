import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const payload = await req.json()

    // Captura o e-mail do comprador em múltiplos formatos de gateway (Cakto, Mercado Pago, Kiwify, Hotmart)
    const email = payload.customer?.email || payload.email || payload.payer?.email || payload.buyer_email
    const status = payload.status || payload.event || payload.payment_status

    if (!email) {
      return new Response(JSON.stringify({ error: 'E-mail do cliente nao encontrado' }), { status: 400 })
    }

    const statusAprovados = ['approved', 'paid', 'payment.approved', 'purchase.approved']
    const isApproved = statusAprovados.includes(String(status).toLowerCase())

    const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    if (isApproved) {
      const { error } = await supabaseAdmin.rpc('activate_subscription', { customer_email: email })
      if (error) throw error

      return new Response(JSON.stringify({ success: true, message: `Assinatura ativada para ${email}` }), { status: 200 })
    }

    return new Response(JSON.stringify({ message: 'Pagamento pendente ou nao aprovado' }), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
