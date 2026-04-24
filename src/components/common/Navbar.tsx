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

  // Bloqueia scroll enquanto menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 350);
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
    <>
      {/* ── Barra principal ── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500
        ${isMobileMenuOpen ? '' : isScrolled ? 'py-4' : 'py-6'}`}
      >
        <div className={`mx-auto max-w-7xl px-4 min-[900px]:px-6 flex items-center justify-between transition-all duration-500
          ${!isMobileMenuOpen && isScrolled ? 'glass rounded-full py-2 shadow-lg' : ''}
          ${isMobileMenuOpen ? 'py-5' : ''}`}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group flex-shrink-0"
          >
            <div className="h-9 w-9 min-[900px]:h-10 min-[900px]:w-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-glow grid place-items-center overflow-hidden p-1">
              <HedwigLogo className="text-background h-full w-full" />
            </div>
            <span className="font-display font-black tracking-widest text-base min-[900px]:text-lg text-foreground group-hover:text-primary transition-colors">
              HEDWIG
            </span>
          </button>

          {/* Desktop Nav — visível em 900px+ */}
          <div className="hidden min-[900px]:flex items-center gap-4 xl:gap-7">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="text-[10px] xl:text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
              </button>
            ))}
            <Link
              to="/admin"
              className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-all"
            >
              <User className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Toggle — visível abaixo de 900px */}
          <button
            className="min-[900px]:hidden text-foreground p-2 z-10 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* ── Overlay full-screen menu mobile (abaixo de 900px) ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="min-[900px]:hidden fixed inset-0 z-40 flex flex-col"
            style={{ background: 'rgba(10, 6, 20, 0.98)' }}
          >
            <div className="h-[72px] flex-shrink-0 border-b border-white/10" />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="flex flex-col gap-6 px-8 py-10 overflow-y-auto"
            >
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                  onClick={() => scrollToSection(link.id)}
                  className="flex items-center gap-4 text-sm font-bold tracking-widest text-foreground hover:text-primary transition-colors text-left"
                >
                  <link.icon className="h-4 w-4 text-primary flex-shrink-0" />
                  {link.name}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + navLinks.length * 0.05 }}
              >
                <Link
                  to="/admin"
                  className="flex items-center gap-4 text-sm font-bold tracking-widest text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4 flex-shrink-0" />
                  ADMIN PANEL
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
