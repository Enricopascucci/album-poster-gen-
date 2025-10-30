/**
 * 🎫 Token Service
 *
 * Gestisce la validazione dei token e il tracking dei download
 * Supporta diversi tipi di poster: album, movie, game
 */

import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import type { PosterDownloadMetadata } from '../types/poster';
import type { PosterType } from '../config/posterTypes';

export interface TokenValidationResponse {
  valid: boolean;
  status: 'active' | 'used' | 'expired' | 'invalid';
  error?: string;
  customerEmail?: string;
  expiresAt?: string;
  orderId?: string;
  downloadedAt?: string;
  posterType?: PosterType;
}

export interface MarkDownloadedPayload {
  token: string;
  posterData: PosterDownloadMetadata;
}

/**
 * Valida un token chiamando il Google Apps Script
 * @param token - Token univoco di acquisto
 * @param posterType - Tipo di poster (album, movie, game) - opzionale per retrocompatibilità
 */
export async function validateToken(
  token: string,
  posterType?: PosterType
): Promise<TokenValidationResponse> {
  try {
    const url = posterType
      ? `${API_ENDPOINTS.validateToken(token)}&posterType=${posterType}`
      : API_ENDPOINTS.validateToken(token);

    const response = await axios.get(url, {
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Ritorna i dati di errore dal server se disponibili
      return error.response.data;
    }

    // Errore di rete o altro
    return {
      valid: false,
      status: 'invalid',
      error: 'Server connection error. Please try again later.',
    };
  }
}

/**
 * Marca un token come scaricato
 * Usa GET invece di POST per evitare problemi CORS con Google Apps Script
 */
export async function markDownloaded(payload: MarkDownloadedPayload): Promise<boolean> {
  console.log('🎯 [markDownloaded] Starting...');
  console.log('📤 [markDownloaded] Payload:', payload);

  try {
    // Usa GET invece di POST per evitare CORS preflight
    const url = `${API_ENDPOINTS.markDownloaded()}` +
      `&token=${encodeURIComponent(payload.token)}` +
      `&posterData=${encodeURIComponent(JSON.stringify(payload.posterData))}`;

    console.log('🔗 [markDownloaded] API URL:', url);

    const response = await axios.get(url, {
      timeout: 10000,
    });

    console.log('✅ [markDownloaded] Success! Response:', response.data);
    return response.data.success === true;
  } catch (error) {
    console.error('❌ [markDownloaded] Error:', error);
    if (axios.isAxiosError(error)) {
      console.error('   Status:', error.response?.status);
      console.error('   Data:', error.response?.data);
      console.error('   Message:', error.message);
    }
    return false;
  }
}

/**
 * Salva il token in sessionStorage per usarlo durante la sessione
 */
export function saveTokenToSession(token: string): void {
  sessionStorage.setItem('albumPosterGen_token', token);
}

/**
 * Recupera il token dalla sessione
 */
export function getTokenFromSession(): string | null {
  return sessionStorage.getItem('albumPosterGen_token');
}

/**
 * Rimuove il token dalla sessione
 */
export function clearTokenFromSession(): void {
  sessionStorage.removeItem('albumPosterGen_token');
}
