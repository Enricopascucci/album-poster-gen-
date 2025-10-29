/**
 * 🎫 Token Service
 *
 * Gestisce la validazione dei token e il tracking dei download
 */

import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export interface TokenValidationResponse {
  valid: boolean;
  status: 'active' | 'used' | 'expired' | 'invalid';
  error?: string;
  customerEmail?: string;
  expiresAt?: string;
  orderId?: string;
  downloadedAt?: string;
}

export interface MarkDownloadedPayload {
  token: string;
  posterData: {
    albumId: string;
    albumName: string;
    artistName: string;
    customization?: Record<string, any>;
  };
}

/**
 * Valida un token chiamando il Google Apps Script
 */
export async function validateToken(token: string): Promise<TokenValidationResponse> {
  try {
    const response = await axios.get(API_ENDPOINTS.validateToken(token), {
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
      error: 'Errore di connessione al server. Riprova più tardi.',
    };
  }
}

/**
 * Marca un token come scaricato
 */
export async function markDownloaded(payload: MarkDownloadedPayload): Promise<boolean> {
  try {
    const response = await axios.post(API_ENDPOINTS.markDownloaded(), payload, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.success === true;
  } catch (error) {
    console.error('Error marking download:', error);
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
