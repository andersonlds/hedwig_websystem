import { Calendar, MapPin } from 'lucide-react';
import { Show } from '../../types';

interface AgendaProps {
  shows: Show[];
}

export default function Agenda({ shows }: AgendaProps) {
  const futureShows = shows
    .filter(show => new Date(show.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .slice(0, 5);

  return (
    <div id="agenda" className="col-span-12 md:col-span-4 row-span-1 md:row-span-4 glass rounded-2xl md:rounded-3xl p-8 flex flex-col min-h-[400px]">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-[10px] font-black text-white/40 tracking-[0.3em] uppercase flex items-center gap-2">
          <Calendar size={12} className="text-primary" /> AGENDA DE SHOWS
        </h3>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar pr-1">
        {futureShows.length > 0 ? futureShows.map((show) => (
          <div key={show.id} className="flex justify-between items-center p-4 rounded-xl glass border-white/5 hover:bg-white/5 transition-all group/item">
            <div>
              <div className="text-[10px] text-primary font-mono font-bold mb-1 uppercase">
                {new Date(show.date).toLocaleDateString('pt-BR')}
              </div>
              <div className="font-bold text-sm tracking-tight group-hover/item:text-primary transition-colors">{show.name}</div>
              <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1 flex items-center gap-1">
                <MapPin size={8} /> {show.city}
              </div>
            </div>
            {show.ticketLink && (
              <a href={show.ticketLink} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:shadow-glow transition-all">
                TICKETS
              </a>
            )}
          </div>
        )) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/5 rounded-2xl">
            <Calendar className="text-white/5 mb-4" size={32} />
            <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Searching frequencies...</p>
            <p className="text-[8px] text-white/10 uppercase tracking-widest mt-2 font-bold">New dates arriving soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
