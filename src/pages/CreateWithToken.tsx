/**
 * 🎨 Create With Token Page
 *
 * Pagina principale per clienti che arrivano con un token valido da email
 * Valida il token e permette la creazione + download del poster
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlbumSearch } from '../components/AlbumSearch';
import { PosterGenerator } from '../components/PosterGenerator';
import type { Album } from '../types/album';
import {
  validateToken,
  saveTokenToSession,
  type TokenValidationResponse,
} from '../services/tokenService';

export function CreateWithToken() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [validationStatus, setValidationStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [tokenData, setTokenData] = useState<TokenValidationResponse | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  useEffect(() => {
    if (!token) {
      setValidationStatus('invalid');
      return;
    }

    // Valida il token
    validateToken(token)
      .then((response) => {
        if (response.valid) {
          setValidationStatus('valid');
          setTokenData(response);
          saveTokenToSession(token);
        } else {
          setValidationStatus('invalid');
          setTokenData(response);
        }
      })
      .catch((error) => {
        console.error('Token validation error:', error);
        setValidationStatus('invalid');
      });
  }, [token]);

  const handleAlbumSelect = (album: Album) => {
    setSelectedAlbum(album);
  };

  const handleBack = () => {
    setSelectedAlbum(null);
  };

  // Loading state
  if (validationStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Validazione del tuo link...</p>
        </div>
      </div>
    );
  }

  // Invalid token states
  if (validationStatus === 'invalid' || !tokenData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          {tokenData?.status === 'used' ? (
            <>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Poster già scaricato
              </h1>
              <p className="text-gray-600 text-center mb-6">
                Questo link è già stato utilizzato per scaricare un poster.
              </p>
              {tokenData.downloadedAt && (
                <p className="text-sm text-gray-500 text-center mb-4">
                  Scaricato il: {new Date(tokenData.downloadedAt).toLocaleString('it-IT')}
                </p>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Hai perso il file?</strong><br />
                  Contattaci via email e ti aiuteremo a recuperarlo.
                </p>
              </div>
            </>
          ) : tokenData?.status === 'expired' ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Link scaduto
              </h1>
              <p className="text-gray-600 text-center mb-6">
                Questo link è scaduto e non può più essere utilizzato.
              </p>
              {tokenData.expiresAt && (
                <p className="text-sm text-gray-500 text-center mb-4">
                  Scaduto il: {new Date(tokenData.expiresAt).toLocaleString('it-IT')}
                </p>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Serve aiuto?</strong><br />
                  Contattaci via email per richiedere un nuovo link.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Link non valido
              </h1>
              <p className="text-gray-600 text-center mb-6">
                {tokenData?.error || 'Questo link non è valido o non esiste.'}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Verifica:</strong><br />
                  - Di aver copiato il link completo dall'email<br />
                  - Che il link non contenga spazi o caratteri extra<br />
                  - Di aver acquistato il prodotto su Etsy
                </p>
              </div>
            </>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full mt-6 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Torna alla Home
          </button>
        </div>
      </div>
    );
  }

  // Valid token - show the normal app interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con info token */}
      <div className="bg-green-500 text-white py-3 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Link valido - Puoi creare il tuo poster</span>
          </div>
          {tokenData.expiresAt && (
            <span className="text-sm opacity-90">
              Scade il: {new Date(tokenData.expiresAt).toLocaleDateString('it-IT')}
            </span>
          )}
        </div>
      </div>

      {/* Interfaccia principale */}
      {selectedAlbum ? (
        <PosterGenerator
          album={selectedAlbum}
          onBack={handleBack}
          tokenMode={true}
          token={token}
        />
      ) : (
        <AlbumSearch
          onAlbumSelect={handleAlbumSelect}
        />
      )}
    </div>
  );
}
