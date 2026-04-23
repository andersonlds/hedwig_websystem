import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import SectionHeader from './SectionHeader';
import { UserCheck, UserX, Clock } from 'lucide-react';

interface PendingRequest {
  id: string;
  email: string;
  created_at: string;
}

export default function ManageRequests() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pending_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (request: PendingRequest) => {
    // 1. Add to admins
    const { error: adminError } = await supabase
      .from('admins')
      .insert([{ id: request.id, email: request.email }]);

    if (adminError) {
      alert('Erro ao aprovar: ' + adminError.message);
      return;
    }

    // 2. Delete from pending
    await supabase.from('pending_requests').delete().eq('id', request.id);
    fetchRequests();
  };

  const handleReject = async (id: string) => {
    if (confirm('Deseja recusar esta solicitação?')) {
      await supabase.from('pending_requests').delete().eq('id', id);
      fetchRequests();
    }
  };

  return (
    <div>
      <SectionHeader title="SOLICITAÇÕES" description="Gerencie quem pode acessar este painel." />

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Carregando solicitações...</div>
      ) : requests.length === 0 ? (
        <div className="glass p-12 rounded-[2rem] text-center border-white/5">
           <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
           <p className="text-muted-foreground font-bold tracking-widest text-xs uppercase">Nenhuma solicitação pendente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="glass p-6 rounded-2xl flex items-center justify-between group">
              <div className="flex items-center gap-6">
                 <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock className="h-5 w-5" />
                 </div>
                 <div>
                    <h4 className="font-bold text-foreground">{req.email}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                       Solicitado em: {new Date(req.created_at).toLocaleDateString('pt-BR')} às {new Date(req.created_at).toLocaleTimeString('pt-BR')}
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <button 
                  onClick={() => handleApprove(req)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-background font-black text-[10px] tracking-widest hover:shadow-glow transition-all"
                 >
                    <UserCheck className="h-3 w-3" /> APROVAR
                 </button>
                 <button 
                  onClick={() => handleReject(req.id)}
                  className="p-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                 >
                    <UserX className="h-4 w-4" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
