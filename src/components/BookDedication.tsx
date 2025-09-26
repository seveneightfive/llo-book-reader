import { motion } from 'framer-motion';
import { marked } from 'marked';
import { marked } from 'marked';
import { Book } from '../lib/supabase';

interface BookDedicationProps {
  book: Book;
  onNext: () => void;
  onPrev: () => void;
}

export function BookDedication({ book, onNext, onPrev }: BookDedicationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-white flex items-center justify-center p-8"
    >
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2
            className="text-2xl font-avenir text-slate-600 mb-8 dedication-tracking uppercase"
          >
            Dedication
          </h2>
          
          <blockquote className="text-xl font-lora italic text-slate-800 mb-12 leading-body-relaxed quote-tracking py-6 bg-slate-50/50 rounded-lg mx-4 px-8">
            <div 
              dangerouslySetInnerHTML={{
                __html: marked.parse(book.dedication || '')
              }}
            />
              dangerouslySetInnerHTML={{
                __html: marked.parse(book.dedication || '')
              }}
            />
          </blockquote>
          
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