import type { Tile } from '../../types/TileTypes.ts'
import { moveTilesInLine } from '../moveUtils'

// Helper function to create a simple horizontal line of tiles for left movement testing
const createHorizontalTiles = (values: number[]): Tile[] => {
  return values.map((value, index) => ({
    id: `test-tile-${index}`,
    value,
    x: index,
    y: 0, // All in row 0
  }))
}

// Helper function to extract values in order for easy comparison
const extractOrderedValues = (tiles: Tile[]): number[] => {
  return [...tiles].sort((a, b) => a.x - b.x).map(t => t.value)
}

// Testing the core left movement logic through moveTilesInLine
describe('left movement logic (via moveTilesInLine)', () => {
  const direction = 'left'
  const fixedCoordinate = 0 // row 0

  it('should merge two identical numbers', () => {
    const input = createHorizontalTiles([2, 2])
    const { tiles, earnedScore } = moveTilesInLine(
      input,
      direction,
      fixedCoordinate
    )

    const values = extractOrderedValues(tiles)
    expect(values).toEqual([4])
    expect(earnedScore).toBe(4)
  })

  it('should handle no merges', () => {
    const input = createHorizontalTiles([2, 4, 8, 16])
    const { tiles, earnedScore } = moveTilesInLine(
      input,
      direction,
      fixedCoordinate
    )

    const values = extractOrderedValues(tiles)
    expect(values).toEqual([2, 4, 8, 16])
    expect(earnedScore).toBe(0)
  })

  it('should handle empty line', () => {
    const input: Tile[] = []
    const { tiles, earnedScore } = moveTilesInLine(
      input,
      direction,
      fixedCoordinate
    )

    expect(tiles).toEqual([])
    expect(earnedScore).toBe(0)
  })

  it('should merge multiple pairs', () => {
    const input = createHorizontalTiles([4, 4, 8, 8])
    const { tiles, earnedScore } = moveTilesInLine(
      input,
      direction,
      fixedCoordinate
    )

    const values = extractOrderedValues(tiles)
    expect(values).toEqual([8, 16])
    expect(earnedScore).toBe(24) // 8 + 16 = 24
  })

  it('should handle gaps in input (tiles already compacted)', () => {
    // Since moveTilesInLine expects already sorted tiles without gaps,
    // this tests the core merging logic
    const input = createHorizontalTiles([2, 2, 4])
    const { tiles, earnedScore } = moveTilesInLine(
      input,
      direction,
      fixedCoordinate
    )

    const values = extractOrderedValues(tiles)
    expect(values).toEqual([4, 4])
    expect(earnedScore).toBe(4)
  })

  it('should handle single tile', () => {
    const input = createHorizontalTiles([8])
    const { tiles, earnedScore } = moveTilesInLine(
      input,
      direction,
      fixedCoordinate
    )

    const values = extractOrderedValues(tiles)
    expect(values).toEqual([8])
    expect(earnedScore).toBe(0)
  })

  it('should prevent triple merges', () => {
    // [4, 4, 4] should become [8, 4], not [12]
    const input = createHorizontalTiles([4, 4, 4])
    const { tiles, earnedScore } = moveTilesInLine(
      input,
      direction,
      fixedCoordinate
    )

    const values = extractOrderedValues(tiles)
    expect(values).toEqual([8, 4])
    expect(earnedScore).toBe(8)
  })

  it('should handle complex merge patterns', () => {
    // [2, 2, 4, 4, 8] should become [4, 8, 8]
    const input = createHorizontalTiles([2, 2, 4, 4, 8])
    const { tiles, earnedScore } = moveTilesInLine(
      input,
      direction,
      fixedCoordinate
    )

    const values = extractOrderedValues(tiles)
    expect(values).toEqual([4, 8, 8])
    expect(earnedScore).toBe(12) // 4 + 8 = 12
  })

  it('should maintain proper positioning after merge', () => {
    const input = createHorizontalTiles([2, 2])
    const { tiles } = moveTilesInLine(input, direction, fixedCoordinate)

    expect(tiles[0]).toEqual(
      expect.objectContaining({
        x: 0, // Should be positioned at leftmost
        y: 0,
        value: 4,
      })
    )
  })

  it('should generate new IDs for merged tiles', () => {
    const input = createHorizontalTiles([2, 2])
    const originalIds = input.map(t => t.id)

    const { tiles } = moveTilesInLine(input, direction, fixedCoordinate)

    expect(tiles.length).toBe(1)
    expect(originalIds).not.toContain(tiles[0].id)
  })
})
