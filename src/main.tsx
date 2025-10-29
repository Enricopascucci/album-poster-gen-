import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Home } from './pages/Home'
import { AlbumCreator } from './pages/album/AlbumCreator'
import { AlbumCreateWithToken } from './pages/album/AlbumCreateWithToken'

/**
 * Main Router
 * 
 * Struttura scalabile per supportare diversi tipi di poster:
 * - /album → Generatore album (demo/test)
 * - /album/create/:token → Generatore album con token
 * - /movie → Generatore film (futuro)
 * - /movie/create/:token → Generatore film con token (futuro)
 * - /game → Generatore videogiochi (futuro)
 * - /game/create/:token → Generatore videogiochi con token (futuro)
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        
        {/* Album Routes */}
        <Route path="/album" element={<AlbumCreator />} />
        <Route path="/album/create/:token" element={<AlbumCreateWithToken />} />
        
        {/* Movie Routes - To be implemented */}
        {/* <Route path="/movie" element={<MovieCreator />} /> */}
        {/* <Route path="/movie/create/:token" element={<MovieCreateWithToken />} /> */}
        
        {/* Game Routes - To be implemented */}
        {/* <Route path="/game" element={<GameCreator />} /> */}
        {/* <Route path="/game/create/:token" element={<GameCreateWithToken />} /> */}
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/music" element={<AlbumCreator />} />
        <Route path="/create/:token" element={<AlbumCreateWithToken />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
