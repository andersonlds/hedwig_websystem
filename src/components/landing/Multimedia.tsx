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
    <div id="playlist" className="col-span-12 md:col-span-8 row-span-1 glass rounded-2xl md:rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 group">
       <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform overflow-hidden p-1.5">
            <HedwigLogo className="w-full h-full" />
          </div>
          <div>
             <h4 className="text-sm font-black uppercase tracking-[0.2em]">{title}</h4>
             <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-0.5">{subtitle}</p>
          </div>
       </div>
       <a href={link} target="_blank" rel="noreferrer" className="w-full md:w-auto px-6 py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all text-center">
         OPEN SPOTIFY
       </a>
    </div>
  );
}
