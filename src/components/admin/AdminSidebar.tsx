import { Link, useLocation } from 'react-router-dom';
import { Calendar, Music, Image as ImageIcon, LogOut, UserCheck, Home, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import HedwigLogo from '../common/HedwigLogo';
import { motion, AnimatePresence } from 'motion/react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Site', icon: Home, path: '/admin/hero' },
    { name: 'Agenda', icon: Calendar, path: '/admin/agenda' },
    { name: 'Lançamentos', icon: Music, path: '/admin/releases' },
    { name: 'Galeria', icon: ImageIcon, path: '/admin/gallery' },
    { name: 'Solicitações', icon: UserCheck, path: '/admin/requests' },
  ];

  const SidebarContent = (
    <aside className="w-72 bg-secondary/80 backdrop-blur-xl border-r border-border h-full flex flex-col p-8">
      <div className="flex items-center justify-between mb-16">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary grid place-items-center overflow-hidden p-0.5">
            <HedwigLogo className="text-background h-full w-full" />
          </div>
          <span className="font-display font-black tracking-widest text-lg">HEDWIG</span>
        </Link>
        <button onClick={onClose} className="md:hidden p-2 text-foreground/50 hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => { if (window.innerWidth < 768) onClose(); }}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all ${
                isActive 
                  ? 'bg-primary text-black shadow-glow' 
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="mt-8 flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold tracking-widest uppercase text-destructive hover:bg-destructive/10 transition-all"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </button>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        {SidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative h-full"
            >
              {SidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
