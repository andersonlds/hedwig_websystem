import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { GalleryPhoto } from '../../types';
import { useSupabaseQuery } from '../../hooks/useSupabase';
import SectionHeader from './SectionHeader';
import { Trash2, Upload, Loader2, Camera, GripVertical } from 'lucide-react';
import { Reorder } from 'motion/react';

export default function ManageGallery() {
  const { data: initialPhotos } = useSupabaseQuery<GalleryPhoto>('gallery', 'order_index', true);
  const [localPhotos, setLocalPhotos] = useState<GalleryPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialPhotos) {
      setLocalPhotos(initialPhotos);
    }
  }, [initialPhotos]);

  const handleReorder = (newOrder: GalleryPhoto[]) => {
    setLocalPhotos(newOrder);
    
    // Cancela o timer anterior se houver
    if (saveTimeout) clearTimeout(saveTimeout);

    // Cria um novo timer de 1 segundo
    const timeout = setTimeout(async () => {
      setIsUpdatingOrder(true);
      
      const updates = newOrder.map((photo, index) => ({
        id: photo.id,
        imageUrl: photo.imageUrl,
        description: photo.description,
        order_index: index
      }));

      const { error } = await supabase.from('gallery').upsert(updates);
      
      if (error) {
        console.error("Erro ao salvar ordem:", error);
      }
      
      setIsUpdatingOrder(false);
    }, 1000); // Espera 1 segundo após o último movimento para salvar

    setSaveTimeout(timeout);
  };

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        resolve(ratio >= 0.95 && ratio <= 1.05);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (localPhotos.length >= 4) {
      alert('Limite máximo de 4 fotos atingido');
      return;
    }

    const isSquare = await validateImage(file);
    if (!isSquare) {
      alert('Apenas fotos no formato 1:1 (quadradas) são aceitas.');
      return;
    }

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(filePath, file);

    if (uploadError) {
      alert('Erro ao fazer upload: ' + uploadError.message);
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase.from('gallery').insert([
      { imageUrl: publicUrl, description: '', order_index: localPhotos.length }
    ]);

    if (dbError) {
      alert('Erro ao salvar no banco: ' + dbError.message);
    }

    setIsUploading(false);
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (confirm('Remover esta foto?')) {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (!error) {
        if (imageUrl.includes('supabase.co')) {
          const path = imageUrl.split('/').pop();
          if (path) {
            await supabase.storage.from('gallery').remove([`gallery/${path}`]);
          }
        }
        // Real-time UI update
      }
    }
  };

  return (
    <div>
      <SectionHeader title="GALERIA" description="Gerencie suas fotos de destaque (máximo 4). Arraste para reordenar." />
      
      {isUpdatingOrder && (
        <div className="flex items-center gap-2 text-[10px] font-bold text-primary mb-4 animate-pulse">
          <Loader2 className="h-3 w-3 animate-spin" />
          ATUALIZANDO ORDEM...
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <Reorder.Group 
          axis="x" 
          values={localPhotos} 
          onReorder={handleReorder}
          className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {localPhotos.map((photo) => (
            <Reorder.Item 
              key={photo.id} 
              value={photo}
              className="aspect-square glass rounded-3xl overflow-hidden relative group cursor-grab active:cursor-grabbing"
            >
              <img src={photo.imageUrl} className="w-full h-full object-cover pointer-events-none" alt="" />
              
              {/* Drag Handle Overlay */}
              <div className="absolute top-3 left-3 h-8 w-8 rounded-full glass border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-white/40" />
              </div>

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => handleDelete(photo.id, photo.imageUrl)} className="p-4 rounded-full bg-destructive text-white hover:scale-110 transition-transform">
                  <Trash2 className="h-6 w-6" />
                </button>
              </div>
            </Reorder.Item>
          ))}

          {/* Empty slots */}
          {[...Array(Math.max(0, 4 - localPhotos.length))].map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square glass rounded-3xl overflow-hidden relative group border-dashed border-white/5">
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground relative">
                {isUploading && index === 0 ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : (
                  <>
                    <Camera className="h-8 w-8 opacity-20" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Vazio</span>
                    {index === 0 && (
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </Reorder.Group>
      </div>
      
      <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-2xl">
        <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-relaxed">
          Instruções: Clique nos espaços vazios para fazer upload. <br />
          <strong>Arraste as fotos para mudar a ordem de exibição.</strong> <br />
          Somente formato 1:1 (Quadrado) é aceito.
        </p>
      </div>
    </div>
  );
}
