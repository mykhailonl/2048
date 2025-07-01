import { GameBoard } from './components/GameBoard'
import { GameScore } from './components/GameScore'
import { useGameControls } from './hooks/useGameControls.ts'

function App() {
  const { newGame, restartGame } = useGameControls()

  return (
    <div className="min-h-screen bg-game flex flex-col items-center justify-center p-4 min-w-fit overflow-x-auto">
      <header className="absolute inset-x-0 top-0 flex p-6 justify-between">
        <h1 className="text-6xl font-bold text-gray-700 mb-2">2048</h1>

        <GameScore />
      </header>

      <main className="flex-shrink-0">
        <GameBoard />
      </main>
    </div>
  )
}

export default App
