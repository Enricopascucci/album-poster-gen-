/**
 * 🎵 Album Creator Page
 * 
 * Pagina per creare poster di album senza token (demo/test)
 */

import { useState } from 'react';
import { AlbumSearch } from '../../components/AlbumSearch';
import { PosterGenerator } from '../../components/PosterGenerator';
import type { Album } from '../../types/album';

export function AlbumCreator() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const handleAlbumSelect = (album: Album) => {
    setSelectedAlbum(album);
  };

  const handleBack = () => {
    setSelectedAlbum(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedAlbum ? (
        <PosterGenerator album={selectedAlbum} onBack={handleBack} />
      ) : (
        <AlbumSearch onAlbumSelect={handleAlbumSelect} />
      )}
    </div>
  );
}


