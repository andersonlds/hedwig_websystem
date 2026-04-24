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
    // lg: (1024px+) → sidebar 4/12 colunas
    // abaixo de lg → empilhado col-span-12
    <div className="col-span-12 lg:col-span-4 lg:row-span-2 glass rounded-2xl lg:rounded-3xl p-6 lg:p-8 flex flex-col justify-between overflow-hidden relative group border-none shadow-none">
       <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />
       <div className="relative z-10 h-full flex flex-col">
          <h3 className="text-[10px] font-black text-white/40 tracking-[0.3em] uppercase mb-6 lg:mb-8 flex items-center gap-2">
            <BarChart3 size={12} className="text-primary" /> HIGHLIGHTS
          </h3>
          {/* Em mobile: exibe os 2 cards em linha horizontal */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 lg:p-5 bg-white/5 border border-white/10 rounded-2xl group-hover:border-primary/30 transition-all">
              <div className="text-3xl lg:text-4xl font-display font-black text-primary mb-1">{releases}</div>
              <div className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">Lançamentos</div>
            </div>
            <div className="p-4 lg:p-5 bg-white/5 border border-white/10 rounded-2xl group-hover:border-primary/30 transition-all">
              <div className="text-3xl lg:text-4xl font-display font-black text-primary mb-1">{countries}</div>
              <div className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">Países</div>
            </div>
          </div>

          <div className="mt-auto pt-6 lg:pt-8 flex items-center gap-4 opacity-80">
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full glass flex items-center justify-center border border-white/10 shrink-0">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <div className="text-[10px] uppercase font-bold tracking-widest min-w-0">
              <span className="block text-white/40 mb-0.5 truncate">{label}</span>
              <span className="block text-white leading-tight truncate">{value}</span>
            </div>
          </div>
       </div>
    </div>
  );
}
