import { GameBoard } from './components/GameBoard'
import { useGameContext } from './hooks/useGameContext.ts'
import { useGameControls } from './hooks/useGameControls.ts'

function App() {
  const { newGame, restartGame } = useGameControls()
  const { state } = useGameContext()

  return (
    <div className="min-h-screen bg-game flex flex-col items-center justify-center p-4 min-w-fit overflow-x-auto">
      <header className="mb-6 text-center flex-shrink-0">
        <h1 className="text-6xl font-bold text-gray-700 mb-2">2048</h1>
        <p className="text-gray-600">Join the tiles, get to 2048!</p>
        <h1>Score: {state.score}</h1>
      </header>
      <main className="flex-shrink-0">
        <GameBoard />
      </main>
    </div>
  )
}

export default App
