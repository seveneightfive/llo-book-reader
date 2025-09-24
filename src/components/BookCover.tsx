import { motion } from 'framer-motion';
import { Book } from '../lib/supabase';

interface BookCoverProps {
  book: Book;
  onNext: () => void;
}

export function BookCover({ book, onNext }: BookCoverProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-12"
        >
          {book.cover_image && (
            <img
              src={book.cover_image}
              alt={book.title}
              className="w-64 h-96 object-cover mx-auto rounded-lg shadow-2xl mb-8"
            />
          )}
        </motion.div>
        
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl md:text-7xl font-avenir text-white mb-4 heading-tracking"
        >
          {book.title}
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-xl font-lora text-slate-300 mb-12 leading-body-relaxed"
        >
          by {book.author}
        </motion.p>
        
        {book.view_count > 0 && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-sm font-avenir text-slate-400 mb-8"
          >
            {book.view_count.toLocaleString()} {book.view_count === 1 ? 'view' : 'views'}
          </motion.p>
        )}
        
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="px-8 py-3 bg-white text-slate-900 rounded-full font-avenir text-lg hover:bg-slate-100 transition-colors"
        >
          Begin Reading
        </motion.button>
      </div>
    </motion.div>
  );
}