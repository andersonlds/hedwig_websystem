import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Music, Calendar, Image as ImageIcon, Mail, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'SOBRE', href: '#sobre', icon: User },
    { name: 'LANÇAMENTOS', href: '#lancamentos', icon: Music },
    { name: 'PLAYLIST', href: '#playlist', icon: Music },
    { name: 'GALERIA', href: '#galeria', icon: ImageIcon },
    { name: 'AGENDA', href: '#agenda', icon: Calendar },
    { name: 'CONTATO', href: '#contato', icon: Mail },
  ];

  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-6'}`}>
      <div className={`mx-auto max-w-7xl px-6 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'glass rounded-full py-2 shadow-lg' : ''}`}>
        <a href="#top" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-glow grid place-items-center">
             <Music className="text-background h-5 w-5" />
          </div>
          <span className="font-display font-black tracking-widest text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">
            HEDWIG
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={isHome ? link.href : `/${link.href}`}
              className="text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
          <Link 
            to="/admin" 
            className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-all"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-foreground p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-sm font-bold tracking-widest text-foreground hover:text-primary transition-colors"
                >
                  <link.icon className="h-4 w-4 text-primary" />
                  {link.name}
                </a>
              ))}
              <Link
                to="/admin"
                className="flex items-center gap-4 text-sm font-bold tracking-widest text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                ADMIN PANEL
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
