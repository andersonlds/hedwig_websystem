import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import HedwigLogo from '../common/HedwigLogo';

export default function Multimedia() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from('hero_config').select('*').eq('id', 1).single();
      if (data) setConfig(data);
    };
    fetchConfig();
  }, []);

  const title = config?.playlist_title || 'Curated Sonic Journey';
  const subtitle = config?.playlist_subtitle || 'Spotify Official Playlist';
  const link = config?.playlist_link || '#';

  return (
    // lg: (1024px+) → col-span-8 lado a lado
    // abaixo de lg → col-span-12 empilhado
    <div id="playlist" className="col-span-12 lg:col-span-8 glass rounded-2xl lg:rounded-3xl p-5 lg:p-6 flex items-center gap-5 lg:gap-8 group">
       <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform overflow-hidden p-1.5 flex-shrink-0">
            <HedwigLogo className="w-full h-full" />
          </div>
          <div className="min-w-0">
             <h4 className="text-xs lg:text-sm font-black uppercase tracking-[0.2em] truncate">{title}</h4>
             <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-0.5">{subtitle}</p>
          </div>
       </div>
       <a href={link} target="_blank" rel="noreferrer" className="flex-shrink-0 px-5 lg:px-6 py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all whitespace-nowrap">
         OPEN SPOTIFY
       </a>
    </div>
  );
}
