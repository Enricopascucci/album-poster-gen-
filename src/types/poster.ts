/**
 * 🎨 Generic Poster Types
 * 
 * Tipi generici per supportare diversi tipi di poster (album, film, videogiochi, ecc.)
 */

import type { PosterType } from '../config/posterTypes';

/**
 * Interfaccia base per i dati di un poster
 */
export interface BasePosterData {
  id: string;
  name: string;
  posterType: PosterType;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  release_date?: string;
}

/**
 * Metadata per il download di un poster
 */
export interface PosterDownloadMetadata {
  albumId?: string;
  movieId?: string;
  gameId?: string;
  albumName?: string;
  movieName?: string;
  gameName?: string;
  artistName?: string;
  directorName?: string;
  studioName?: string;
  customization?: Record<string, any>;
}

