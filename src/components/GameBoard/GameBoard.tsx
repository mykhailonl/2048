import { useGameContext } from '../../hooks/useGameContext.ts'
import { GameCell } from '../GameCell'

export const GameBoard = () => {
  const { state } = useGameContext()

  return (
    <div className="game-board-container">
      <div className="grid grid-cols-4 gap-2 bg-board rounded-xl p-3 border border-board w-full h-full">
        {state.board.map((value, index) => (
          <GameCell key={index} value={value} />
        ))}
      </div>
    </div>
  )
}
