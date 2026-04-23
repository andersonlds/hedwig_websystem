import React, { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { GalleryPhoto } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryProps {
  photos: GalleryPhoto[];
}

export default function Gallery({ photos }: GalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const displayPhotos = photos.slice(0, 4);

  return (
    <>
      <div id="galeria" className="col-span-12 md:col-span-8 row-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayPhotos.length > 0 ? displayPhotos.map((photo) => (
          <div 
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="aspect-square bg-zinc-800 rounded-2xl overflow-hidden relative border border-white/10 group shadow-lg cursor-pointer"
          >
             <img src={photo.imageUrl} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" alt={photo.description} />
             <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-white shadow-sm">{photo.description}</span>
             </div>
          </div>
        )) : (
          <div className="col-span-full flex items-center justify-center p-12 glass border-dashed border-white/5 rounded-3xl min-h-[300px]">
             <div className="text-center">
                <ImageIcon className="text-white/5 mx-auto mb-4" size={40} />
                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Visual Archive Initializing...</p>
             </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2"
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={32} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedPhoto.imageUrl} 
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                alt={selectedPhoto.description} 
              />
              {selectedPhoto.description && (
                <div className="absolute bottom-[-40px] left-0 right-0 text-center">
                   <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">{selectedPhoto.description}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
