import React from 'react';
import { motion } from 'framer-motion';
import { GalleryItem } from '../lib/supabase';

interface ChapterGalleryProps {
  galleryItems: GalleryItem[];
  onNext: () => void;
  onPrev: () => void;
}

export function ChapterGallery({ galleryItems, onNext, onPrev }: ChapterGalleryProps) {
  if (!galleryItems || galleryItems.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-slate-50 flex items-center justify-center p-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-3xl font-avenir text-slate-800 mb-8 text-center heading-tracking">
            Gallery
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {galleryItems
              .sort((a, b) => a.galllery_image_order - b.galllery_image_order)
              .map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <img
                    src={item.gallery_image_url}
                    alt={item.gallery_image_title || 'Gallery image'}
                    className="w-full h-64 object-cover"
                  />
                  {(item.gallery_image_title || item.gallery_image_caption) && (
                    <div className="p-4">
                      {item.gallery_image_title && (
                        <h3 className="font-avenir font-medium text-slate-800 mb-2">
                          {item.gallery_image_title}
                        </h3>
                      )}
                      {item.gallery_image_caption && (
                        <p className="text-sm font-lora text-slate-600 image-caption">
                          {item.gallery_image_caption}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={onPrev}
              className="px-6 py-2 font-avenir text-slate-600 hover:text-slate-800 transition-colors"
            >
              ← Back
            </button>
            
            <button
              onClick={onNext}
              className="px-6 py-2 bg-slate-800 text-white rounded-full font-avenir hover:bg-slate-900 transition-colors"
            >
              Continue →
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}