import { useState, useCallback, useEffect } from 'react';
import { musicService } from '../services/musicService';
import type { Album } from '../types/album';
import { LoadingOverlay, LoadingState } from './Spinner';

interface AlbumSearchProps {
  onAlbumSelect: (album: Album) => void;
}

export function AlbumSearch({ onAlbumSelect }: AlbumSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingAlbum, setLoadingAlbum] = useState(false);

  // Load trending USA albums on mount
  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const albums = await musicService.getTrendingGlobalAlbums(24);
        setResults(albums);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load trending albums');
        setResults([]);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      // If query is cleared, reload trending albums
      setInitialLoading(true);
      try {
        const albums = await musicService.getTrendingGlobalAlbums(24);
        setResults(albums);
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
      const albums = await musicService.searchAlbums(query, 12);
      setResults(albums);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search albums');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleAlbumClick = async (album: Album) => {
    setLoadingAlbum(true);
    try {
      const fullAlbum = await musicService.getAlbum(album.id);
      onAlbumSelect(fullAlbum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load album details');
    } finally {
      setLoadingAlbum(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="min-h-screen bg-black w-full relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-black to-blue-950/20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="text-center mb-16">
          <h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-white tracking-tight"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
          >
            POSTER<br />GENERATOR
          </h1>
          <p
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
          >
            {query ? 'Search for an album and create a beautiful poster'
                   : 'Discover trending albums all around the world'}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-20 max-w-3xl mx-auto">
          <div className="relative flex-1 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-20 group-focus-within:opacity-60 blur transition-all duration-300" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for an album (e.g., Starboy, Midnights)"
              className="relative w-full px-6 py-4 text-base bg-zinc-900/90 backdrop-blur-sm text-white border border-white/10 rounded-xl outline-none transition-all duration-300 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 placeholder:text-gray-500 focus:bg-zinc-900"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="relative px-8 py-4 text-base font-bold uppercase tracking-[0.08em] bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none rounded-full cursor-pointer whitespace-nowrap hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/80 hover:scale-105 disabled:hover:scale-100"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            {loading ? 'Searching...' : (query ? 'Search' : 'Refresh')}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 text-red-400 p-4 rounded-lg text-center border border-red-500/30">
            {error}
          </div>
        )}

        {initialLoading && (
          <LoadingState text="Loading trending albums..." />
        )}

        {loading && !initialLoading && (
          <LoadingState text="Searching..." />
        )}

        {loadingAlbum && (
          <LoadingOverlay text="Loading album details..." />
        )}

        {results.length > 0 && !initialLoading && !loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {results.map((album, index) => (
              <div
                key={album.id}
                className="group relative animate-fadeIn"
                onClick={() => handleAlbumClick(album)}
                style={{
                  animationDelay: `${index * 30}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-75 blur-xl transition-all duration-500 group-hover:duration-200" />

                {/* Card */}
                <div className="relative bg-zinc-900/90 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border border-white/5 group-hover:border-white/20 group-hover:scale-105 group-hover:shadow-2xl">
                  <div className="relative overflow-hidden">
                    <img
                      src={album.images[0]?.url}
                      alt={album.name}
                      className="w-full aspect-square object-cover block transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                    />
                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4 bg-gradient-to-b from-zinc-900/50 to-zinc-900">
                    <h3
                      className="text-sm font-bold m-0 mb-2 overflow-hidden text-ellipsis whitespace-nowrap text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 700 }}
                    >
                      {album.name}
                    </h3>
                    <p
                      className="text-xs text-gray-400 m-0 mb-1.5 overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-gray-300 transition-colors"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 400 }}
                    >
                      {album.artists.map((a) => a.name).join(', ')}
                    </p>
                    <p
                      className="text-xs text-gray-500 m-0 group-hover:text-gray-400 transition-colors"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
                    >
                      {new Date(album.release_date).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !initialLoading && query && results.length === 0 && !error && (
          <div
            className="text-center text-gray-400 py-8 text-lg"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 350 }}
          >
            No albums found. Try a different search term.
          </div>
        )}
      </div>
    </div>
  );
}
