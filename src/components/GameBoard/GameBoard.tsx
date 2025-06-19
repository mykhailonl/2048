import { GameCell } from '../GameCell'

export const GameBoard = () => {
  const board = [
    2,
    32,
    128,
    4,
    256,
    512,
    8,
    1024,
    2048,
    16,
    null,
    null,
    null,
    64,
    null,
    null,
  ]

  return (
    <div className="game-board-container">
      <div className="grid grid-cols-4 gap-2 bg-board rounded-xl p-3 border border-board w-full h-full">
        {board.map((value, index) => (
          <GameCell key={index} value={value} />
        ))}
      </div>
    </div>
  )
}
