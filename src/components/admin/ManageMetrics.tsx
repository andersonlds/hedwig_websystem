import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Metric } from '../../types';
import SectionHeader from './SectionHeader';
import { BarChart3 } from 'lucide-react';

export default function ManageMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
    
    const channel = supabase
      .channel('public:metrics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'metrics' }, () => {
        fetchMetrics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMetrics = async () => {
    const { data, error } = await supabase
      .from('metrics')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching metrics:', error);
    } else if (data.length === 0) {
      // Initialize if empty
      const initialMetrics = [
        { label: 'RELEASES', value: 0, category: 'releases' },
        { label: 'COUNTRIES', value: 0, category: 'countries' },
        { label: 'TOURS', value: 0, category: 'tours' }
      ];
      await supabase.from('metrics').insert(initialMetrics);
      fetchMetrics();
    } else {
      setMetrics(data as Metric[]);
    }
  };

  const handleUpdate = async (id: string, value: number) => {
    const { error } = await supabase
      .from('metrics')
      .update({ value })
      .eq('id', id);

    if (error) {
      console.error('Error updating metric:', error);
      alert('Erro ao atualizar métrica');
    } else {
      setEditingId(null);
    }
  };

  return (
    <div>
      <SectionHeader title="MÉTRICAS" description="Ajuste os números da seção 'Sobre'." />
      <div className="grid md:grid-cols-3 gap-8">
        {metrics.map(metric => (
          <div key={metric.id} className="glass p-10 rounded-[3rem] text-center group">
            <div className="h-16 w-16 rounded-2xl bg-white/5 mx-auto mb-6 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
               <BarChart3 className="h-8 w-8" />
            </div>
            <h4 className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase mb-4">{metric.label}</h4>
            
            {editingId === metric.id ? (
              <div className="flex flex-col gap-4">
                <input 
                  autoFocus
                  type="number" 
                  defaultValue={metric.value} 
                  onBlur={(e) => handleUpdate(metric.id, parseInt(e.target.value))}
                  className="w-full text-4xl font-display font-black text-center bg-transparent outline-none"
                />
                <p className="text-[9px] text-primary italic">Pressione fora para salvar</p>
              </div>
            ) : (
              <button 
                onClick={() => setEditingId(metric.id)}
                className="text-5xl font-display font-black text-foreground hover:text-primary transition-colors"
              >
                {metric.value}
              </button>
            )}
            
            <p className="mt-6 text-[10px] italic text-muted-foreground">Clique no número para editar</p>
          </div>
        ))}
      </div>
    </div>
  );
}
