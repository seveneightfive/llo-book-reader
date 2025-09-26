import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../lib/supabase';

interface ChapterGalleryProps {
  galleryItems: GalleryItem[];
  chapterTitle: string;
}

export function ChapterGallery({ galleryItems, chapterTitle }: ChapterGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (galleryItems.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryItems.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryItems.length - 1 : selectedImage - 1);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-16 mb-8"
      >
        <div className="border-t border-slate-200 pt-12">
          <h3 className="text-2xl font-avenir text-slate-800 mb-8 text-center heading-tracking">
            Chapter Gallery
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={item.image}
                    alt={item.caption || `Gallery image ${index + 1}`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                {item.caption && (
                  <p className="mt-3 font-lora text-slate-600 leading-relaxed" style={{ fontSize: '1.1rem' }}>
                    {item.caption}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors"
              >
                <X size={32} />
              </button>

              {/* Navigation buttons */}
              {galleryItems.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 transition-colors bg-black/50 rounded-full p-2"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 transition-colors bg-black/50 rounded-full p-2"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image */}
              <img
                src={galleryItems[selectedImage].image}
                alt={galleryItems[selectedImage].caption || `Gallery image ${selectedImage + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {/* Caption */}
              {galleryItems[selectedImage].caption && (
                <div className="absolute -bottom-16 left-0 right-0 text-center">
                  <p className="text-white font-lora leading-relaxed">
                    {galleryItems[selectedImage].caption}
                  </p>
                </div>
              )}

              {/* Image counter */}
              {galleryItems.length > 1 && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white text-sm">
                  {selectedImage + 1} of {galleryItems.length}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}