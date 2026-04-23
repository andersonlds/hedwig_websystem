import { useState, useEffect } from 'react';
import { BarChart3, Globe } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Vitals() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from('hero_config').select('*').eq('id', 1).single();
      if (data) setConfig(data);
    };
    fetchConfig();
  }, []);

  const releases = config?.vitals_releases || '12';
  const countries = config?.vitals_countries || '08';
  const label = config?.vitals_label || 'ÚLTIMO MOVIMENTO';
  const value = config?.vitals_value || 'EXPLORANDO FREQUÊNCIAS SONORAS';

  return (
    <div className="col-span-12 md:col-span-4 row-span-2 glass rounded-2xl md:rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group border-none shadow-none">
       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />
       <div className="relative z-10 h-full flex flex-col">
          <h3 className="text-[10px] font-black text-white/40 tracking-[0.3em] uppercase mb-8 flex items-center gap-2">
            <BarChart3 size={12} className="text-primary" /> Vitals
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl group-hover:border-primary/30 transition-all">
              <div className="text-4xl font-display font-black text-primary mb-1">{releases}</div>
              <div className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">Lançamentos</div>
            </div>
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl group-hover:border-primary/30 transition-all">
              <div className="text-4xl font-display font-black text-primary mb-1">{countries}</div>
              <div className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">Países</div>
            </div>
          </div>

          <div className="mt-auto pt-8 flex items-center gap-4 opacity-80">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center border border-white/10 shrink-0">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <div className="text-[10px] uppercase font-bold tracking-widest">
              <span className="block text-white/40 mb-0.5">{label}</span>
              <span className="block text-white leading-tight">{value}</span>
            </div>
          </div>
       </div>
    </div>
  );
}
