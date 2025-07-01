import type { Tile } from '../types/TileTypes.ts'

/**
 * Find tile at specific coordinates
 * @param tiles - array of all tiles
 * @param x - horizontal coordinate (0-3)
 * @param y - vertical coordinate (0-3)
 * @returns tile at this position or undefined if empty
 */
export const findTileAt = (
  tiles: Tile[],
  x: number,
  y: number
): Tile | undefined => {
  return tiles.find(tile => tile.x === x && tile.y === y)
}

/**
 * Get all tiles in a column, sorted top to bottom
 * @param tiles - array of all tiles
 * @param x - column number (0-3)
 * @returns array of tiles in this column
 */
export const getTilesInColumn = (tiles: Tile[], x: number): Tile[] => {
  return tiles.filter(tile => tile.x === x).sort((a, b) => a.y - b.y)
}

/**
 * Get all tiles in a row, sorted left to right
 * @param tiles - array of all tiles
 * @param y - row number (0-3)
 * @returns array of tiles in this row
 */
export const getTilesInRow = (tiles: Tile[], y: number): Tile[] => {
  return tiles.filter(tile => tile.y === y).sort((a, b) => a.x - b.x)
}

/**
 * Find all empty positions on the board
 * @param tiles - array of all tiles
 * @returns array of available coordinates {x, y}
 */
export const getEmptyPositions = (
  tiles: Tile[]
): Array<{ x: number; y: number }> => {
  const occupied = new Set(tiles.map(tile => `${tile.x},${tile.y}`))

  const empty = []
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (!occupied.has(`${x},${y}`)) {
        empty.push({ x, y })
      }
    }
  }

  return empty
}

/**
 * Generate unique ID for new tile
 * @returns string identifier using built-in crypto.randomUUID()
 * to avoid extra dependencies like uuid
 */
export const generateTileId = (): string => {
  return crypto.randomUUID()
}
