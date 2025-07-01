import { GameBoard } from './components/GameBoard'
import { GameScore } from './components/GameScore'
import { NewGameButton } from './components/NewGameButton'
import { useKeyboardControls } from './hooks/useKeyboardControls.ts'

function App() {
  useKeyboardControls()

  return (
    <div className="min-h-screen bg-game flex flex-col items-center justify-center p-4 min-w-fit overflow-x-auto">
      <header className="absolute inset-x-0 top-0 flex p-6 justify-between items-center flex-col gap-2 md:flex-row">
        <h1 className="text-4xl font-bold text-gray-700 md:text-6xl">2048</h1>

        <GameScore />

        <NewGameButton />
      </header>

      <main className="flex-shrink-0">
        <GameBoard />
      </main>

      <div className="text-center absolute bottom-15 inset-x-1/4">
        <p className="text-[#988876] text-sm font-medium max-w-lg mx-auto leading-relaxed">
          🎯 Use arrow keys to move tiles • Merge same numbers • Reach 2048 to
          win!
        </p>
      </div>
    </div>
  )
}

export default App
