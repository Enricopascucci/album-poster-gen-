/**
 * 🎬 Movie Service (TMDb API)
 *
 * Servizio per l'integrazione con The Movie Database (TMDb) API
 * https://developers.themoviedb.org/3
 *
 * API Key: Gratuita - registrati su https://www.themoviedb.org/settings/api
 */

import axios from 'axios';
import type {
  Movie,
  MovieSearchResponse,
  MovieListResponse,
  TMDbConfiguration,
} from '../types/movie';

const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

class MovieService {
  private apiKey: string | null = null;
  private config: TMDbConfiguration | null = null;

  constructor() {
    this.apiKey = import.meta.env.VITE_TMDB_API_KEY;
  }

  /**
   * Verifica che l'API key sia configurata
   */
  private ensureApiKey(): string {
    if (!this.apiKey) {
      throw new Error(
        'TMDb API key not configured. Please set VITE_TMDB_API_KEY in your .env file.\n' +
        'Get your free API key at: https://www.themoviedb.org/settings/api'
      );
    }
    return this.apiKey;
  }

  /**
   * Helper per chiamate API
   */
  private async apiGet<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const apiKey = this.ensureApiKey();
    try {
      const response = await axios.get<T>(`${TMDB_API_BASE}${endpoint}`, {
        params: {
          api_key: apiKey,
          language: 'en-US', // Lingua inglese per coerenza globale
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`TMDb API error (${endpoint}):`, error);
      throw new Error(`Failed to fetch from TMDb: ${endpoint}`);
    }
  }

  /**
   * Ottiene la configurazione API (necessaria per URL immagini)
   * Cached per evitare chiamate ripetute
   */
  async getConfiguration(): Promise<TMDbConfiguration> {
    if (this.config) return this.config;
    this.config = await this.apiGet<TMDbConfiguration>('/configuration');
    return this.config;
  }

  /**
   * Costruisce URL per immagini TMDb
   * @param path - Path dell'immagine (es. /abc123.jpg)
   * @param size - Dimensione desiderata (w500, original, etc.)
   */
  getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500'): string {
    if (!path) return '';
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
  }

  /**
   * Cerca film per query
   * @param query - Testo di ricerca (es. "Inception")
   * @param limit - Numero massimo di risultati (max 20 per pagina API)
   */
  async searchMovies(query: string, limit: number = 10): Promise<Movie[]> {
    if (!query.trim()) return [];

    try {
      const data = await this.apiGet<MovieSearchResponse>('/search/movie', {
        query,
        page: 1,
        include_adult: false,
      });

      // Convertiamo i risultati di ricerca in Movie completi
      const movieIds = data.results.slice(0, limit).map(m => m.id);

      // Fetch dettagli completi per ogni film (in parallelo)
      const movies = await Promise.all(
        movieIds.map(id => this.getMovie(id))
      );

      return movies;
    } catch (error) {
      console.error('Failed to search movies:', error);
      throw new Error('Failed to search movies');
    }
  }

  /**
   * Ottiene dettagli completi di un film, inclusi credits
   * @param movieId - ID TMDb del film
   */
  async getMovie(movieId: number): Promise<Movie> {
    try {
      return await this.apiGet<Movie>(`/movie/${movieId}`, {
        append_to_response: 'credits', // Include cast e crew
      });
    } catch (error) {
      console.error(`Failed to get movie ${movieId}:`, error);
      throw new Error('Failed to get movie details');
    }
  }

  /**
   * Ottiene film popolari (trending)
   * Perfetto per mostrare suggerimenti sulla home
   * @param limit - Numero di film da ottenere
   */
  async getPopularMovies(limit: number = 24): Promise<Movie[]> {
    try {
      const data = await this.apiGet<MovieListResponse>('/movie/popular', {
        page: 1,
      });

      // Fetch dettagli completi per i film popolari
      const movieIds = data.results.slice(0, limit).map(m => m.id);
      const movies = await Promise.all(
        movieIds.map(id => this.getMovie(id))
      );

      return movies;
    } catch (error) {
      console.error('Failed to get popular movies:', error);
      throw new Error('Failed to load popular movies');
    }
  }

  /**
   * Ottiene film top-rated (migliori valutazioni)
   * @param limit - Numero di film da ottenere
   */
  async getTopRatedMovies(limit: number = 24): Promise<Movie[]> {
    try {
      const data = await this.apiGet<MovieListResponse>('/movie/top_rated', {
        page: 1,
      });

      const movieIds = data.results.slice(0, limit).map(m => m.id);
      const movies = await Promise.all(
        movieIds.map(id => this.getMovie(id))
      );

      return movies;
    } catch (error) {
      console.error('Failed to get top rated movies:', error);
      throw new Error('Failed to load top rated movies');
    }
  }

  /**
   * Ottiene film in uscita
   * @param limit - Numero di film da ottenere
   */
  async getNowPlayingMovies(limit: number = 24): Promise<Movie[]> {
    try {
      const data = await this.apiGet<MovieListResponse>('/movie/now_playing', {
        page: 1,
        region: 'US', // Regione USA per coerenza globale
      });

      const movieIds = data.results.slice(0, limit).map(m => m.id);
      const movies = await Promise.all(
        movieIds.map(id => this.getMovie(id))
      );

      return movies;
    } catch (error) {
      console.error('Failed to get now playing movies:', error);
      throw new Error('Failed to load now playing movies');
    }
  }

  /**
   * Ottiene film per genere
   * @param genreId - ID del genere TMDb (es. 28 = Action, 35 = Comedy)
   * @param limit - Numero di film da ottenere
   */
  async getMoviesByGenre(genreId: number, limit: number = 24): Promise<Movie[]> {
    try {
      const data = await this.apiGet<MovieListResponse>('/discover/movie', {
        with_genres: genreId,
        sort_by: 'popularity.desc',
        page: 1,
      });

      const movieIds = data.results.slice(0, limit).map(m => m.id);
      const movies = await Promise.all(
        movieIds.map(id => this.getMovie(id))
      );

      return movies;
    } catch (error) {
      console.error(`Failed to get movies by genre ${genreId}:`, error);
      throw new Error('Failed to load movies by genre');
    }
  }
}

/**
 * Singleton instance
 */
export const movieService = new MovieService();

/**
 * TMDb Genre IDs (per reference)
 */
export const TMDB_GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
} as const;
