import { Link, useLocation } from 'react-router-dom';
import { Calendar, Music, Image as ImageIcon, LogOut, UserCheck, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import HedwigLogo from '../common/HedwigLogo';

export default function AdminSidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Site', icon: Home, path: '/admin/hero' },
    { name: 'Agenda', icon: Calendar, path: '/admin/agenda' },
    { name: 'Lançamentos', icon: Music, path: '/admin/releases' },
    { name: 'Galeria', icon: ImageIcon, path: '/admin/gallery' },
    { name: 'Solicitações', icon: UserCheck, path: '/admin/requests' },
  ];

  return (
    <aside className="w-72 bg-secondary/30 border-r border-border min-h-screen flex flex-col p-8 sticky top-0">
      <Link to="/" className="flex items-center gap-3 mb-16">
        <div className="h-8 w-8 rounded-lg bg-primary grid place-items-center overflow-hidden p-0.5">
          <HedwigLogo className="text-background h-full w-full" />
        </div>
        <span className="font-display font-black tracking-widest text-lg">HEDWIG</span>
      </Link>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all ${
                isActive 
                  ? 'bg-primary text-background shadow-glow' 
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
}
