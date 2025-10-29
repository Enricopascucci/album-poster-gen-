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

  // Carica gli album globali più ascoltati all'avvio
  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const albums = await musicService.getTrendingGlobalAlbums(24);
        setResults(albums);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossibile caricare i trend');
        setResults([]);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      // se svuoto la query, rimetto i trend globali
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 text-gray-900">
          Poster Generator
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          {query ? 'Search for an album and create a beautiful poster'
                 : 'Trending albums worldwide'}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-12 max-w-2xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for an album (e.g., Starboy)"
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
        <LoadingState text="Loading trending albums..." />
      )}

      {loading && !initialLoading && (
        <LoadingState text="Searching..." />
      )}

      {loadingAlbum && (
        <LoadingOverlay text="Loading album details..." />
      )}

      {results.length > 0 && !initialLoading && !loading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5">
          {results.map((album) => (
            <div
              key={album.id}
              className="group bg-white rounded-lg overflow-hidden cursor-pointer transition-all border border-gray-200 hover:border-gray-300 hover:shadow-lg"
              onClick={() => handleAlbumClick(album)}
            >
              <div className="overflow-hidden">
                <img
                  src={album.images[0]?.url}
                  alt={album.name}
                  className="w-full aspect-square object-cover block transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold m-0 mb-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-gray-900">
                  {album.name}
                </h3>
                <p className="text-xs text-gray-600 m-0 mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {album.artists.map((a) => a.name).join(', ')}
                </p>
                <p className="text-xs text-gray-400 m-0">
                  {new Date(album.release_date).getFullYear()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !initialLoading && query && results.length === 0 && !error && (
        <div className="text-center text-gray-600 py-8 text-lg">
          No albums found. Try a different search term.
        </div>
      )}
    </div>
  );
}
