import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import SectionHeader from './SectionHeader';
import { Music, Calendar, Image as ImageIcon, MessageSquare, Database, Activity } from 'lucide-react';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    releases: 0,
    shows: 0,
    photos: 0,
    messages: 0,
    dbStatus: 'Conectando...'
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: releases },
          { count: shows },
          { count: photos },
          { count: messages }
        ] = await Promise.all([
          supabase.from('releases').select('*', { count: 'exact', head: true }),
          supabase.from('agenda').select('*', { count: 'exact', head: true }),
          supabase.from('gallery').select('*', { count: 'exact', head: true }),
          supabase.from('contacts').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          releases: releases || 0,
          shows: shows || 0,
          photos: photos || 0,
          messages: messages || 0,
          dbStatus: 'SUPABASE // ONLINE'
        });
      } catch (error) {
        console.error('Erro ao buscar stats:', error);
        setStats(prev => ({ ...prev, dbStatus: 'SUPABASE // ERROR' }));
      }
    }

    fetchStats();
  }, []);

  const cards = [
    { label: 'LANÇAMENTOS', value: stats.releases, icon: Music, color: 'text-primary' },
    { label: 'SHOWS NA AGENDA', value: stats.shows, icon: Calendar, color: 'text-primary' },
    { label: 'FOTOS NA GALERIA', value: stats.photos, icon: ImageIcon, color: 'text-primary' },
    { label: 'SOLICITAÇÕES', value: stats.messages, icon: MessageSquare, color: 'text-primary' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <SectionHeader title="DASHBOARD" description="Visão geral e status do ecossistema HEDWIG." />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="glass p-8 rounded-[2rem] border border-white/5 hover:border-primary/20 transition-colors group">
            <div className="flex items-center justify-between mb-6">
               <div className={`p-3 rounded-2xl bg-white/5 ${card.color} group-hover:scale-110 transition-transform`}>
                 <card.icon size={20} />
               </div>
               <span className="text-[10px] font-black text-white/20 tracking-[0.2em]">{card.label}</span>
            </div>
            <p className="text-4xl font-display font-black tracking-tighter">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[2rem] border border-white/5 flex items-center justify-between overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
           <div className="relative z-10">
              <h3 className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase mb-2 flex items-center gap-2">
                <Database size={10} /> Database Connection
              </h3>
              <p className="text-xl font-display font-bold tracking-tight text-primary-glow">{stats.dbStatus}</p>
           </div>
           <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Activity className="text-primary h-6 w-6" />
           </div>
        </div>

        <div className="glass p-8 rounded-[2rem] border border-white/5 flex items-center justify-between">
           <div>
              <h3 className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase mb-2">Sistema Operacional</h3>
              <p className="text-xl font-display font-bold tracking-tight">VITE // CLOUD CORE</p>
           </div>
           <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-8 bg-primary/20 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
