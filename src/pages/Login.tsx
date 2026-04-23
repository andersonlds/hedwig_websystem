import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Music, LogIn, ShieldAlert, Mail, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const { user, isAdmin, login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      if (isRegistering) {
        await register(email, password);
        setSuccess('Conta criada! Verifique seu e-mail ou fale com o administrador.');
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar operação. Verifique seus dados.');
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
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-glow grid place-items-center mx-auto mb-8">
          <Music className="text-background h-8 w-8" />
        </div>
        
        <h1 className="text-3xl font-display font-black text-foreground mb-4 tracking-tight uppercase">
          {isRegistering ? 'Criar Conta' : 'Painel Admin'}
        </h1>
        <p className="text-muted-foreground text-sm mb-10 leading-relaxed">
          {isRegistering 
            ? 'Cadastre-se para solicitar acesso ao gerenciamento.' 
            : 'Área restrita. Entre com suas credenciais de administrador.'}
        </p>

        {user && !isAdmin && (
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-3 mb-8 text-left">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span>Acesso Negado: Sua conta ainda não foi autorizada como administrador.</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-3 mb-8 text-left animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center gap-3 mb-8 text-left animate-in fade-in slide-in-from-top-2">
            <ShieldAlert className="h-5 w-5 shrink-0 text-primary" />
            <span>{success}</span>
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

        <button 
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError(null);
            setSuccess(null);
          }}
          className="mt-6 text-[10px] font-black text-primary-glow uppercase tracking-[0.2em] hover:text-primary transition-colors"
        >
          {isRegistering ? 'Já tenho uma conta? Entrar' : 'Não tem conta? Cadastre-se'}
        </button>
        
        <div className="mt-8 pt-8 border-t border-white/5">
          <a href="/" className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] hover:text-foreground transition-colors">
            VOLTAR PARA O SITE
          </a>
        </div>
      </motion.div>
    </div>
  );
}
