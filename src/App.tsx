import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { useBook } from './hooks/useBook';
import { BookReader } from './components/BookReader';

function BookPage() {
  const { slug } = useParams<{ slug: string }>();
  const { book, chapters, loading, error } = useBook(slug!);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading book...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-slate-800 mb-2">Book Not Found</h1>
          <p className="text-slate-600">{error || 'The requested book could not be found.'}</p>
        </div>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-slate-800 mb-2">No Chapters Found</h1>
          <p className="text-slate-600">This book doesn't have any chapters available yet.</p>
        </div>
      </div>
    );
  }

  return <BookReader book={book} chapters={chapters} />;
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 
          className="text-6xl font-light text-white mb-8"
          style={{ fontFamily: 'Avenir, system-ui, sans-serif' }}
        >
          Lasting Legacy Online
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Immersive digital storytelling experiences
        </p>
        <a
          href="/book/lasting-legacy-online"
          className="inline-block px-8 py-3 bg-white text-slate-900 rounded-full font-medium text-lg hover:bg-slate-100 transition-colors"
          style={{ fontFamily: 'Avenir, system-ui, sans-serif' }}
        >
          Read Now
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:slug" element={<BookPage />} />
      </Routes>
    </Router>
  );
}

export default App;