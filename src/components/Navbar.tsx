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

  // Bloqueia o scroll da página enquanto o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

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
    <>
      {/* ── Barra de navegação principal ── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500
          ${isMobileMenuOpen ? '' : isScrolled ? 'py-4' : 'py-6'}`}
      >
        <div
          className={`mx-auto max-w-7xl px-6 flex items-center justify-between transition-all duration-500
            ${!isMobileMenuOpen && isScrolled ? 'glass rounded-full py-2 shadow-lg' : ''}
            ${isMobileMenuOpen ? 'py-5' : ''}`}
        >
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
            className="md:hidden text-foreground p-2 z-10 relative"
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

      {/* ── Overlay full-screen do menu mobile ──
           Renderizado fora do <nav> para evitar conflito de stacking context.
           z-40 = abaixo do nav (z-50), acima de todo o conteúdo da página. ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 z-40 flex flex-col"
            style={{ background: 'rgba(10, 6, 20, 0.98)' }}
          >
            {/* Espaço reservado para a barra do nav acima */}
            <div className="h-[72px] flex-shrink-0 border-b border-white/10" />

            {/* Itens do menu */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="flex flex-col gap-6 px-8 py-10 overflow-y-auto"
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-sm font-bold tracking-widest text-foreground hover:text-primary transition-colors"
                >
                  <link.icon className="h-4 w-4 text-primary flex-shrink-0" />
                  {link.name}
                </motion.a>
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
