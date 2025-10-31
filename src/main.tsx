import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import { Home } from './pages/Home'
import { AlbumCreateWithToken } from './pages/album/AlbumCreateWithToken'
import { AdminPanel } from './pages/AdminPanel'

/**
 * Main Router - Paywall Only (Music Posters)
 *
 * ✅ 100% Paywall: solo token-based access
 * ❌ Nessuna demo gratuita
 *
 * Routes Attive:
 * - / → Home (landing Etsy)
 * - /album/create/:token → Generatore con token validato
 * - /create/:token → Legacy redirect (retrocompatibilità)
 *
 * Routes Rimosse (no demo):
 * - /album → REMOVED (era demo gratuita)
 * - /music → REMOVED (era demo gratuita)
 * - /movie → REMOVED (futuro multi-tipo)
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Home - Landing page con CTA Etsy */}
        <Route path="/" element={<Home />} />

        {/* Admin Panel - Manual order creation (route oscurata per sicurezza) */}
        <Route path="/mls-panel-secret-2025" element={<AdminPanel />} />

        {/* Album Poster Generator - Solo con Token */}
        <Route path="/album/create/:token" element={<AlbumCreateWithToken />} />

        {/* Legacy route - retrocompatibilità per vecchi link email */}
        <Route path="/create/:token" element={<AlbumCreateWithToken />} />

        {/* Catch-all: redirect tutte le altre route alla home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
