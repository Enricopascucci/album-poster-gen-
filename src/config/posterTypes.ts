/**
 * 📋 Poster Types Configuration
 * 
 * Configurazione centralizzata per tutti i tipi di poster supportati.
 * Facilita l'aggiunta di nuovi tipi (film, videogiochi, ecc.)
 */

export type PosterType = 'album' | 'movie' | 'game';

export interface PosterTypeConfig {
  id: PosterType;
  name: string;
  namePlural: string;
  description: string;
  searchPlaceholder: string;
  routePath: string;
  enabled: boolean;
}

/**
 * Configurazione di tutti i tipi di poster disponibili
 */
export const POSTER_TYPES: Record<PosterType, PosterTypeConfig> = {
  album: {
    id: 'album',
    name: 'Album',
    namePlural: 'Albums',
    description: 'Create beautiful posters for your favorite music albums',
    searchPlaceholder: 'Search for an album (e.g., Starboy)',
    routePath: '/album',
    enabled: true,
  },
  movie: {
    id: 'movie',
    name: 'Movie',
    namePlural: 'Movies',
    description: 'Create stunning posters for your favorite films',
    searchPlaceholder: 'Search for a movie (e.g., Inception)',
    routePath: '/movie',
    enabled: false, // Sarà abilitato quando implementato
  },
  game: {
    id: 'game',
    name: 'Video Game',
    namePlural: 'Video Games',
    description: 'Create epic posters for your favorite video games',
    searchPlaceholder: 'Search for a game (e.g., The Witcher 3)',
    routePath: '/game',
    enabled: false, // Sarà abilitato quando implementato
  },
};

/**
 * Ottiene la configurazione di un tipo di poster
 */
export function getPosterTypeConfig(type: PosterType): PosterTypeConfig {
  return POSTER_TYPES[type];
}

/**
 * Ottiene tutti i tipi di poster abilitati
 */
export function getEnabledPosterTypes(): PosterTypeConfig[] {
  return Object.values(POSTER_TYPES).filter(config => config.enabled);
}


