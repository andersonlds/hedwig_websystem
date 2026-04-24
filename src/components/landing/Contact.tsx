import { useState, useEffect, FormEvent } from 'react';
import { supabase } from '../../lib/supabase';

export default function Contact() {
  const [config, setConfig] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from('hero_config').select('*').eq('id', 1).single();
      if (data) setConfig(data);
    };
    fetchConfig();
  }, []);

  const label = config?.contact_label || 'Connect';
  const line1 = config?.contact_title_line1 || 'LETS CREATE';
  const line2 = config?.contact_title_line2 || 'A SONIC VOYAGE';
  const description = config?.contact_description || 'Disponível para bookings, parcerias e demos. Transformando mentes através de batidas complexas.';
  const bookingEmail = config?.booking_email || 'booking@hedwig.live';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 0. Verifica com o "porteiro" (RPC) se o usuário enviou mensagem nos últimos 5 dias
      const { data: hasSentRecently, error: rpcError } = await supabase.rpc('check_recent_contact', {
        user_email: formData.email
      });

      if (rpcError) {
        console.error("Erro na verificação de limite:", rpcError);
        // Em caso de erro na checagem, podemos optar por barrar ou permitir. 
        // Vamos permitir para não bloquear envios legítimos se o banco falhar na leitura.
      } else if (hasSentRecently === true) {
        // Já enviou nos últimos 5 dias
        setRateLimited(true);
        setLoading(false);
        // Opcional: resetar após alguns segundos para permitir nova digitação
        setTimeout(() => setRateLimited(false), 8000);
        return; // Interrompe o processo aqui
      }

      // 1. Salva diretamente no Supabase (Sem precisar de Edge Function)
      const { error: dbError } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name,
          email: formData.email,
          message: formData.message
        }]);

      if (dbError) throw dbError;

      // 2. Envia o e-mail via FormSubmit.co
      const emailResponse = await fetch(`https://formsubmit.co/ajax/${bookingEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `Novo Contato HEDWIG: ${formData.name}`,
          _template: "table"
        }),
      });

      if (emailResponse.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error('Erro ao enviar e-mail.');
      }

    } catch (error: any) {
      console.error("Erro no processo de contato:", error);
      alert("Erro ao enviar contato. Verifique sua conexão ou tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contato" className="col-span-12 glass rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-12 mb-12 relative overflow-hidden group">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(147,51,234,0.1)_0%,transparent_50%)] pointer-events-none" />
       <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
             <span className="text-primary font-mono text-[10px] mb-4 tracking-[0.4em] uppercase block">{label}</span>
             <h2 className="text-2xl md:text-3xl lg:text-5xl font-display font-black leading-tight tracking-tighter mb-4">{line1} <br /> <span className="text-gradient">{line2}</span></h2>
             <p className="text-white/40 text-sm max-w-sm mb-8">{description}</p>
             <a href={`mailto:${bookingEmail}`} className="text-primary text-xs font-black uppercase tracking-widest underline underline-offset-8 decoration-primary/20 hover:decoration-primary transition-all">{bookingEmail}</a>
          </div>
          {rateLimited ? (
             <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-12 text-center flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6 shadow-glow">
                   <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                </div>
                <h3 className="text-xl font-display font-black mb-2 tracking-tight text-yellow-500 uppercase">Aguarde um momento</h3>
                <p className="text-white/60 text-sm">Você já nos enviou uma mensagem recentemente. Por favor, aguarde o nosso retorno antes de enviar novamente.</p>
             </div>
          ) : submitted ? (
             <div className="bg-primary/10 border border-primary/20 rounded-3xl p-12 text-center flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 shadow-glow">
                   <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                   </svg>
                </div>
                <h3 className="text-xl font-display font-black mb-2 tracking-tight">E-MAIL ENVIADO!</h3>
                <p className="text-white/40 text-sm">Obrigado pelo contato. Responderemos em breve.</p>
             </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <input 
                    type="text" 
                    placeholder="NAME" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-[10px] font-bold tracking-widest text-white focus:border-primary outline-none transition-all" 
                  />
                  <input 
                    type="email" 
                    placeholder="EMAIL" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-[10px] font-bold tracking-widest text-white focus:border-primary outline-none transition-all" 
                  />
               </div>
               <textarea
                 rows={3} 
                 placeholder="MESSAGE" 
                 required
                 value={formData.message}
                 onChange={e => setFormData({...formData, message: e.target.value})}
                 className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-[10px] font-bold tracking-widest text-white focus:border-primary outline-none transition-all resize-none" 
               />
               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full py-4 bg-primary text-black font-black text-xs tracking-[0.2em] rounded-xl hover:bg-primary-glow hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-wait"
               >
                 {loading ? 'ENVIANDO...' : 'ENVIAR E-MAIL'}
               </button>
            </form>
          )}
       </div>
    </div>
  );
}
