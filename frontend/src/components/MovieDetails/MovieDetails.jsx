import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videoMapping } from '../../config/videoMapping';

const MovieDetails = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=fr-FR`,
          {
            headers: {
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjIxMzZjYmRhNGE3NDkwMWIwMjNkMjA2NWY3ZDRiMCIsIm5iZiI6MTcyNjY2NzcyMC4wMjM4MjYsInN1YiI6IjY2ZWFkOTJlNWMwNTE5YTIzNGQzNjY2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IHCx_EGrz_W_UfYue4zUZZM5uGcz7bYvQDl8ym_E7vw',
              accept: 'application/json',
            }
          }
        );
        const data = await response.json();
        setMovie(data);
        setLoading(false);
      } catch (error) {
        setError('Erreur lors du chargement des détails du film');
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>Film non trouvé</div>;

  return (
    <div className="movie-details-container">
      <button onClick={() => navigate(-1)} className="back-button">
        Retour
      </button>
      <div className="movie-details-header">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="movie-details-poster"
        />
        <div className="movie-details-info">
          <h1 className="movie-details-title">{movie.title}</h1>
          <p className="movie-details-overview">{movie.overview}</p>
          <div className="movie-details-meta">
            <p>Date de sortie : {movie.release_date}</p>
            <p>Note : {movie.vote_average}/10</p>
            <p>Durée : {movie.runtime} minutes</p>
          </div>
          <button 
            className={`play-button ${videoMapping[movie.id] ? '' : 'disabled'}`}
            onClick={() => videoMapping[movie.id] ? navigate(`/watch/${movie.id}`) : null}
            title={videoMapping[movie.id] ? 'Lecture' : 'Non disponible'}
          >
            <i className="fas fa-play"></i> 
            {videoMapping[movie.id] ? 'Lecture' : 'Non disponible'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
