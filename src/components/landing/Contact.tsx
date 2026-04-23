import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Contact() {
  const [config, setConfig] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Verificar no banco se este e-mail já enviou mensagem nos últimos 5 dias
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

      const { data: existingContact, error: checkError } = await supabase
        .from('contacts')
        .select('id')
        .eq('email', formData.email)
        .gt('created_at', fiveDaysAgo.toISOString())
        .limit(1);

      if (checkError) throw checkError;

      if (existingContact && existingContact.length > 0) {
        alert("Aguarde - Entraremos em Contato");
        setLoading(false);
        return;
      }

      // 2. Salvar no Banco de Dados
      const { error: saveError } = await supabase
        .from('contacts')
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            message: formData.message 
          }
        ]);

      if (saveError) throw saveError;

      // 3. Enviar o e-mail via FormSubmit.co
      const response = await fetch(`https://formsubmit.co/ajax/${bookingEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `Novo Contato Registrado: ${formData.name}`,
          _template: "table"
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error("Erro no processo de contato:", error);
      alert("Houve um erro ao processar seu sinal. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contato" className="col-span-12 glass rounded-2xl md:rounded-[2.5rem] p-8 md:p-12 mb-12 relative overflow-hidden group">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(147,51,234,0.1)_0%,transparent_50%)] pointer-events-none" />
       <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
             <span className="text-primary font-mono text-[10px] mb-4 tracking-[0.4em] uppercase block">{label}</span>
             <h2 className="text-3xl md:text-5xl font-display font-black leading-tight tracking-tighter mb-4">{line1} <br /> <span className="text-gradient">{line2}</span></h2>
             <p className="text-white/40 text-sm max-w-sm mb-8">{description}</p>
             <a href={`mailto:${bookingEmail}`} className="text-primary text-xs font-black uppercase tracking-widest underline underline-offset-8 decoration-primary/20 hover:decoration-primary transition-all">{bookingEmail}</a>
          </div>
          {submitted ? (
             <div className="bg-primary/10 border border-primary/20 rounded-3xl p-12 text-center flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 shadow-glow">
                   <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                   </svg>
                </div>
                <h3 className="text-xl font-display font-black mb-2 tracking-tight">SINAL ENVIADO!</h3>
                <p className="text-white/40 text-sm">Verifique seu aplicativo de e-mail para confirmar o envio.</p>
             </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
               <div className="grid grid-cols-2 gap-4">
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
                 {loading ? 'TRANSMITTING...' : 'SEND SIGNAL'}
               </button>
            </form>
          )}
       </div>
    </div>
  );
}
