import React, { useState, useEffect } from 'react';

function MovieDetail({ movieId, onBack }) {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMovie() {
            try {
                const response = await fetch(`/api/movies/${movieId}`);
                const payload = await response.json();
                setMovie(payload.data);
            } catch (error) {
                console.error("Failed to fetch movie details", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMovie();
    }, [movieId]);

    if (loading) return <div className="loading-container">Loading movie details...</div>;
    if (!movie) return <div className="loading-container">Movie not found</div>;

    const formattedDate = new Date(movie.release_date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const hours = Math.floor(movie.runtime / 60);
    const minutes = movie.runtime % 60;
    const formattedRuntime = `${hours}h ${minutes}m`;

    return (
        <div className="movie-detail">
            <button onClick={onBack} className="back-button">← Back to List</button>

            <div className="movie-detail-container">
                <div className="poster-placeholder detail-poster">
                    {/* Unified Logo - No Video, No Initials */}
                    <div className="card-logo" style={{ transform: 'scale(1.5)' }}></div>
                </div>

                <div className="detail-content">
                    <div className="detail-header">
                        <h2>{movie.title}</h2>
                        {movie.tagline && <p className="detail-tagline">"{movie.tagline}"</p>}
                    </div>

                    <div className="meta-info">
                        <div className="meta-item">
                            <span className="meta-label">Released</span>
                            <span className="meta-value">{formattedDate}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Runtime</span>
                            <span className="meta-value">{formattedRuntime}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Rating</span>
                            <span className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#e74c3c" stroke="none">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                                {movie.vote_average} ({movie.vote_count} votes)
                            </span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Status</span>
                            <span className="meta-value">{movie.status}</span>
                        </div>
                    </div>

                    <div className="overview">
                        <h3>Overview</h3>
                        <p>{movie.overview}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetail;
