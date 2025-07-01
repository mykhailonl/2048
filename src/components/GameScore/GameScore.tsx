import { useEffect } from 'react'

import { useGameContext } from '../../hooks/useGameContext.ts'
import { useLocalStorage } from '../../hooks/useLocalStorage.ts'
import { ScoreCard } from '../ScoreCard'

export const GameScore = () => {
  const { state } = useGameContext()
  const [bestScore, setBestScore] = useLocalStorage<number>('bestScore', 0)

  useEffect(() => {
    if (state.score >= bestScore) {
      setBestScore(state.score)
    }
  }, [state.score, bestScore, setBestScore])

  return (
    <div className="flex gap-4 items-center justify-center">
      <ScoreCard fieldName="Score" fieldValue={state.score} mainCard={true} />

      <ScoreCard fieldName="Best" fieldValue={bestScore} />
    </div>
  )
}
