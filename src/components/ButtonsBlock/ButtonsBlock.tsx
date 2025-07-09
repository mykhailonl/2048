import { useGameContext } from '../../hooks/useGameContext.ts'
import { useSettings } from '../../hooks/useSettings.ts'
import { SettingsButton } from '../SettingsButton'
import { Tooltip } from '../Tooltip'
import { UndoButton } from '../UndoButton'

export const ButtonsBlock = () => {
  const { state } = useGameContext()
  const { reduceMotion } = useSettings()

  return (
    <div className="w-[240px] bg-[#E9E7D9] flex items-center justify-center p-3 rounded-xl gap-4">
      <Tooltip
        tooltip={{
          elementName: 'Undo',
          usesLeft: state.undoCharges,
          description: 'Make a 128 tile to get more charges',
        }}
      >
        <UndoButton />
      </Tooltip>

      <Tooltip
        tooltip={{
          elementName: 'Animations',
          status: reduceMotion ? 'disabled' : 'enabled',
          description: reduceMotion
            ? 'Click to enable animations'
            : 'Click to disable animations',
        }}
      >
        <SettingsButton />
      </Tooltip>
    </div>
  )
}
