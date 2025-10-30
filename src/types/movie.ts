/**
 * 🎬 Movie Types (TMDb API)
 *
 * Tipi TypeScript per l'integrazione con The Movie Database (TMDb) API
 * https://developers.themoviedb.org/3
 */

/**
 * Genere di un film
 */
export interface MovieGenre {
  id: number;
  name: string;
}

/**
 * Cast member (attore)
 */
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

/**
 * Crew member (regista, producer, etc.)
 */
export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

/**
 * Credits di un film (cast + crew)
 */
export interface MovieCredits {
  cast: CastMember[];
  crew: CrewMember[];
}

/**
 * Production company
 */
export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

/**
 * Movie completo con tutti i dettagli
 */
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string; // formato: YYYY-MM-DD
  runtime: number | null; // in minuti
  vote_average: number; // rating 0-10
  vote_count: number;
  popularity: number;
  genres: MovieGenre[];

  // Immagini
  poster_path: string | null;
  backdrop_path: string | null;

  // Production
  production_companies: ProductionCompany[];
  production_countries: Array<{ iso_3166_1: string; name: string }>;
  spoken_languages: Array<{ iso_639_1: string; name: string }>;

  // Credits (se richiesto con append_to_response=credits)
  credits?: MovieCredits;

  // Status
  status: string; // "Released", "Post Production", etc.
  tagline: string;

  // Budget & Revenue
  budget: number;
  revenue: number;

  // Altri
  adult: boolean;
  video: boolean;
  original_language: string;
  homepage: string | null;
  imdb_id: string | null;
}

/**
 * Movie semplificato per risultati di ricerca
 */
export interface MovieSearchResult {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[]; // IDs dei generi
  adult: boolean;
  video: boolean;
  original_language: string;
}

/**
 * Risposta API search movies
 */
export interface MovieSearchResponse {
  page: number;
  results: MovieSearchResult[];
  total_pages: number;
  total_results: number;
}

/**
 * Risposta API popular/trending movies
 */
export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

/**
 * Configuration API (per costruire URL immagini)
 */
export interface TMDbConfiguration {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
}

/**
 * Helper per ottenere URL immagini TMDb
 */
export const getTMDbImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500'): string => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

/**
 * Helper per ottenere anno da release_date
 */
export const getMovieYear = (releaseDate: string): string => {
  if (!releaseDate) return 'N/A';
  return releaseDate.split('-')[0];
};

/**
 * Helper per formattare durata (minuti -> "2h 30m")
 */
export const formatMovieRuntime = (runtime: number | null): string => {
  if (!runtime) return 'N/A';
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}m`;
};

/**
 * Helper per ottenere regista dai credits
 */
export const getDirector = (credits?: MovieCredits): CrewMember | null => {
  if (!credits?.crew) return null;
  return credits.crew.find(member => member.job === 'Director') || null;
};

/**
 * Helper per ottenere top N cast members
 */
export const getTopCast = (credits: MovieCredits | undefined, limit: number = 5): CastMember[] => {
  if (!credits?.cast) return [];
  return credits.cast
    .filter(member => member.order < limit)
    .sort((a, b) => a.order - b.order)
    .slice(0, limit);
};
