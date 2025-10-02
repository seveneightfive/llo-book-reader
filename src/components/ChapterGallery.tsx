import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { GalleryItem } from '../lib/supabase';

interface ChapterGalleryProps {
  galleryItems: GalleryItem[];
  onPrevious: () => void;
}

export default function ChapterGallery({ galleryItems, onPrevious }: ChapterGalleryProps) {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-800 font-avenir">Gallery</h1>
          <button
            onClick={onPrevious}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Story
          </button>
        </div>

        {galleryItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600 text-lg font-avenir">No gallery items available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={item.image_url}
                  alt={item.image_title || 'Gallery image'}
                  className="w-full h-64 object-cover"
                />
                {(item.image_title || item.image_caption) && (
                  <div className="p-4">
                    {item.image_title && (
                      <h3 className="font-semibold text-slate-800 mb-2 font-avenir">
                        {item.image_title}
                      </h3>
                    )}
                    {item.image_caption && (
                      <p className="text-slate-600 text-sm font-avenir">
                        {item.image_caption}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}