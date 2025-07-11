import cn from 'classnames'
import { motion } from 'framer-motion'
import React from 'react'

import { useSettings } from '../../hooks/useSettings.ts'
import type { Tile } from '../../types/TileTypes.ts'
import { getTileStyle } from '../../utils/tileStyles.ts'

type GameCellProps = {
  tile: Tile
}

export const GameCell = React.memo(({ tile }: GameCellProps) => {
  const { reduceMotion } = useSettings()

  return (
    <motion.div
      layoutId={tile.id}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className={cn(
        getTileStyle(tile),
        'aspect-square rounded-lg font-bold shadow-xl'
      )}
      transition={
        reduceMotion
          ? { duration: 0.01 }
          : {
              type: 'spring',
              damping: 50,
              stiffness: 800,
              restDelta: 0.5,
            }
      }
    >
      <div className="w-full h-full flex items-center justify-center">
        {tile.value}
      </div>
    </motion.div>
  )
})

GameCell.displayName = 'GameCell'
