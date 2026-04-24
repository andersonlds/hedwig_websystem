import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import HedwigLogo from '../components/common/HedwigLogo';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const [checking, setChecking] = useState(true);

  // Supabase automatically sets a session when the user arrives via the reset link
  // The token is in the URL hash (#access_token=...&type=recovery)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setHasSession(true);
      } else {
        setHasSession(false);
      }
      setChecking(false);
    });

    // Also listen for the SIGNED_IN event triggered by the reset link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setHasSession(true);
        setChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setDone(true);
      // Sign out so user has to login fresh with new password
      await supabase.auth.signOut();
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao redefinir senha. O link pode ter expirado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold tracking-[0.3em] text-muted-foreground uppercase">Verificando link...</p>
      </div>
    );
  }

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

        {/* Invalid / expired link */}
        {!hasSession && !done && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="h-16 w-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-display font-black text-foreground mb-4 tracking-tight uppercase">
              Link Inválido
            </h1>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              Este link de redefinição é inválido ou já expirou. Solicite um novo link de recuperação.
            </p>
            <Link
              to="/forgot-password"
              className="inline-block py-4 px-10 rounded-full bg-primary text-background font-black tracking-widest text-xs hover:bg-primary-glow transition-all"
            >
              SOLICITAR NOVO LINK
            </Link>
          </motion.div>
        )}

        {/* Password reset form */}
        {hasSession && !done && (
          <>
            <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-black text-foreground mb-4 tracking-tight uppercase">
              Nova Senha
            </h1>
            <p className="text-muted-foreground text-sm mb-10 leading-relaxed">
              Escolha uma senha forte para proteger seu acesso ao painel administrativo.
            </p>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3 mb-8 text-left animate-in fade-in">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Nova Senha</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Confirmar Nova Senha</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
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
                  'REDEFINIR SENHA'
                )}
              </button>
            </form>
          </>
        )}

        {/* Success */}
        {done && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-black text-foreground mb-4 tracking-tight uppercase">
              Senha Redefinida!
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sua senha foi atualizada com sucesso. Redirecionando para o login...
            </p>
            <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-[grow_3s_linear_forwards]" style={{ animation: 'none', transition: 'width 3s linear', width: '100%' }} />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
