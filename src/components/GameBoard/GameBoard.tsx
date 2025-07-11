import { useMemo, useRef } from 'react'

import { useGameContext } from '../../hooks/useGameContext.ts'
import { useSwipeControls } from '../../hooks/useSwipeControls.ts'
import type { Tile } from '../../types/TileTypes.ts'
import { GameCell } from '../GameCell'

export const GameBoard = () => {
  const { state } = useGameContext()
  const boardRef = useRef<HTMLDivElement>(null)

  useSwipeControls(boardRef)

  const { tiles } = state

  const tilesMap = useMemo(() => {
    const map = new Map<string, Tile>()

    tiles.forEach(tile => {
      map.set(`${tile.x}-${tile.y}`, tile)
    })
    return map
  }, [tiles])

  return (
    <div
      ref={boardRef}
      className="relative game-board-container"
      aria-label="4x4 game grid"
    >
      <div className="grid grid-cols-4 gap-2 bg-board rounded-xl p-3 border border-board w-full h-full">
        {Array(16)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="bg-cell-empty aspect-square rounded-lg" />
          ))}
      </div>

      <div className="absolute inset-0 grid grid-cols-4 gap-2 p-3">
        {Array(16)
          .fill(null)
          .map((_, index) => {
            const x = index % 4
            const y = Math.floor(index / 4)
            const tile = tilesMap.get(`${x}-${y}`)

            return tile ? (
              <GameCell key={tile.id} tile={tile} />
            ) : (
              <div key={`empty-${index}`} className="aspect-square" />
            )
          })}
      </div>
    </div>
  )
}
