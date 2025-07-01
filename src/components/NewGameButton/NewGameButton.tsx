import { useGameActions } from '../../hooks/useGameActions.ts'

export const NewGameButton = () => {
  const { newGame } = useGameActions()

  return (
    <button
      onClick={newGame}
      className="px-4 h-10 bg-board rounded-lg text-color shadow-md mt-2 md:mt-0 flex items-center justify-center md:min-w-[110px] whitespace-nowrap"
    >
      New Game
    </button>
  )
}
