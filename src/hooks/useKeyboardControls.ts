import { useEffect } from 'react'

import type { Direction } from '../types/TileTypes.ts'

import { useGameContext } from './useGameContext'

export const useKeyboardControls = () => {
  const { dispatch } = useGameContext()

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
      ) {
        event.preventDefault()
      }

      const keyToDirection: Record<string, Direction> = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
      }

      const direction = keyToDirection[event.key]
      if (direction) {
        dispatch({ type: 'QUEUE_COMMAND', direction })
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [dispatch])
}
