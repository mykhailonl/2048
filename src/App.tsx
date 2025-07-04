import { useEffect } from 'react'

import { GameBoard } from './components/GameBoard'
import { GameFooter } from './components/GameFooter'
import { GameScore } from './components/GameScore'
import { ModalContainer } from './components/ModalContainer'
import { NewGameButton } from './components/NewGameButton'
import { useGameContext } from './hooks/useGameContext.ts'
import { useKeyboardControls } from './hooks/useKeyboardControls.ts'
import { useModal } from './hooks/useModal.ts'

function App() {
  useKeyboardControls()

  const { state } = useGameContext()
  const { openModal } = useModal()

  useEffect(() => {
    if (state.status === 'win') {
      openModal('win')
    } else if (state.status === 'lose') {
      openModal('lose')
    }
  }, [state.status, openModal])

  return (
    <>
      <ModalContainer />

      <div className="min-h-screen bg-game flex flex-col items-center justify-center p-4 min-w-fit overflow-x-auto">
        <header className="absolute inset-x-0 top-0 flex p-6 justify-between items-center flex-col gap-2 md:flex-row">
          <h1 className="text-4xl font-bold text-gray-700 md:text-6xl">2048</h1>

          <GameScore />

          <NewGameButton />
        </header>

        <main className="flex-shrink-0">
          <GameBoard />
        </main>

        <GameFooter />
      </div>
    </>
  )
}

export default App
