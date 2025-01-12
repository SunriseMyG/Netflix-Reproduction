import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [romanceMovies, setRomanceMovies] = useState([]);
  const [kidMovies, setKidMovies] = useState([]);
  const [dramaMovies, setDramaMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [adventureMovies, setAdventureMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [mediaType, setMediaType] = useState('all');
  const navigate = useNavigate();

  const options = useMemo(() => ({
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjIxMzZjYmRhNGE3NDkwMWIwMjNkMjA2NWY3ZDRiMCIsIm5iZiI6MTcyNjY2NzcyMC4wMjM4MjYsInN1YiI6IjY2ZWFkOTJlNWMwNTE5YTIzNGQzNjY2NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IHCx_EGrz_W_UfYue4zUZZM5uGcz7bYvQDl8ym_E7vw',
    }
  }), []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
    }
  };

  const fetchMoviesByGenre = useCallback(async (genreId, setMovies) => {
    try {
      const allMovies = [];
      for (let page = 1; page <= 5; page++) {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?language=fr-FR&page=${page}&with_genres=${genreId}`,
          options
        );
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des films par genre');
        }
        const data = await response.json();
        allMovies.push(...data.results);
      }
      setMovies(allMovies);
    } catch (error) {
      setError(error.message);
    }
  }, [options]);

  const toggleFavorite = async (movie) => {
    try {
      const token = localStorage.getItem('token');
      const movieIdStr = movie.id.toString();
      const isFavorite = favorites.some(fav => fav.movieId === movieIdStr);
      
      if (isFavorite) {
        const response = await fetch(`http://localhost:5000/api/favorites/${movieIdStr}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression du favori');
        }
      } else {
        const response = await fetch('http://localhost:5000/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            movieId: movieIdStr,
            movieData: movie
          })
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de l\'ajout du favori');
        }
      }
      
      await fetchFavorites();
    } catch (error) {
      console.error('Erreur lors de la modification des favoris:', error);
    }
  };

  const fetchSearchResults = useCallback(async (query, type) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    
    try {
      let endpoint = '';
      if (type === 'all') {
        endpoint = `/search/multi?query=${query}&language=fr-FR`;
      } else if (type === 'movie') {
        endpoint = `/search/movie?query=${query}&language=fr-FR`;
      } else if (type === 'tv') {
        endpoint = `/search/tv?query=${query}&language=fr-FR`;
      } else if (type === 'documentary' || type === 'animation') {
        const searchResponse = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${query}&language=fr-FR`,
          options
        );
        const searchData = await searchResponse.json();
        
        const genreId = type === 'documentary' ? 99 : 16;
        const filteredResults = searchData.results.filter(movie => 
          movie.genre_ids && movie.genre_ids.includes(genreId)
        );
        
        setSearchResults(filteredResults);
        return;
      }

      const response = await fetch(`https://api.themoviedb.org/3${endpoint}`, options);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setError('Erreur lors de la recherche');
      setSearchResults([]);
    }
  }, [options]);

  const fetchMovies = useCallback(async (category, setCategory) => {
    try {
      const allMovies = [];
      for (let page = 1; page <= 10; page++) {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${category}?language=fr-FR&page=${page}`,
          options
        );
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        allMovies.push(...data.results);
      }
      setCategory(allMovies);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        fetchSearchResults(searchQuery, mediaType);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, mediaType, fetchSearchResults]);

  useEffect(() => {
    fetchMovies('popular', setPopularMovies);
    fetchMovies('top_rated', setTopRatedMovies);
    fetchMovies('upcoming', setUpcomingMovies);
    fetchMoviesByGenre(10749, setRomanceMovies); // Genre ID pour Romance
    fetchMoviesByGenre(16, setKidMovies); // Genre ID pour Animation (Kid-friendly)
    fetchMoviesByGenre(18, setDramaMovies); // Genre ID pour Drame
    fetchMoviesByGenre(27, setHorrorMovies); // Genre ID pour Horreur
    fetchMoviesByGenre(12, setAdventureMovies); // Genre ID pour Aventure
    fetchFavorites();
  }, [fetchMovies, fetchMoviesByGenre]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Chargement des films...</div>
      </div>
    );
  }

  if (error) {
    return <p>Erreur: {error}</p>;
  }

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const MovieList = ({ title, movies }) => (
    <div className="slider-container">
      <h2>{title}</h2>
      <Slider {...sliderSettings}>
        {movies.map(movie => (
          <MovieItem key={movie.id} movie={movie} />
        ))}
      </Slider>
    </div>
  );

  const MovieItem = ({ movie }) => {
    const navigate = useNavigate();
    const isFavorite = favorites.some(fav => fav.movieId === movie.id.toString());
    
    return (
      <div className="movie-item">
        <button 
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={() => toggleFavorite(movie)}
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        </button>
        <button 
          className="details-button"
          onClick={() => navigate(`/movie/${movie.id}`)}
        >
          <i className="fas fa-info"></i>
        </button>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="movie-poster"
        />
        <div className="movie-details">
          <div className="movie-title">{movie.title}</div>
          <div className="movie-release-date">
            Date de sortie : {movie.release_date}
          </div>
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button">
          Déconnexion
        </button>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* <select 
          className="type-select"
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
        >
          <option value="all">Tout</option>
          <option value="movie">Films</option>
          <option value="tv">Séries</option>
          <option value="documentary">Documentaires</option>
          <option value="animation">Animation</option>
        </select> */}
      </div>

      {searchQuery && searchResults.length > 0 ? (
        <MovieList title="Résultats de la recherche" movies={searchResults} />
      ) : searchQuery ? (
        <p className="no-results">Aucun résultat trouvé</p>
      ) : (
        <>
          {favorites.length > 0 && (
            <MovieList title="Mes Favoris" movies={favorites.map(fav => fav.movieData)} />
          )}
          <MovieList title="Films Populaires" movies={popularMovies} />
          <MovieList title="Les Mieux Notés" movies={topRatedMovies} />
          {/* <MovieList title="Prochaines Sorties" movies={upcomingMovies} />     */}
          <MovieList title="Romance" movies={romanceMovies} />
          <MovieList title="Animation pour les enfants" movies={kidMovies} />
          <MovieList title="Drame" movies={dramaMovies} />
          <MovieList title="Horreur" movies={horrorMovies} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
