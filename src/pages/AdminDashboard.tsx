import { useState, useRef, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import InactivityGuard from '../components/admin/InactivityGuard';
import ManageAgenda from '../components/admin/ManageAgenda';
import ManageReleases from '../components/admin/ManageReleases';
import ManageGallery from '../components/admin/ManageGallery';
import ManageRequests from '../components/admin/ManageRequests';
import ManageHero from '../components/admin/ManageHero';
import { User, Menu, LogOut, ShieldCheck, Mail } from 'lucide-react';
import HedwigLogo from '../components/common/HedwigLogo';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminDashboard() {
  const { user, isAdmin, loading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Segunda camada de segurança: Se por algum erro de estado o componente renderizar sem ser admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      logout();
      navigate('/login');
    }
  }, [user, isAdmin, loading, navigate, logout]);

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      <InactivityGuard />
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-secondary/30 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary grid place-items-center overflow-hidden p-0.5">
            <HedwigLogo className="text-background h-full w-full" />
          </div>
          <span className="font-display font-black tracking-widest text-sm uppercase">Admin</span>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-foreground/70 hover:text-foreground"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto h-full">
        {/* Header Info */}
        <div className="flex items-center justify-between md:justify-end gap-4 mb-8 md:mb-12">
          <div className="md:hidden text-xs font-bold tracking-widest text-primary-glow uppercase">
            Dashboard
          </div>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`flex items-center gap-3 p-1.5 pr-4 rounded-full transition-all duration-300 ${
                isUserMenuOpen ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="text-right hidden sm:block ml-2">
                <div className="text-[10px] md:text-xs font-bold tracking-widest text-foreground uppercase truncate max-w-[150px]">
                  {user?.email?.split('@')[0]}
                </div>
                <div className="text-[8px] md:text-[10px] font-medium text-primary-glow uppercase tracking-widest">
                  Admin
                </div>
              </div>
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden shadow-lg">
                {user?.user_metadata?.avatar_url
                  ? <img src={user.user_metadata.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  : <User className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                }
              </div>
            </button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-64 glass rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Sessão Ativa</p>
                        <p className="text-xs font-bold text-foreground">Administrador</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="text-[10px] truncate">{user?.email}</span>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair do Painel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/admin/hero" replace />} />
          <Route path="/hero" element={<ManageHero />} />
          <Route path="/agenda" element={<ManageAgenda />} />
          <Route path="/releases" element={<ManageReleases />} />
          <Route path="/gallery" element={<ManageGallery />} />
          <Route path="/requests" element={<ManageRequests />} />
        </Routes>
      </main>
    </div>
  );
}
