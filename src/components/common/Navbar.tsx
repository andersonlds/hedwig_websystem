import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Music, Calendar, Image as ImageIcon, Mail, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import HedwigLogo from './HedwigLogo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    // Close mobile menu first, then wait for animation to finish before scrolling
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const navbarHeight = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 350); // matches mobile menu exit animation duration
  };

  const navLinks = [
    { name: 'SOBRE',       id: 'sobre',      icon: User },
    { name: 'LANÇAMENTOS', id: 'lancamentos', icon: Music },
    { name: 'PLAYLIST',    id: 'playlist',    icon: Music },
    { name: 'GALERIA',     id: 'galeria',     icon: ImageIcon },
    { name: 'AGENDA',      id: 'agenda',      icon: Calendar },
    { name: 'CONTATO',     id: 'contato',     icon: Mail },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-6'}`}>
      <div className={`mx-auto max-w-7xl px-6 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'glass rounded-full py-2 shadow-lg' : ''}`}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 group"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-glow grid place-items-center overflow-hidden p-1">
            <HedwigLogo className="text-background h-full w-full" />
          </div>
          <span className="font-display font-black tracking-widest text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">
            HEDWIG
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.id)}
              className="text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
            </button>
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
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className="flex items-center gap-4 text-sm font-bold tracking-widest text-foreground hover:text-primary transition-colors"
                >
                  <link.icon className="h-4 w-4 text-primary" />
                  {link.name}
                </button>
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
