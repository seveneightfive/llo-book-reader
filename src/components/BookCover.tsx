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
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8"
        >
          {book.image_url && (
            <div className="mb-8 flex justify-center">
              <img
                src={book.image_url}
                alt={`${book.title} cover`}
                className="max-h-96 w-auto rounded-lg shadow-2xl object-cover"
              />
            </div>
          )}
          
          <h1 className="text-5xl md:text-7xl font-avenir font-light text-white mb-4 tracking-wide">
            {book.title}
          </h1>
          
          <p className="text-xl md:text-2xl font-lora text-slate-300 mb-8 italic">
            by {book.author}
          </p>
          
          {book.view_count > 0 && (
            <p className="text-sm font-avenir text-slate-400 mb-8">
              Read by {book.view_count.toLocaleString()} {book.view_count === 1 ? 'reader' : 'readers'}
            </p>
          )}
        </motion.div>
        
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          onClick={onNext}
          className="px-8 py-4 bg-white text-slate-900 font-avenir font-medium rounded-full hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Begin Reading
        </motion.button>
      </div>
    </motion.div>
  );
}