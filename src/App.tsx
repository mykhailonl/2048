import { GameBoard } from './components/GameBoard'

function App() {
  return (
    <div className="min-h-screen bg-game flex flex-col items-center justify-center p-4 min-w-fit overflow-x-auto">
      <header className="mb-6 text-center flex-shrink-0">
        <h1 className="text-6xl font-bold text-gray-700 mb-2">2048</h1>
        <p className="text-gray-600">Join the tiles, get to 2048!</p>
      </header>
      <main className="flex-shrink-0">
        <GameBoard />
      </main>
    </div>
  )
}

export default App
