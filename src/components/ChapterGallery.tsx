import React from 'react';
import { GalleryItem } from '../lib/supabase';

interface ChapterGalleryProps {
  items: GalleryItem[];
}

export default function ChapterGallery({ items }: ChapterGalleryProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={item.gallery_image_url}
            alt={item.gallery_image_title || 'Gallery image'}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            {item.gallery_image_title && (
              <h3 className="font-semibold text-lg mb-2">{item.gallery_image_title}</h3>
            )}
            {item.gallery_image_caption && (
              <p className="text-gray-600 text-sm">{item.gallery_image_caption}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}