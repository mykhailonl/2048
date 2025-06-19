import cn from 'classnames'
import { useMemo } from 'react'

import { getTileStyle } from '../../utils/tileStyles.ts'

type GameCellProps = {
  value: number | null
}

export const GameCell = ({ value }: GameCellProps) => {
  const tileStyle = useMemo(() => getTileStyle(value), [value])

  return (
    <div className={cn(tileStyle, 'aspect-square rounded-lg font-bold')}>
      <div className="w-full h-full flex items-center justify-center">
        {value}
      </div>
    </div>
  )
}
