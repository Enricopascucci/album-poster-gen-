// services/musicService.ts
import axios from 'axios';
import type {
  Album,
  AlbumSearchResponse,
  AuthResponse,
} from '../types/album';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_BASE = 'https://accounts.spotify.com/api/token';

// NOTA: Dal 27 novembre 2024, Spotify ha rimosso l'accesso API alle playlist curate
// (Top 50, Today's Top Hits, etc). Usiamo invece gli endpoint pubblici disponibili.

// Market USA per un prodotto globale orientato al mercato americano
const GLOBAL_MARKET = 'US';

class MusicService {
  private accessToken: string | null = null;
  private tokenExpiry = 0;

  // ===== AUTH =====
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) return this.accessToken;

    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      throw new Error(
        'Spotify credentials not configured. Please set VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_CLIENT_SECRET in your .env file'
      );
    }

    try {
      const res = await axios.post<AuthResponse>(
        SPOTIFY_AUTH_BASE,
        new URLSearchParams({ grant_type: 'client_credentials' }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // niente localizzazione implicita
            'Accept-Language': 'en',
            Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
          },
        }
      );
      this.accessToken = res.data.access_token;
      this.tokenExpiry = Date.now() + res.data.expires_in * 1000;
      return this.accessToken;
    } catch (e) {
      console.error('Failed to get Spotify access token:', e);
      throw new Error('Failed to authenticate with Spotify');
    }
  }

  // ===== HTTP helper =====
  private async apiGet<T>(url: string, params?: Record<string, any>): Promise<T> {
    const token = await this.getAccessToken();
    const res = await axios.get<T>(url, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': 'en', // evitiamo risposte localizzate
      },
    });
    return res.data;
  }

  // ===== PUBLIC APIS =====

  async searchAlbums(query: string, limit: number = 10): Promise<Album[]> {
    if (!query.trim()) return [];
    try {
      const data = await this.apiGet<AlbumSearchResponse>(
        `${SPOTIFY_API_BASE}/search`,
        { q: query, type: 'album', limit, market: GLOBAL_MARKET }
      );
      return data.albums.items;
    } catch (e) {
      console.error('Failed to search albums:', e);
      throw new Error('Failed to search albums');
    }
  }

  async getAlbum(albumId: string): Promise<Album> {
    try {
      // anche qui, market fissato per coerenza
      return await this.apiGet<Album>(`${SPOTIFY_API_BASE}/albums/${albumId}`, {
        market: GLOBAL_MARKET,
      });
    } catch (e) {
      console.error('Failed to get album:', e);
      throw new Error('Failed to get album details');
    }
  }

  /**
   * Trending albums USA: usa l'endpoint new-releases con country=US
   * poiché Spotify ha rimosso l'accesso alle playlist curate dal 27/11/2024.
   * Otteniamo album recenti dal mercato USA, perfetto per un prodotto globale.
   */
  async getTrendingGlobalAlbums(limit: number = 24): Promise<Album[]> {
    try {
      // Richiediamo più album per avere varietà e poi ne selezioniamo alcuni
      const albums = await this.getNewReleasesGlobal(Math.min(limit * 2, 50));

      // Restituiamo il numero richiesto
      return albums.slice(0, limit);
    } catch (e) {
      console.error('Failed to get trending albums:', e);
      throw new Error('Failed to load trending albums');
    }
  }

  /**
   * Alias per retrocompatibilità: ignora qualsiasi country e restituisce i GLOBALI.
   */
  async getTrendingAlbums(_countryIgnored: string = 'IT', limit: number = 24) {
    return this.getTrendingGlobalAlbums(limit);
  }

  /**
   * New releases USA: ottiene gli album più recenti dal mercato USA.
   * Perfetto per un prodotto globale orientato al mercato americano.
   */
  async getNewReleasesGlobal(limit: number = 24): Promise<Album[]> {
    try {
      const data = await this.apiGet<{ albums: { items: Album[] } }>(
        `${SPOTIFY_API_BASE}/browse/new-releases`,
        { country: GLOBAL_MARKET, limit }
      );
      return data.albums.items;
    } catch (e) {
      console.error('Failed to get new releases:', e);
      throw new Error('Failed to load new releases');
    }
  }
}

export const musicService = new MusicService();
