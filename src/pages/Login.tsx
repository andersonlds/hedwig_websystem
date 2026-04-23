import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, ShieldAlert, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import HedwigLogo from '../components/common/HedwigLogo';

export default function Login() {
  const { user, isAdmin, login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate password confirmation on register
    if (isRegistering && password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (isRegistering && password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isRegistering) {
        const { needsConfirmation } = await register(email, password);
        if (needsConfirmation) {
          setRegistered(true);
          setSuccess('Conta criada! Confirme seu e-mail para continuar. Após confirmar, aguarde aprovação do administrador.');
        } else {
          setSuccess('Conta criada! Aguarde aprovação do administrador para acessar o painel.');
        }
      } else {
        await login(email, password);
        // navigation happens via useEffect when user+isAdmin are set
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('User already registered')) {
        setError('Este e-mail já está cadastrado. Tente fazer login.');
      } else if (msg.includes('Invalid login credentials')) {
        setError('E-mail ou senha incorretos.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.');
      } else {
        setError(msg || 'Erro ao realizar operação. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decor */}
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

        <h1 className="text-3xl font-display font-black text-foreground mb-4 tracking-tight uppercase">
          {isRegistering ? 'Criar Conta' : 'Painel Admin'}
        </h1>
        <p className="text-muted-foreground text-sm mb-10 leading-relaxed">
          {isRegistering
            ? 'Cadastre-se para solicitar acesso ao gerenciamento.'
            : 'Área restrita. Entre com suas credenciais de administrador.'}
        </p>

        {/* Pending approval message */}
        {user && !isAdmin && (
          <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold flex items-center gap-3 mb-8 text-left">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span>Acesso Pendente: Sua conta ainda não foi aprovada pelo administrador.</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3 mb-8 text-left animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center gap-3 mb-8 text-left animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form - hidden after successful registration that needs email confirm */}
        {!registered && (
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

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Senha</label>
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

            {isRegistering && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Confirmar Senha</label>
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
            )}

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full mt-8 py-5 rounded-full bg-foreground text-background font-black tracking-widest text-xs hover:bg-primary transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  {isRegistering ? 'CADASTRAR' : 'ACESSAR PAINEL'}
                </>
              )}
            </button>
          </form>
        )}

        {registered && (
          <button
            onClick={() => { setRegistered(false); setIsRegistering(false); setSuccess(null); setEmail(''); setPassword(''); setConfirmPassword(''); }}
            className="w-full mt-4 py-5 rounded-full bg-white/10 text-foreground font-black tracking-widest text-xs hover:bg-white/20 transition-all"
          >
            IR PARA LOGIN
          </button>
        )}

        {!registered && (
          <div className="flex flex-col items-center gap-3 mt-6">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
                setSuccess(null);
                setConfirmPassword('');
              }}
              className="text-[10px] font-black text-primary-glow uppercase tracking-[0.2em] hover:text-primary transition-colors"
            >
              {isRegistering ? 'Já tenho uma conta? Entrar' : 'Não tem conta? Cadastre-se'}
            </button>

            {!isRegistering && (
              <Link
                to="/forgot-password"
                className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] hover:text-foreground transition-colors"
              >
                Esqueceu a senha?
              </Link>
            )}
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-white/5">
          <a href="/" className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] hover:text-foreground transition-colors">
            VOLTAR PARA O SITE
          </a>
        </div>
      </motion.div>
    </div>
  );
}
