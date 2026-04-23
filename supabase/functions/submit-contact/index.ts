// supabase/functions/submit-contact/index.ts
// Edge Function — roda no servidor com service_role key, bypassando RLS.
// Responsável por: checar rate limit (5 dias por e-mail) + salvar no banco.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Responde ao preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'method_not_allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { name, email, message } = await req.json();

    // Validação básica dos campos
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'validation_error', message: 'Todos os campos são obrigatórios.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Cliente com service_role — bypassa RLS completamente (seguro pois roda no servidor)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // ── Verificação de Rate Limit (1 envio por e-mail a cada 5 dias) ──────────
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const { data: existing, error: checkError } = await supabase
      .from('contacts')
      .select('id')
      .eq('email', email)
      .gt('created_at', fiveDaysAgo.toISOString())
      .limit(1);

    if (checkError) {
      console.error('Erro ao verificar rate limit:', checkError.message);
      throw new Error(checkError.message);
    }

    if (existing && existing.length > 0) {
      // E-mail já enviou mensagem nos últimos 5 dias
      return new Response(
        JSON.stringify({
          error: 'rate_limited',
          message: 'Aguarde - Entraremos em Contato',
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── Inserção no Banco ─────────────────────────────────────────────────────
    const { error: insertError } = await supabase
      .from('contacts')
      .insert([{ name, email, message }]);

    if (insertError) {
      console.error('Erro ao inserir contato:', insertError.message);
      throw new Error(insertError.message);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro inesperado na Edge Function:', error);
    return new Response(
      JSON.stringify({
        error: 'server_error',
        message: 'Erro interno. Tente novamente mais tarde.',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
