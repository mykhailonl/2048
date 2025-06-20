import { useContext } from 'react'

import { GameContext } from '../contexts/GameContext.tsx'

export const useGameContext = () => {
  const context = useContext(GameContext)

  if (!context) {
    throw new Error('useGameContext must be used within GameProvider')
  }

  return context
}
