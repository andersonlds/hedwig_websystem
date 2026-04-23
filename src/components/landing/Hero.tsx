import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { ScrollReveal } from '../common/ScrollReveal';
import { supabase } from '../../lib/supabase';

interface HeroConfig {
  subtitle: string;
  title_line1: string;
  title_line2: string;
  spotify_link: string;
  image_url: string;
}

export default function Hero() {
  const [config, setConfig] = useState<HeroConfig | null>(null);

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

  return (
    <div id="sobre" className="col-span-12 md:col-span-8 row-span-1 md:row-span-3 min-h-[400px] rounded-2xl md:rounded-3xl relative overflow-hidden glass group">
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent z-10" />
      <div className="absolute inset-0 z-0">
         <img 
           src={bgImage} 
           className="w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale contrast-125"
           alt="Hero background"
         />
      </div>
      
      <div className="relative z-20 h-full flex flex-col justify-center p-8 md:p-12 lg:p-16">
        <ScrollReveal>
          <p className="text-primary font-mono text-xs mb-4 tracking-[0.4em] uppercase">{subtitle}</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black mb-8 leading-[0.95] tracking-tighter">
            {line1} <br/><span className="text-gradient">{line2}</span>
          </h1>
          <div className="flex flex-wrap gap-4">
            <a href={spotifyLink} target={spotifyLink.startsWith('http') ? '_blank' : '_self'} rel="noreferrer" className="bg-primary text-black px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary-glow transition-all flex items-center gap-2 group shadow-glow">
              LISTEN ON SPOTIFY <Play size={14} fill="black" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
