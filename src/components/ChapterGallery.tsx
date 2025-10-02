import { motion } from 'framer-motion';
import { GalleryItem } from '../lib/supabase';

interface ChapterGalleryProps {
  galleryItems: GalleryItem[];
  chapterTitle: string;
}

export function ChapterGallery({ galleryItems, chapterTitle }: ChapterGalleryProps) {
  if (!galleryItems || galleryItems.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-16 mb-8"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-avenir text-slate-800 mb-2 heading-tracking">
          Gallery
        </h3>
        <p className="text-slate-600 font-lora italic">
          Images from {chapterTitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {galleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="aspect-w-16 aspect-h-12">
              <img
                src={item.image_url}
                alt={item.image_title || ''}
                className="w-full h-64 object-cover"
              />
            </div>
            {(item.image_title || item.image_caption) && (
              <div className="p-4">
                {item.image_title && (
                  <h4 className="font-avenir text-slate-800 mb-2">
                    {item.image_title}
                  </h4>
                )}
                {item.image_caption && (
                  <p className="text-slate-600 font-lora italic text-sm image-caption">
                    {item.image_caption}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}