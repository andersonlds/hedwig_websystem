import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import HedwigLogo from '../components/common/HedwigLogo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      const msg = (err.message || '').toLowerCase();
      if (msg.includes('rate limit') || msg.includes('too many requests')) {
        setError('Muitas tentativas em pouco tempo. Aguarde alguns minutos antes de tentar novamente.');
      } else if (msg.includes('user not found') || msg.includes('invalid email')) {
        setError('E-mail não encontrado. Verifique o endereço digitado.');
      } else {
        setError('Erro ao enviar e-mail. Tente novamente em alguns minutos.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass rounded-[2.5rem] p-10 md:p-12 text-center relative z-10"
      >
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-glow grid place-items-center mx-auto mb-8 overflow-hidden p-2">
          <HedwigLogo className="text-background h-full w-full" />
        </div>

        {sent ? (
          /* Success State */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-black text-foreground mb-4 tracking-tight uppercase">
              E-mail Enviado!
            </h1>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              Verifique sua caixa de entrada em <span className="text-primary font-bold">{email}</span> e clique no link para redefinir sua senha.
            </p>
            <p className="text-muted-foreground/50 text-xs mb-8">
              Não recebeu? Verifique a pasta de spam ou tente novamente.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(''); }}
              className="text-[10px] font-black text-primary-glow uppercase tracking-[0.2em] hover:text-primary transition-colors"
            >
              Tentar com outro e-mail
            </button>
          </motion.div>
        ) : (
          /* Form State */
          <>
            <h1 className="text-3xl font-display font-black text-foreground mb-4 tracking-tight uppercase">
              Recuperar Senha
            </h1>
            <p className="text-muted-foreground text-sm mb-10 leading-relaxed">
              Digite seu e-mail de administrador e enviaremos um link para redefinir sua senha.
            </p>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3 mb-8 text-left animate-in fade-in">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@exemplo.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full mt-6 py-5 rounded-full bg-primary text-background font-black tracking-widest text-xs hover:bg-primary-glow transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                ) : (
                  'ENVIAR LINK DE RECUPERAÇÃO'
                )}
              </button>
            </form>
          </>
        )}

        <div className="mt-8 pt-8 border-t border-white/5">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Voltar para o Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
