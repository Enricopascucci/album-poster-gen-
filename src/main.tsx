import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Home } from './pages/Home'
import { CreateWithToken } from './pages/CreateWithToken'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create/:token" element={<CreateWithToken />} />
        <Route path="/demo" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
