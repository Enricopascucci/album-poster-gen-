/**
 * 🎬 Movie Creator Page
 *
 * Pagina principale per la creazione di poster cinematografici
 * Route: /movie
 */

import { useState } from 'react';
import { MovieSearch } from '../../components/MovieSearch';
import { MoviePosterGenerator } from '../../components/MoviePosterGenerator';
import type { Movie } from '../../types/movie';

export function MovieCreator() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleBack = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedMovie ? (
        <MoviePosterGenerator movie={selectedMovie} onBack={handleBack} />
      ) : (
        <MovieSearch onMovieSelect={handleMovieSelect} />
      )}
    </div>
  );
}
