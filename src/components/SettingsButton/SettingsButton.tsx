import cn from 'classnames'

import { useSettings } from '../../hooks/useSettings.ts'
import { SettingsIcon } from '../../icons/SettingsIcon.tsx'

export const SettingsButton = () => {
  const { reduceMotion, setReduceMotion } = useSettings()

  return (
    <button
      onClick={() => setReduceMotion(!reduceMotion)}
      className={cn(
        'p-2 rounded-lg text-color shadow-md flex items-center justify-center',
        !reduceMotion ? 'bg-[#DBD5C5]' : 'bg-[#BBAB9A]'
      )}
      aria-label="Settings button"
    >
      <SettingsIcon size={32} />
    </button>
  )
}
