import cn from 'classnames'

import { useGameActions } from '../../hooks/useGameActions.ts'
import { useGameContext } from '../../hooks/useGameContext.ts'
import { UndoIcon } from '../../icons/UndoIcon.tsx'

export const UndoButton = () => {
  const { undo } = useGameActions()
  const { state } = useGameContext()

  const isDisabled = !state.undoCharges

  return (
    <button
      onClick={undo}
      className={cn(
        'p-2 rounded-lg text-color shadow-md flex items-center justify-center whitespace-nowrap',
        isDisabled ? 'bg-[#DBD5C5]' : 'bg-[#BBAB9A]'
      )}
      disabled={isDisabled}
      aria-label={`Undo last move, ${state.undoCharges} charges remaining`}
    >
      <UndoIcon size={32} />
    </button>
  )
}
