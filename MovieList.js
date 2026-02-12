import React from 'react';

// Simplified MovieCard - Standard Brand Logo (No Video, No Initials)
const MovieCard = ({ movie, onSelectMovie }) => {
    return (
        <div className="movie-card" onClick={() => onSelectMovie(movie.id)}>
            <div className="poster-placeholder">
                <div className="card-logo"></div>
            </div>
            <div className="card-content">
                <h3>{movie.title}</h3>
                <p className="tagline">{movie.tagline || 'No tagline available'}</p>
                <div className="rating-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ marginRight: '6px' }}>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {movie.vote_average}
                </div>
            </div>
        </div>
    );
};

function MovieList({ movies, onSelectMovie }) {
    return (
        <div className="movie-list">
            {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} onSelectMovie={onSelectMovie} />
            ))}
        </div>
    );
}

export default MovieList;
