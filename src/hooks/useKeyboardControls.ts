import { useEffect } from 'react'

import type { Direction } from '../types/TileTypes.ts'

import { useGameContext } from './useGameContext'
import { useModal } from './useModal.ts'

// todo  I should block movements after 2048 reached
export const useKeyboardControls = () => {
  const { dispatch } = useGameContext()
  const { modalType, closeModal } = useModal()

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modalType !== null) {
        closeModal()

        return
      }

      if (modalType !== null) {
        return
      }

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
  }, [dispatch, modalType, closeModal])
}
