/**
 * 🔧 Configurazione API
 *
 * Configura l'URL del Google Apps Script deployment
 */

// TODO: Sostituisci con il tuo URL di deployment di Google Apps Script
// Lo trovi dopo aver fatto "Deploy" > "New deployment" nel tuo Apps Script
export const GOOGLE_APPS_SCRIPT_URL =
  import.meta.env.VITE_APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

// Base URL dell'applicazione (per generare link nelle email)
export const APP_BASE_URL =
  import.meta.env.VITE_APP_BASE_URL ||
  'http://localhost:5173';

// Configurazione endpoints
export const API_ENDPOINTS = {
  validateToken: (token: string) => `${GOOGLE_APPS_SCRIPT_URL}?action=validate-token&token=${token}`,
  markDownloaded: () => `${GOOGLE_APPS_SCRIPT_URL}?action=mark-downloaded`,
  etsyWebhook: () => `${GOOGLE_APPS_SCRIPT_URL}?action=etsy-webhook`,
};
