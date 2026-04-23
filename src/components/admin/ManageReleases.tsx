import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Release } from '../../types';
import { useSupabaseQuery } from '../../hooks/useSupabase';
import SectionHeader from './SectionHeader';
import { ExternalLink, Trash2, Upload, Loader2, GripVertical } from 'lucide-react';
import { Reorder } from 'motion/react';

export default function ManageReleases() {
  const { data: initialReleases, refresh } = useSupabaseQuery<Release>('releases', 'order_index', true);
  const [localReleases, setLocalReleases] = useState<Release[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [formData, setFormData] = useState({ title: '', coverUrl: '', spotifyLink: '', type: 'single' });

  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialReleases) {
      setLocalReleases(initialReleases);
    }
  }, [initialReleases]);

  const handleReorder = (newOrder: Release[]) => {
    setLocalReleases(newOrder);
    
    if (saveTimeout) clearTimeout(saveTimeout);

    const timeout = setTimeout(async () => {
      setIsUpdatingOrder(true);
      
      const updates = newOrder.map((release, index) => ({
        id: release.id,
        title: release.title,
        coverUrl: release.coverUrl,
        spotifyLink: release.spotifyLink,
        type: release.type,
        order_index: index
      }));

      const { error } = await supabase.from('releases').upsert(updates);
      
      if (error) {
        console.error("Erro ao salvar ordem:", error);
      }
      
      setIsUpdatingOrder(false);
      refresh();
    }, 1000);

    setSaveTimeout(timeout);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('covers')
      .upload(filePath, file);

    if (uploadError) {
      alert('Erro ao fazer upload: ' + uploadError.message);
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('covers')
      .getPublicUrl(filePath);

    setFormData({ ...formData, coverUrl: publicUrl });
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.coverUrl) {
      alert('Faça upload da capa primeiro');
      return;
    }

    const { error } = await supabase.from('releases').insert([{
      ...formData,
      order_index: localReleases.length
    }]);
    
    if (error) {
      console.error('Error adding release:', error);
      alert('Erro ao adicionar lançamento: ' + error.message);
    } else {
      setFormData({ title: '', coverUrl: '', spotifyLink: '', type: 'single' });
      setIsAdding(false);
      refresh();
    }
  };

  const handleDelete = async (id: string, coverUrl: string) => {
    if (confirm('Excluir este lançamento?')) {
      const { error } = await supabase.from('releases').delete().eq('id', id);
      
      if (!error) {
        if (coverUrl.includes('supabase.co')) {
          const path = coverUrl.split('/').pop();
          if (path) {
            await supabase.storage.from('covers').remove([`covers/${path}`]);
          }
        }
        refresh();
      } else {
        alert('Erro ao excluir lançamento');
      }
    }
  };

  return (
    <div>
      <SectionHeader title="LANÇAMENTOS" description="Atualize seu catálogo musical. Arraste para reordenar." onAdd={() => setIsAdding(true)} />
      
      {isUpdatingOrder && (
        <div className="flex items-center gap-2 text-[10px] font-bold text-primary mb-4 animate-pulse">
          <Loader2 className="h-3 w-3 animate-spin" />
          ATUALIZANDO ORDEM...
        </div>
      )}

      {isAdding && (
        <div className="glass p-10 rounded-[2rem] mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
           <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Título</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" placeholder="Nome da música/álbum" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Tipo</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} >
                   <option value="single">Single</option>
                   <option value="ep">EP</option>
                   <option value="album">Album</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Upload da Capa</label>
                <div className="relative h-[54px]">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full h-full bg-white/5 border border-white/10 rounded-xl px-6 flex items-center gap-3 text-sm text-muted-foreground">
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {formData.coverUrl ? 'Imagem carregada!' : 'Selecionar arquivo...'}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Link da Plataforma</label>
                <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm" placeholder="Spotify, SoundCloud, etc..." value={formData.spotifyLink} onChange={e => setFormData({...formData, spotifyLink: e.target.value})} />
              </div>
              <div className="md:col-span-2 flex gap-4">
                 <button type="submit" disabled={isUploading} className="px-8 py-4 rounded-xl bg-primary text-background font-black text-xs tracking-widest disabled:opacity-50">SALVAR</button>
                 <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-4 rounded-xl bg-white/5 font-black text-xs tracking-widest">CANCELAR</button>
              </div>
           </form>
        </div>
      )}

      <Reorder.Group 
        axis="y" 
        values={localReleases} 
        onReorder={handleReorder}
        className="space-y-3"
      >
        {localReleases.map(release => (
          <Reorder.Item 
            key={release.id} 
            value={release}
            className="glass p-3 rounded-2xl group flex items-center gap-6 cursor-grab active:cursor-grabbing hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5"
          >
            {/* Drag Handle */}
            <div className="flex items-center justify-center text-white/10 group-hover:text-primary transition-colors">
              <GripVertical className="h-5 w-5" />
            </div>

            {/* Compact Cover */}
            <div className="h-16 w-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 pointer-events-none border border-white/5">
              <img src={release.coverUrl} className="w-full h-full object-cover" alt={release.title} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pointer-events-none">
              <h4 className="font-bold text-sm truncate uppercase tracking-wider">{release.title}</h4>
              <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-black">{release.type}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pr-2">
              <a 
                href={release.spotifyLink} 
                target="_blank" 
                rel="noreferrer" 
                title="Abrir link"
                className="p-3 bg-white/5 rounded-xl hover:bg-primary hover:text-background transition-all"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <button 
                onClick={() => handleDelete(release.id, release.coverUrl)} 
                title="Excluir"
                className="p-3 rounded-xl text-white/20 hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
