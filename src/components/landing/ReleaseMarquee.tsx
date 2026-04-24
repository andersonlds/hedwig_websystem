import { useRef, useState, useEffect } from 'react';
import { Release } from '../../types';
import { motion, useMotionValue, useAnimationFrame } from 'motion/react';

interface ReleaseMarqueeProps {
  releases: Release[];
}

export default function ReleaseMarquee({ releases }: ReleaseMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // O valor principal que controla a posição
  const x = useMotionValue(0);
  
  // Estados para controle de interação
  const [isDragging, setIsDragging] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);
  const speed = -1.2; // Velocidade base (negativo = esquerda)

  // Calcula a largura de UM ciclo da lista (já que vamos triplicar)
  useEffect(() => {
    if (contentRef.current && releases.length > 0) {
      setContentWidth(contentRef.current.scrollWidth / 3);
    }
  }, [releases]);

  // Loop de animação contínua
  useAnimationFrame((_, delta) => {
    if (isDragging || contentWidth === 0) return;

    let currentX = x.get();
    let moveBy = speed * (delta / 16);
    let nextX = currentX + moveBy;

    if (nextX <= -contentWidth) nextX += contentWidth;
    else if (nextX > 0) nextX -= contentWidth;

    x.set(nextX);
  });

  // Função para lidar com o drag manual
  const handleDrag = (_: any, info: any) => {
    let currentX = x.get();
    let nextX = currentX + info.delta.x;

    if (nextX <= -contentWidth) nextX += contentWidth;
    if (nextX > 0) nextX -= contentWidth;

    x.set(nextX);
  };

  const handleTap = (url: string) => {
    // Abrir link em nova aba apenas se não estiver arrastando
    window.open(url, '_blank');
  };

  return (
    <div 
      id="lancamentos" 
      className="col-span-12 row-span-1 glass bg-primary/5 rounded-2xl md:rounded-3xl overflow-hidden flex items-center h-20 md:h-24 select-none"
    >
      {/* Label Lateral - Agora também permite iniciar o drag se clicado */}
      <div className="hidden md:flex flex-shrink-0 font-black text-[10px] text-primary tracking-widest mx-8 border-r border-primary/20 pr-8 h-full items-center uppercase">
        Discografia
      </div>
      
      {/* Área de Drag total da barra */}
      <div 
        ref={containerRef}
        className="flex-1 h-full relative cursor-grab active:cursor-grabbing flex items-center overflow-hidden"
      >
        <motion.div 
          ref={contentRef}
          style={{ x }}
          drag="x"
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => {
            // Um pequeno delay para evitar que o clique seja disparado imediatamente após o drag
            setTimeout(() => setIsDragging(false), 50);
          }}
          onDrag={handleDrag}
          dragConstraints={{ left: -10000, right: 10000 }}
          className="flex gap-16 w-max items-center py-2 h-full"
        >
          {releases.length > 0 ? (
            <>
              {[...releases, ...releases, ...releases].map((release, i) => (
                <motion.div 
                  key={`${release.id}-${i}`} 
                  onTap={() => !isDragging && handleTap(release.spotifyLink)}
                  className="flex items-center gap-4 group/rel cursor-pointer"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-800 rounded-lg overflow-hidden border border-white/10 shadow-lg group-hover/rel:border-primary transition-all flex-shrink-0">
                    <img 
                      src={release.coverUrl} 
                      className="w-full h-full object-cover pointer-events-none" 
                      alt={release.title} 
                      draggable={false}
                    />
                  </div>
                  <div className="flex flex-col flex-shrink-0 pointer-events-none">
                    <span className="text-[10px] font-mono font-bold uppercase text-white/80 group-hover/rel:text-primary transition-colors whitespace-nowrap">{release.title}</span>
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">{release.type}</span>
                  </div>
                </motion.div>
              ))}
            </>
          ) : (
             <div className="text-[10px] text-white/20 font-mono uppercase tracking-[0.4em] flex gap-12 animate-pulse px-12">
                <span>Synchronizing Sonic Atlas...</span>
                <span>Establishing Neural Link...</span>
                <span>Waiting for Transmission...</span>
             </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
