/**
 * 🎬 Movie Creator with Token
 *
 * Pagina per creare poster con token di acquisto Etsy
 * Route: /movie/create/:token
 *
 * Il token permette UN SOLO DOWNLOAD. Validato tramite Google Apps Script.
 */

import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MovieSearch } from '../../components/MovieSearch';
import { MoviePosterGenerator } from '../../components/MoviePosterGenerator';
import { LoadingOverlay } from '../../components/Spinner';
import type { Movie } from '../../types/movie';
import { validateToken } from '../../services/tokenService';

export function MovieCreateWithToken() {
  const { token } = useParams<{ token: string }>();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setValidating(false);
      setError('No token provided');
      return;
    }

    (async () => {
      try {
        const result = await validateToken(token, 'movie');
        if (result.valid) {
          setIsValid(true);
          setError(null);
        } else {
          setIsValid(false);
          setError(result.error || 'Invalid token');
        }
      } catch (err) {
        setIsValid(false);
        setError(err instanceof Error ? err.message : 'Failed to validate token');
      } finally {
        setValidating(false);
      }
    })();
  }, [token]);

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleBack = () => {
    setSelectedMovie(null);
  };

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (validating) {
    return <LoadingOverlay text="Validating your purchase token..." />;
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Invalid Token</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Possible reasons:
            </p>
            <ul className="text-sm text-left text-gray-600 space-y-1">
              <li>• Token has already been used</li>
              <li>• Token has expired</li>
              <li>• Token is invalid or malformed</li>
            </ul>
          </div>
          <a
            href="/"
            className="mt-8 inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-50 border-b border-blue-200 py-3 px-4 text-center">
        <p className="text-sm text-blue-800">
          🎬 <strong>Token Mode:</strong> You can download your poster <strong>ONE TIME ONLY</strong>. Make sure you're satisfied before downloading!
        </p>
      </div>

      {selectedMovie ? (
        <MoviePosterGenerator
          movie={selectedMovie}
          onBack={handleBack}
          tokenMode={true}
          token={token}
        />
      ) : (
        <MovieSearch onMovieSelect={handleMovieSelect} />
      )}
    </div>
  );
}
