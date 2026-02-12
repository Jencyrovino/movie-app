import React, { useState, useEffect } from 'react';
import './App.css';
import MovieList from './MovieList';
import MovieDetail from './MovieDetail';

function App() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('All'); // Added Category State

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch('/api/movies');
        const payload = await response.json();
        setMovies(payload.data);
        setFilteredMovies(payload.data);
      } catch (error) {
        console.error("Failed to fetch movies", error);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    let result = movies;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply specific filters
    if (filter === 'high-rated') {
      result = result.filter(movie => movie.vote_average >= 7.5);
    } else if (filter === 'new-releases') {
      result = [...result].sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    }

    // Filter by Category (Keyword Matching)
    if (activeCategory !== 'All') {
      const keywords = {
        'Romance': ['love', 'romance', 'wedding', 'heart', 'affair', 'kiss', 'passion', 'relationship', 'married', 'wife', 'husband', 'dating', 'couple', 'friend'],
        'Fight': ['war', 'fight', 'battle', 'action', 'agent', 'kill', 'gun', 'army', 'violence', 'soldier', 'terror', 'bomb', 'police', 'heist', 'crime', 'shoot', 'revenge'],
        'Thriller': ['crime', 'murder', 'mystery', 'suspense', 'detective', 'police', 'fear', 'chase', 'dark', 'secret', 'investigation', 'escape', 'trap', 'psychopath', 'danger', 'dead', 'death']
      };

      const targetKeywords = keywords[activeCategory] || [];
      result = result.filter(movie => {
        // Robust lowercase matching against Title, Overview, and Tagline
        const text = (movie.overview + ' ' + movie.title + ' ' + (movie.tagline || '')).toLowerCase();
        return targetKeywords.some(k => text.includes(k.toLowerCase()));
      });
    }

    setFilteredMovies(result);
  }, [searchTerm, filter, activeCategory, movies]);

  // Handle category change specifically to ensure state updates trigger re-render
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    window.scrollTo(0, 0); // Scroll to top when category changes
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="brand-logo-container" onClick={() => { setActiveCategory('All'); setFilter('all'); setSearchTerm(''); }}>
          <div className="brand-mark">
            {/* Visual Abstract Camera Lens */}
          </div>
          {/* Text is hidden via CSS to emphasize the new visual idea */}
          <span className="brand-text">CINE</span>
        </div>

        {/* Category Navigation */}
        <nav className="category-nav">
          {['All', 'Romance', 'Fight', 'Thriller'].map(cat => (
            <button
              key={cat}
              className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Movies</option>
            <option value="high-rated">Top Rated</option>
            <option value="new-releases">Newest</option>
          </select>
        </div>
      </header>
      <main>
        {selectedMovieId ? (
          <MovieDetail
            movieId={selectedMovieId}
            onBack={() => setSelectedMovieId(null)}
          />
        ) : (
          <MovieList
            movies={filteredMovies}
            onSelectMovie={(id) => setSelectedMovieId(id)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
