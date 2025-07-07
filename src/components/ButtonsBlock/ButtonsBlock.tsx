import { useGameContext } from '../../hooks/useGameContext.ts'
import { Tooltip } from '../Tooltip'
import { UndoButton } from '../UndoButton'

export const ButtonsBlock = () => {
  const { state } = useGameContext()

  return (
    <div className="w-[240px] bg-[#E9E7D9] flex items-center justify-center p-3 rounded-xl">
      <Tooltip
        tooltip={{
          elementName: 'Undo',
          usesLeft: state.undoCharges,
          description: 'Make a 128 tile to get more charges',
        }}
      >
        <UndoButton />
      </Tooltip>
    </div>
  )
}
