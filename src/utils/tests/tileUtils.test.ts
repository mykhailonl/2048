import type { Tile } from '../../types/TileTypes.ts'
import { findTileAt, getEmptyPositions } from '../tileUtils'

// Helper function to create tiles for testing
const createTile = (x: number, y: number, value: number): Tile => ({
  id: `test-tile-${x}-${y}`,
  value,
  x,
  y,
})

describe('findTileAt', () => {
  const testTiles: Tile[] = [
    createTile(0, 0, 2),
    createTile(1, 0, 4),
    createTile(0, 1, 8),
    createTile(3, 3, 2048),
  ]

  it('should find tile at existing coordinates', () => {
    const result = findTileAt(testTiles, 0, 0)
    expect(result).toEqual(createTile(0, 0, 2))
  })

  it('should return undefined for empty position', () => {
    const result = findTileAt(testTiles, 2, 2)
    expect(result).toBeUndefined()
  })

  it('should return undefined for coordinates outside bounds', () => {
    expect(findTileAt(testTiles, -1, 0)).toBeUndefined()
    expect(findTileAt(testTiles, 0, -1)).toBeUndefined()
    expect(findTileAt(testTiles, 4, 0)).toBeUndefined()
    expect(findTileAt(testTiles, 0, 4)).toBeUndefined()
  })

  it('should work with empty tiles array', () => {
    const result = findTileAt([], 0, 0)
    expect(result).toBeUndefined()
  })

  it('should find correct tile when multiple tiles exist', () => {
    const result = findTileAt(testTiles, 3, 3)
    expect(result).toEqual(createTile(3, 3, 2048))
  })
})

describe('getEmptyPositions', () => {
  it('should return all 16 positions for empty board', () => {
    const result = getEmptyPositions([])

    expect(result).toHaveLength(16)
    expect(result).toContainEqual({ x: 0, y: 0 })
    expect(result).toContainEqual({ x: 3, y: 3 })
  })

  it('should return empty array for full board', () => {
    const fullBoard: Tile[] = []
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        fullBoard.push(createTile(x, y, 2))
      }
    }

    const result = getEmptyPositions(fullBoard)
    expect(result).toHaveLength(0)
  })

  it('should exclude occupied positions', () => {
    const tiles = [
      createTile(0, 0, 2),
      createTile(1, 1, 4),
      createTile(3, 3, 8),
    ]

    const result = getEmptyPositions(tiles)

    expect(result).toHaveLength(13) // 16 - 3 = 13
    expect(result).not.toContainEqual({ x: 0, y: 0 })
    expect(result).not.toContainEqual({ x: 1, y: 1 })
    expect(result).not.toContainEqual({ x: 3, y: 3 })
    expect(result).toContainEqual({ x: 0, y: 1 })
    expect(result).toContainEqual({ x: 2, y: 2 })
  })

  it('should handle single tile on board', () => {
    const tiles = [createTile(2, 2, 4)]
    const result = getEmptyPositions(tiles)

    expect(result).toHaveLength(15)
    expect(result).not.toContainEqual({ x: 2, y: 2 })
  })

  it('should handle board with one empty position', () => {
    const almostFullBoard: Tile[] = []
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (!(x === 1 && y === 1)) {
          // Skip position (1,1)
          almostFullBoard.push(createTile(x, y, 2))
        }
      }
    }

    const result = getEmptyPositions(almostFullBoard)
    expect(result).toHaveLength(1)
    expect(result).toContainEqual({ x: 1, y: 1 })
  })

  it('should return positions with correct structure', () => {
    const tiles = [createTile(0, 0, 2)]
    const result = getEmptyPositions(tiles)

    result.forEach(position => {
      expect(position).toHaveProperty('x')
      expect(position).toHaveProperty('y')
      expect(typeof position.x).toBe('number')
      expect(typeof position.y).toBe('number')
      expect(position.x).toBeGreaterThanOrEqual(0)
      expect(position.x).toBeLessThanOrEqual(3)
      expect(position.y).toBeGreaterThanOrEqual(0)
      expect(position.y).toBeLessThanOrEqual(3)
    })
  })
})
