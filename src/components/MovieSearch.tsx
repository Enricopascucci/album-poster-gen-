/**
 * 🎬 Movie Search Component
 *
 * Componente per cercare film tramite TMDb API
 * Mostra film popolari all'avvio e permette ricerca per titolo
 */

import { useState, useCallback, useEffect } from 'react';
import { movieService } from '../services/movieService';
import type { Movie } from '../types/movie';
import { getTMDbImageUrl, getMovieYear } from '../types/movie';
import { LoadingOverlay, LoadingState } from './Spinner';

interface MovieSearchProps {
  onMovieSelect: (movie: Movie) => void;
}

export function MovieSearch({ onMovieSelect }: MovieSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMovie, setLoadingMovie] = useState(false);

  // Carica i film popolari all'avvio
  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const movies = await movieService.getPopularMovies(24);
        setResults(movies);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load popular movies');
        setResults([]);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      // Se svuoto la query, rimetto i film popolari
      setInitialLoading(true);
      try {
        const movies = await movieService.getPopularMovies(24);
        setResults(movies);
      } catch {
        setResults([]);
      } finally {
        setInitialLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const movies = await movieService.searchMovies(query, 12);
      setResults(movies);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search movies');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleMovieClick = async (movie: Movie) => {
    setLoadingMovie(true);
    try {
      // Ricarica il film completo con tutti i dettagli (per sicurezza)
      const fullMovie = await movieService.getMovie(movie.id);
      onMovieSelect(fullMovie);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movie details');
    } finally {
      setLoadingMovie(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 text-gray-900">
          Movie Poster Generator
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          {query ? 'Search for a movie and create a beautiful poster'
                 : 'Popular movies'}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-12 max-w-2xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for a movie (e.g., Inception)"
          className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-lg outline-none transition-colors focus:border-black focus:ring-2 focus:ring-black/10"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-3 text-base font-medium bg-black text-white border-none rounded-lg cursor-pointer whitespace-nowrap hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Searching...' : (query ? 'Search' : 'Refresh')}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mt-4">
          {error}
        </div>
      )}

      {initialLoading && (
        <LoadingState text="Loading popular movies..." />
      )}

      {loading && !initialLoading && (
        <LoadingState text="Searching..." />
      )}

      {loadingMovie && (
        <LoadingOverlay text="Loading movie details..." />
      )}

      {results.length > 0 && !initialLoading && !loading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5">
          {results.map((movie) => {
            const posterUrl = getTMDbImageUrl(movie.poster_path, 'w500');
            const year = getMovieYear(movie.release_date);
            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

            return (
              <div
                key={movie.id}
                className="group bg-white rounded-lg overflow-hidden cursor-pointer transition-all border border-gray-200 hover:border-gray-300 hover:shadow-lg"
                onClick={() => handleMovieClick(movie)}
              >
                <div className="overflow-hidden">
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover block transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold m-0 mb-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-gray-900">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-gray-600 m-0 mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {year} • ⭐ {rating}
                  </p>
                  {movie.genres && movie.genres.length > 0 && (
                    <p className="text-xs text-gray-400 m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                      {movie.genres.slice(0, 2).map(g => g.name).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !initialLoading && query && results.length === 0 && !error && (
        <div className="text-center text-gray-600 py-8 text-lg">
          No movies found. Try a different search term.
        </div>
      )}
    </div>
  );
}
