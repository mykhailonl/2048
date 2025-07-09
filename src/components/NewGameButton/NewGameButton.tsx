import { useModal } from '../../hooks/useModal.ts'

export const NewGameButton = () => {
  const { openModal } = useModal()

  const handleClick = () => {
    openModal('confirmNewGame')
  }

  return (
    <button
      onClick={handleClick}
      className="px-4 h-10 bg-board rounded-lg text-color shadow-md mt-2 md:mt-0 flex items-center justify-center md:min-w-[110px] whitespace-nowrap"
      aria-label="Start new game, current progress will be lost"
    >
      New Game
    </button>
  )
}
