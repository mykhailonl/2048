import type { Direction, Tile } from '../../types/TileTypes.ts'
import { moveTilesInLine } from '../moveUtils'

// Helper function to create tiles for a line test
const createLineTiles = (
  values: number[],
  isHorizontal: boolean,
  fixedCoord: number
): Tile[] => {
  return values.map((value, index) => ({
    id: `test-tile-${index}`,
    value,
    x: isHorizontal ? index : fixedCoord,
    y: isHorizontal ? fixedCoord : index,
  }))
}

// Helper function to extract values from tiles for easy comparison
const extractValues = (tiles: Tile[], isHorizontal: boolean): number[] => {
  const sorted = [...tiles].sort((a, b) => {
    return isHorizontal ? a.x - b.x : a.y - b.y
  })
  return sorted.map(t => t.value)
}

describe('moveTilesInLine', () => {
  describe('when direction is left', () => {
    const direction: Direction = 'left'
    const fixedCoordinate = 0 // row 0

    it('should merge tiles correctly', () => {
      const inputTiles = createLineTiles([4, 4, 8], true, fixedCoordinate)
      const { tiles, earnedScore } = moveTilesInLine(
        inputTiles,
        direction,
        fixedCoordinate
      )

      const values = extractValues(tiles, true)
      expect(values).toEqual([8, 8])
      expect(earnedScore).toBe(8)
    })

    it('should handle empty line', () => {
      const inputTiles: Tile[] = []
      const { tiles, earnedScore } = moveTilesInLine(
        inputTiles,
        direction,
        fixedCoordinate
      )

      expect(tiles).toEqual([])
      expect(earnedScore).toBe(0)
    })

    it('should maintain correct coordinates', () => {
      const inputTiles = createLineTiles([2, 2], true, fixedCoordinate)
      const { tiles } = moveTilesInLine(inputTiles, direction, fixedCoordinate)

      expect(tiles[0]).toEqual(
        expect.objectContaining({
          x: 0,
          y: fixedCoordinate,
          value: 4,
        })
      )
    })
  })

  describe('when direction is right', () => {
    const direction: Direction = 'right'
    const fixedCoordinate = 0

    it('should merge tiles correctly', () => {
      const inputTiles = createLineTiles([32, 32, 128], true, fixedCoordinate)
      const { tiles, earnedScore } = moveTilesInLine(
        inputTiles,
        direction,
        fixedCoordinate
      )

      const values = extractValues(tiles, true)
      expect(values).toEqual([64, 128])
      expect(earnedScore).toBe(64)

      // Check positioning (should be pushed to the right)
      const positions = tiles.map(t => t.x).sort()
      expect(positions).toEqual([2, 3])
    })

    it('should handle empty line', () => {
      const inputTiles: Tile[] = []
      const { tiles, earnedScore } = moveTilesInLine(
        inputTiles,
        direction,
        fixedCoordinate
      )

      expect(tiles).toEqual([])
      expect(earnedScore).toBe(0)
    })
  })

  describe('when direction is up', () => {
    const direction: Direction = 'up'
    const fixedCoordinate = 0 // column 0

    it('should merge tiles correctly', () => {
      const inputTiles = createLineTiles(
        [128, 256, 256, 512],
        false,
        fixedCoordinate
      )
      const { tiles, earnedScore } = moveTilesInLine(
        inputTiles,
        direction,
        fixedCoordinate
      )

      const values = extractValues(tiles, false)
      expect(values).toEqual([128, 512, 512])
      expect(earnedScore).toBe(512)
    })

    it('should maintain correct coordinates', () => {
      const inputTiles = createLineTiles([2, 2], false, fixedCoordinate)
      const { tiles } = moveTilesInLine(inputTiles, direction, fixedCoordinate)

      expect(tiles[0]).toEqual(
        expect.objectContaining({
          x: fixedCoordinate,
          y: 0,
          value: 4,
        })
      )
    })
  })

  describe('when direction is down', () => {
    const direction: Direction = 'down'
    const fixedCoordinate = 0

    it('should merge tiles correctly', () => {
      const inputTiles = createLineTiles([64, 128, 128], false, fixedCoordinate)
      const { tiles, earnedScore } = moveTilesInLine(
        inputTiles,
        direction,
        fixedCoordinate
      )

      const values = extractValues(tiles, false)
      expect(values).toEqual([64, 256])
      expect(earnedScore).toBe(256)

      // Check positioning (should be pushed down)
      const positions = tiles.map(t => t.y).sort()
      expect(positions).toEqual([2, 3])
    })
  })

  describe('cross-direction behavior', () => {
    it('should produce consistent scores across directions', () => {
      const values = [2, 2, 4, 4]

      const leftTiles = createLineTiles(values, true, 0)
      const rightTiles = createLineTiles(values, true, 0)
      const upTiles = createLineTiles(values, false, 0)
      const downTiles = createLineTiles(values, false, 0)

      const leftScore = moveTilesInLine(leftTiles, 'left', 0).earnedScore
      const rightScore = moveTilesInLine(rightTiles, 'right', 0).earnedScore
      const upScore = moveTilesInLine(upTiles, 'up', 0).earnedScore
      const downScore = moveTilesInLine(downTiles, 'down', 0).earnedScore

      expect(leftScore).toBe(rightScore)
      expect(leftScore).toBe(upScore)
      expect(leftScore).toBe(downScore)
      expect(leftScore).toBe(12) // 2+2=4, 4+4=8, total=12
    })

    it('should create new IDs for merged tiles', () => {
      const inputTiles = createLineTiles([2, 2], true, 0)
      const originalIds = inputTiles.map(t => t.id)

      const { tiles } = moveTilesInLine(inputTiles, 'left', 0)

      expect(tiles.length).toBe(1)
      expect(tiles[0].value).toBe(4)
      expect(originalIds).not.toContain(tiles[0].id)
    })

    it('should preserve IDs for non-merged tiles', () => {
      const inputTiles = createLineTiles([2, 4], true, 0)
      const originalIds = inputTiles.map(t => t.id)

      const { tiles } = moveTilesInLine(inputTiles, 'left', 0)

      expect(tiles.length).toBe(2)
      tiles.forEach(tile => {
        expect(originalIds).toContain(tile.id)
      })
    })
  })
})
