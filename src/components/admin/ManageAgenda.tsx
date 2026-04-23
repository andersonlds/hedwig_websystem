import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Show } from '../../types';
import { useSupabaseQuery } from '../../hooks/useSupabase';
import SectionHeader from './SectionHeader';
import { ExternalLink, Trash2, Calendar as CalendarIcon, Edit2 } from 'lucide-react';

export default function ManageAgenda() {
  const { data: shows, refresh } = useSupabaseQuery<Show>('shows', 'date', true);
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
      refresh();
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
        refresh();
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
        <div className="glass p-10 rounded-[2rem] mb-12 animate-in fade-in zoom-in-95 duration-500">
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

      <div className="space-y-4">
        {shows.map(show => (
          <div key={show.id} className="glass p-6 rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all border border-transparent">
            <div className="flex items-center gap-6">
               <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
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
            <div className="flex items-center gap-2">
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
        ))}
      </div>
    </div>
  );
}
