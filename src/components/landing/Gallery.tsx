import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryPhoto } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryProps {
  photos: GalleryPhoto[];
}

export default function Gallery({ photos }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const displayPhotos = photos.slice(0, 4);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowLeft') setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1));
      if (e.key === 'ArrowRight') setSelectedIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0));
      if (e.key === 'Escape') setSelectedIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, photos.length]);

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <>
      <div id="galeria" className="col-span-12 md:col-span-8 row-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayPhotos.length > 0 ? displayPhotos.map((photo, index) => (
          <div 
            key={photo.id}
            onClick={() => setSelectedIndex(index)}
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
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 z-[110]"
              onClick={() => setSelectedIndex(null)}
            >
              <X size={32} />
            </button>

            {/* Navigation Arrows */}
            <button 
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-primary/50 transition-all z-[110] group"
              onClick={handlePrev}
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <button 
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-primary/50 transition-all z-[110] group"
              onClick={handleNext}
            >
              <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            <motion.div 
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -20 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedPhoto.imageUrl} 
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                alt={selectedPhoto.description} 
              />
              {selectedPhoto.description && (
                <div className="mt-8 text-center">
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
