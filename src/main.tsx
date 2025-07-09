import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'
import { GameProvider } from './contexts/GameContext.tsx'
import { ModalProvider } from './contexts/ModalContext.tsx'
import { SettingsProvider } from './contexts/SettingsContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <SettingsProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </SettingsProvider>
    </GameProvider>
  </StrictMode>
)
