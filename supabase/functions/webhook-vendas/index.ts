import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  // Trata requisições de preflight do CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      } 
    })
  }

  try {
    const payload = await req.json().catch(() => ({}))

    // Tenta capturar o e-mail do comprador nos vários formatos da Cakto/Mercado Pago
    const email = payload.customer?.email || payload.email || payload.payer?.email || payload.buyer_email || payload.data?.buyer?.email

    // Se for apenas uma chamada de ping/teste sem e-mail, responde 200 OK para passar no teste da Cakto
    if (!email) {
      return new Response(
        JSON.stringify({ success: true, message: "Webhook ativo e pronto para receber vendas." }), 
        { headers: { "Content-Type": "application/json" }, status: 200 }
      )
    }

    const status = payload.status || payload.event || payload.payment_status || 'approved'
    const statusAprovados = ['approved', 'paid', 'payment.approved', 'purchase.approved', 'compra_aprovada']
    const isApproved = statusAprovados.includes(String(status).toLowerCase())

    const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    if (isApproved) {
      const { error } = await supabaseAdmin.rpc('activate_subscription', { customer_email: email })
      if (error) console.error("Erro na procedure SQL:", error)

      return new Response(
        JSON.stringify({ success: true, message: `Assinatura processada para ${email}` }), 
        { headers: { "Content-Type": "application/json" }, status: 200 }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Evento recebido sem alteracao de status.' }), 
      { headers: { "Content-Type": "application/json" }, status: 200 }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }), 
      { headers: { "Content-Type": "application/json" }, status: 200 }
    )
  }
})
