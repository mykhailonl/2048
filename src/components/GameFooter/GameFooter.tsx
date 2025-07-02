import { ButtonsBlock } from '../ButtonsBlock'
import { GameInstructions } from '../GameInstructions'

export const GameFooter = () => {
  return (
    <footer className="absolute bottom-10 flex flex-col items-center gap-5 p-6">
      <ButtonsBlock />

      <GameInstructions />
    </footer>
  )
}
