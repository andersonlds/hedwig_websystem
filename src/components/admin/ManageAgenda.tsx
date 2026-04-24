import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Show } from '../../types';
import { useSupabaseQuery } from '../../hooks/useSupabase';
import SectionHeader from './SectionHeader';
import { ExternalLink, Trash2, Calendar as CalendarIcon, Edit2 } from 'lucide-react';

export default function ManageAgenda() {
  const { data: shows } = useSupabaseQuery<Show>('shows', 'date', true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', city: '', date: '', ticketLink: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transformar textos em MAIÚSCULO conforme solicitado anteriormente
    const processedData = {
      ...formData,
      name: formData.name.toUpperCase(),
      city: formData.city.toUpperCase(),
      date: new Date(formData.date).toISOString()
    };

    let error;
    if (editingId) {
      // Atualizar
      const { error: updateError } = await supabase
        .from('shows')
        .update(processedData)
        .eq('id', editingId);
      error = updateError;
    } else {
      // Inserir
      const { error: insertError } = await supabase
        .from('shows')
        .insert([processedData]);
      error = insertError;
    }
    
    if (error) {
      console.error('Error saving show:', error);
      alert('Erro ao salvar evento: ' + error.message);
    } else {
      setFormData({ name: '', city: '', date: '', ticketLink: '' });
      setIsAdding(false);
      setEditingId(null);
      alert('Agenda atualizada!');
    }
  };

  const handleEdit = (show: Show) => {
    // Formatar data para o input tipo "date" (YYYY-MM-DD)
    const date = new Date(show.date).toISOString().split('T')[0];
    setFormData({
      name: show.name,
      city: show.city,
      date: date,
      ticketLink: show.ticketLink || ''
    });
    setEditingId(show.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este evento?')) {
      const { error } = await supabase.from('shows').delete().eq('id', id);
      if (error) {
        console.error('Error deleting show:', error);
        alert('Erro ao excluir evento');
      } else {
        // Atualização em tempo real cuida da interface
      }
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <div>
      <SectionHeader 
        title="AGENDA" 
        description="Gerencie as datas da sua tour." 
        onAdd={() => {
          setEditingId(null);
          setFormData({ name: '', city: '', date: '', ticketLink: '' });
          setIsAdding(true);
        }} 
      />
      
      {isAdding && (
        <div className="glass p-6 md:p-10 rounded-[2rem] mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="flex items-center gap-2 mb-8 text-primary">
              <Edit2 size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                {editingId ? 'Editando Evento' : 'Novo Evento'}
              </span>
           </div>
           <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Nome do Evento</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" placeholder="Ex: Boom Festival" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Cidade / UF</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" placeholder="Ex: São Paulo / SP" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Data</label>
                <input required type="date" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">URL do Ticket</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" placeholder="https://..." value={formData.ticketLink} onChange={e => setFormData({...formData, ticketLink: e.target.value})} />
              </div>
              <div className="md:col-span-2 flex gap-4">
                 <button type="submit" className="px-8 py-4 rounded-xl bg-primary text-background font-black text-xs tracking-widest uppercase">
                    {editingId ? 'Atualizar' : 'Salvar'}
                 </button>
                 <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-8 py-4 rounded-xl bg-white/5 font-black text-xs tracking-widest uppercase">CANCELAR</button>
              </div>
           </form>
        </div>
      )}

      <div className="space-y-12">
        {/* Próximos Shows */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Próximos Shows
          </h3>
          {shows.filter(show => new Date(show.date) >= new Date(new Date().setHours(0,0,0,0))).length > 0 ? (
            shows
              .filter(show => new Date(show.date) >= new Date(new Date().setHours(0,0,0,0)))
              .map(show => (
                <div key={show.id} className="glass p-4 md:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-primary/30 transition-all border border-transparent">
                  <div className="flex items-center gap-6">
                     <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <CalendarIcon className="text-primary h-5 w-5" />
                     </div>
                     <div>
                        <h4 className="font-bold text-foreground uppercase tracking-tight">{show.name}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{show.city}</p>
                          <span className="h-1 w-1 rounded-full bg-white/10" />
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{formatDate(show.date)}</p>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                     <button onClick={() => handleEdit(show)} title="Editar" className="p-3 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-primary transition-colors">
                       <Edit2 className="h-4 w-4" />
                     </button>
                     {show.ticketLink && (
                       <a href={show.ticketLink} target="_blank" rel="noreferrer" title="Link do Ticket" className="p-3 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-primary transition-colors">
                         <ExternalLink className="h-4 w-4" />
                       </a>
                     )}
                     <button onClick={() => handleDelete(show.id)} title="Excluir" className="p-3 rounded-xl text-white/20 hover:text-destructive hover:bg-destructive/10 transition-colors">
                       <Trash2 className="h-4 w-4" />
                     </button>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-xs text-white/20 font-bold uppercase tracking-widest">Nenhum show futuro agendado.</p>
          )}
        </div>

        {/* Shows Passados */}
        {shows.filter(show => new Date(show.date) < new Date(new Date().setHours(0,0,0,0))).length > 0 && (
          <div className="space-y-4 pt-8 border-t border-white/5">
            <h3 className="text-xs font-bold text-white/20 uppercase tracking-widest mb-4 flex items-center gap-2">
               Histórico de Shows
            </h3>
            {shows
              .filter(show => new Date(show.date) < new Date(new Date().setHours(0,0,0,0)))
              .reverse() // Inverte para mostrar o show passado mais recente primeiro
              .map(show => (
                <div key={show.id} className="bg-white/5 p-4 md:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-white/20 transition-all border border-transparent opacity-60">
                  <div className="flex items-center gap-6">
                     <div className="h-12 w-12 rounded-xl bg-black/20 flex items-center justify-center">
                        <CalendarIcon className="text-white/40 h-5 w-5" />
                     </div>
                     <div>
                        <h4 className="font-bold text-white/60 uppercase tracking-tight line-through decoration-white/20">{show.name}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{show.city}</p>
                          <span className="h-1 w-1 rounded-full bg-white/5" />
                          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{formatDate(show.date)}</p>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                     <button onClick={() => handleDelete(show.id)} title="Excluir" className="p-3 rounded-xl text-white/20 hover:text-destructive hover:bg-destructive/10 transition-colors">
                       <Trash2 className="h-4 w-4" />
                     </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
