import type { Direction, MoveResult, Tile } from '../types/TileTypes'

import { generateTileId } from './tileUtils'

/**
 * Performs a left move for a single row/column of tiles in 2048 game
 *
 * Algorithm:
 * 1. Processes tiles in order (already sorted, no nulls)
 * 2. Merges identical adjacent tiles (2+2=4)
 * 3. Each tile can participate in only one merge per move
 * 4. Creates new tiles with new IDs for merges
 * 5. Updates coordinates for moved/merged tiles
 * 6. Calculates score from merged tiles
 *
 * @param lineTiles - Array of tiles in a line (row or column)
 * @param fixedCoordinate - The coordinate that stays the same (y for horizontal, x for vertical)
 * @param isHorizontal - Whether this is a horizontal movement (affects x coordinate)
 * @returns Object with transformed tiles and earned score
 */
const moveTilesLeft = (
  lineTiles: Tile[],
  fixedCoordinate: number,
  isHorizontal: boolean
): MoveResult => {
  const resultTiles: Tile[] = []
  let earnedScore = 0
  let currentPosition = 0
  let earnedUndoes = 0
  let i = 0

  while (i < lineTiles.length) {
    const currentTile = lineTiles[i]

    if (
      i + 1 < lineTiles.length &&
      lineTiles[i + 1].value === currentTile.value
    ) {
      const mergedValue = currentTile.value * 2
      earnedScore += mergedValue

      if (mergedValue === 128) earnedUndoes++

      const newTile: Tile = {
        id: generateTileId(),
        value: mergedValue,
        x: isHorizontal ? currentPosition : fixedCoordinate,
        y: isHorizontal ? fixedCoordinate : currentPosition,
      }

      resultTiles.push(newTile)
      i += 2
    } else {
      const movedTile: Tile = {
        ...currentTile,
        x: isHorizontal ? currentPosition : fixedCoordinate,
        y: isHorizontal ? fixedCoordinate : currentPosition,
      }

      resultTiles.push(movedTile)
      i += 1
    }

    currentPosition += 1
  }

  return { tiles: resultTiles, earnedScore, earnedUndoes }
}

/**
 * Universal move function for any direction
 *
 * Uses moveTilesLeft as base logic, applying transformations:
 * - left/up: processes tiles as is
 * - right/down: reverses tiles order, applies moveTilesLeft, adjusts coordinates back
 *
 * @param lineTiles - Array of tiles to process
 * @param direction - Move direction ('left' | 'right' | 'up' | 'down')
 * @param fixedCoordinate - The coordinate that stays the same during movement
 * @returns Object with result tiles and earned score
 */
export const moveTilesInLine = (
  lineTiles: Tile[],
  direction: Direction,
  fixedCoordinate: number
): MoveResult => {
  switch (direction) {
    case 'left': {
      return moveTilesLeft(lineTiles, fixedCoordinate, true)
    }

    case 'right': {
      const reversed = [...lineTiles].reverse()
      const result = moveTilesLeft(reversed, fixedCoordinate, true)

      return {
        tiles: result.tiles.map(tile => ({
          ...tile,
          x: 3 - tile.x,
        })),
        earnedScore: result.earnedScore,
        earnedUndoes: result.earnedUndoes,
      }
    }

    case 'up': {
      return moveTilesLeft(lineTiles, fixedCoordinate, false)
    }

    case 'down': {
      const reversed = [...lineTiles].reverse()
      const result = moveTilesLeft(reversed, fixedCoordinate, false)

      return {
        tiles: result.tiles.map(tile => ({
          ...tile,
          y: 3 - tile.y,
        })),
        earnedScore: result.earnedScore,
        earnedUndoes: result.earnedUndoes,
      }
    }

    default:
      return { tiles: lineTiles, earnedScore: 0, earnedUndoes: 0 }
  }
}
