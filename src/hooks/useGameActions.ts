import { useCallback } from 'react'

import { useGameContext } from './useGameContext.ts'

export const useGameActions = () => {
  const { dispatch } = useGameContext()

  const newGame = useCallback(() => {
    dispatch({ type: 'NEW_GAME' })
  }, [dispatch])

  return { newGame }
}
