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
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {book.cover_image && (
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              src={book.cover_image}
              alt={`${book.title} cover`}
              className="mx-auto mb-8 max-w-sm rounded-lg shadow-2xl"
            />
          )}
          
          <h1 
            className="text-6xl font-avenir text-white mb-4 heading-tracking"
          >
            {book.title}
          </h1>
          
          <p className="text-xl font-lora text-slate-300 mb-2 leading-body-relaxed">
            by {book.author}
          </p>
          
          {book.view_count > 0 && (
            <p className="text-sm text-slate-400 mb-8">
              {book.view_count.toLocaleString()} readers
            </p>
          )}
          
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            onClick={onNext}
            className="inline-block px-8 py-3 bg-white text-slate-900 rounded-full font-avenir text-lg hover:bg-slate-100 transition-colors shadow-lg"
          >
            Begin Reading
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}