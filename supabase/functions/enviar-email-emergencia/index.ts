import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const payload = await req.json()
    const emergencia = payload.record || payload.emergencia || payload

    if (!emergencia) {
      return new Response(JSON.stringify({ error: 'Dados da emergencia nao informados' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const supabaseAdmin = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: contatos, error: errContatos } = await supabaseAdmin
      .from('contatos_emergencia')
      .select('email, nome')
      .eq('ativo', true)

    if (errContatos || !contatos || contatos.length === 0) {
      throw new Error('Nenhum contato de emergencia encontrado.')
    }

    const emailsDestino = contatos.map((c: any) => c.email)

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'FÔNIX Segurança <alerta@fonixseguranca.com>',
        to: emailsDestino,
        subject: `🚨 ALERTA DE EMERGÊNCIA - FÔNIX`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #e53e3e; background-color: #fff5f5; color: #1a202c;">
            <h1 style="color: #c53030;">🚨 ALERTA DE EMERGÊNCIA DISPARADO</h1>
            <p><strong>Usuário / Origem:</strong> ${emergencia.user_email || 'Não identificado'}</p>
            <p><strong>Localização:</strong> <a href="${emergencia.map_url}" target="_blank">Ver no Google Maps</a></p>
            <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <hr />
            <p style="font-size: 12px; color: #718096;">Este é um alerta automático gerado pelo App FÔNIX.</p>
          </div>
        `
      })
    })

    const resendData = await resendResponse.json()

    return new Response(JSON.stringify({ success: true, data: resendData }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 500,
    })
  }
})
