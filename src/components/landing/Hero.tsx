import { useState, useEffect } from 'react';
import { Play, X, Maximize2 } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

interface HeroConfig {
  subtitle: string;
  title_line1: string;
  title_line2: string;
  spotify_link: string;
  image_url: string;
}

export default function Hero() {
  const [config, setConfig] = useState<HeroConfig | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchHero = async () => {
      const { data } = await supabase.from('hero_config').select('*').eq('id', 1).single();
      if (data) setConfig(data);
    };
    fetchHero();
  }, []);

  const subtitle = config?.subtitle || 'Deep Progressive Melodic Psytrance';
  const line1 = config?.title_line1 || 'A JORNADA';
  const line2 = config?.title_line2 || 'HEDWIG';
  const bgImage = config?.image_url || 'https://images.unsplash.com/photo-1574434311832-64563023836d?q=80&w=2000&auto=format&fit=crop';
  const spotifyLink = config?.spotify_link || '#lancamentos';

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <>
      <motion.div 
        layout
        id="sobre" 
        onClick={toggleExpand}
        className={`
          ${isExpanded 
            ? 'fixed inset-0 z-[100] rounded-none cursor-zoom-out' 
            : 'col-span-12 lg:col-span-8 lg:row-span-3 min-h-[360px] lg:min-h-[480px] rounded-2xl lg:rounded-3xl relative cursor-zoom-in'
          } 
          overflow-hidden glass group transition-all duration-500
        `}
      >
        {/* Overlay para expansão */}
        <div className={`absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10 transition-opacity duration-500 ${isExpanded ? 'opacity-80' : 'opacity-100'}`} />
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
           <motion.img 
             layout
             src={bgImage} 
             className={`
               w-full h-full object-cover transition-all duration-1000
               ${isExpanded 
                 ? 'grayscale-0 opacity-100 scale-105 mix-blend-normal' 
                 : 'opacity-60 mix-blend-luminosity grayscale contrast-125 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 group-hover:mix-blend-normal'
               }
             `}
             alt="Hero background"
           />
        </div>
        
        {/* Conteúdo */}
        <div className={`relative z-20 h-full flex flex-col justify-center transition-all duration-700 ${isExpanded ? 'p-10 md:p-20 lg:p-32' : 'p-6 md:p-10 lg:p-12 xl:p-16'}`}>
          <ScrollReveal>
            <motion.p layout className="text-primary font-mono text-[10px] md:text-xs mb-3 tracking-[0.4em] uppercase">{subtitle}</motion.p>
            <motion.h1 
              layout
              className={`
                font-display font-black mb-6 leading-[0.95] tracking-tighter uppercase
                ${isExpanded ? 'text-5xl md:text-7xl lg:text-9xl' : 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl'}
              `}
            >
              {line1} <br/>
              <span className="text-gradient">{line2}</span>
            </motion.h1>
            
            <motion.div layout className="flex flex-wrap gap-4 items-center">
              <a 
                href={spotifyLink} 
                target={spotifyLink.startsWith('http') ? '_blank' : '_self'} 
                rel="noreferrer" 
                className="bg-primary text-black px-6 md:px-10 py-3 md:py-5 rounded-full font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-primary-glow transition-all flex items-center gap-3 group shadow-glow"
                onClick={(e) => e.stopPropagation()} // Não fecha o hero ao clicar no botão
              >
                LISTEN ON SPOTIFY <Play size={isExpanded ? 18 : 14} fill="black" />
              </a>

              {!isExpanded && (
                <div className="hidden md:flex items-center gap-2 text-white/40 text-[10px] font-bold tracking-widest uppercase animate-pulse">
                  <Maximize2 size={12} /> Clique para expandir
                </div>
              )}
            </motion.div>
          </ScrollReveal>
        </div>

        {/* Botão de Fechar */}
        <AnimatePresence>
          {isExpanded && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand();
              }}
              className="absolute top-8 right-8 z-[110] bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-full text-white transition-all group"
            >
              <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Placeholder para manter o espaço no grid quando estiver expandido */}
      {isExpanded && (
        <div className="col-span-12 lg:col-span-8 lg:row-span-3 min-h-[360px] lg:min-h-[480px] bg-white/5 rounded-3xl animate-pulse" />
      )}
    </>
  );
}
