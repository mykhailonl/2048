import type { Direction, Tile } from '../../types/TileTypes.ts'
import {
  addNewTile,
  tilesEqual,
  checkLoseCondition,
  checkWinCondition,
  getStatus,
  hasAvailableMoves,
  initializeGame,
  moveTilesInDirection,
} from '../gameLogic'

// Helper function to create tiles from simple array representation
const createTiles = (
  positions: Array<{ x: number; y: number; value: number }>
): Tile[] => {
  return positions.map((pos, index) => ({
    id: `test-tile-${index}`,
    value: pos.value,
    x: pos.x,
    y: pos.y,
  }))
}

// Helper function to create board-like representation for easy testing
const createBoardTiles = (boardArray: (number | null)[]): Tile[] => {
  const tiles: Tile[] = []
  boardArray.forEach((value, index) => {
    if (value !== null) {
      tiles.push({
        id: `tile-${index}`,
        value,
        x: index % 4,
        y: Math.floor(index / 4),
      })
    }
  })
  return tiles
}

const emptyTiles: Tile[] = []
const winTiles: Tile[] = createBoardTiles([
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  2048,
])
const fullTiles: Tile[] = createBoardTiles([
  2,
  4,
  2,
  2, // first row
  2,
  4,
  2,
  2, // second row
  2,
  4,
  2,
  2, // third row
  2,
  4,
  2,
  2, // fourth row
])
const noMovesTiles = createBoardTiles([
  2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2, 4, 8, 16, 32, 64,
])
const noMovesWinTiles = createBoardTiles([
  2, 4, 8, 16, 32, 64, 128, 2048, 512, 1024, 2, 4, 8, 16, 32, 64,
])

describe('tilesEqual', () => {
  it('should return true for identical tile arrays', () => {
    const tilesCopy = JSON.parse(JSON.stringify(fullTiles))
    expect(tilesEqual(tilesCopy, fullTiles)).toBeTruthy()
  })

  it('should return false for different tile arrays', () => {
    expect(tilesEqual(fullTiles, noMovesTiles)).toBeFalsy()
  })

  it('should handle empty tile arrays', () => {
    const testTiles: Tile[] = []
    expect(tilesEqual(emptyTiles, testTiles)).toBeTruthy()
  })

  it('should handle arrays with different lengths', () => {
    const shortTiles = fullTiles.slice(0, 2)
    expect(tilesEqual(fullTiles, shortTiles)).toBeFalsy()
  })
})

describe('checkWinCondition', () => {
  it('should return true when tiles contain 2048', () => {
    expect(checkWinCondition(winTiles)).toBeTruthy()
  })

  it('should return false when tiles do not contain 2048', () => {
    expect(checkWinCondition(fullTiles)).toBeFalsy()
  })

  it('should handle tiles with multiple 2048', () => {
    const multiWinTiles = createTiles([
      { x: 0, y: 0, value: 2048 },
      { x: 3, y: 3, value: 2048 },
    ])
    expect(checkWinCondition(multiWinTiles)).toBeTruthy()
  })

  it('should handle empty tiles', () => {
    expect(checkWinCondition(emptyTiles)).toBeFalsy()
  })
})

describe('checkLoseCondition', () => {
  it('should return true when no moves are available', () => {
    expect(checkLoseCondition(noMovesTiles)).toBeTruthy()
  })

  it('should return false when moves are available', () => {
    expect(checkLoseCondition(fullTiles)).toBeFalsy()
  })

  it('should handle empty tiles', () => {
    expect(checkLoseCondition(emptyTiles)).toBeFalsy()
  })
})

describe('getStatus', () => {
  it('should return "win" when win condition is met', () => {
    expect(getStatus(winTiles)).toBe('win')
  })

  it('should return "lose" when lose condition is met', () => {
    expect(getStatus(noMovesTiles)).toBe('lose')
  })

  it('should return "playing" when game continues', () => {
    expect(getStatus(fullTiles)).toBe('playing')
  })

  it('should prioritize win over lose when both conditions could apply', () => {
    expect(getStatus(noMovesWinTiles)).toBe('win')
  })
})

describe('hasAvailableMoves', () => {
  it('should return true when board has empty cells', () => {
    const spareTiles = createBoardTiles([
      2,
      null,
      null,
      null,
      ...Array(12).fill(2),
    ])
    expect(hasAvailableMoves(spareTiles)).toBeTruthy()
  })

  it('should handle full board with possible merges', () => {
    expect(hasAvailableMoves(fullTiles)).toBeTruthy()
  })

  it('should return false when no moves are available', () => {
    expect(hasAvailableMoves(noMovesTiles)).toBeFalsy()
  })

  it('should return true when merges are possible', () => {
    const mergableTiles = createBoardTiles([
      ...Array(4).fill(null),
      ...Array(8).fill(2),
      ...Array(4).fill(8),
    ])
    expect(hasAvailableMoves(mergableTiles)).toBeTruthy()
  })
})

describe('addNewTile', () => {
  it('should add tile to empty position', () => {
    const spareTiles = createBoardTiles([null, ...Array(15).fill(256)])
    const result = addNewTile(spareTiles)

    expect(result.length).toBe(spareTiles.length + 1)
    const newTile = result.find(tile => tile.x === 0 && tile.y === 0)
    expect(newTile).toBeDefined()
    expect([2, 4]).toContain(newTile!.value)
  })

  it('should not modify tiles when no empty cells', () => {
    const result = addNewTile(fullTiles)
    expect(result).toBe(fullTiles)
  })

  it('should not mutate original tiles array', () => {
    const originalTiles = createTiles([{ x: 0, y: 0, value: 2 }])
    const originalLength = originalTiles.length

    const result = addNewTile(originalTiles)

    expect(originalTiles.length).toBe(originalLength)
    expect(result).not.toBe(originalTiles)
  })

  it('should handle empty tiles array', () => {
    const result = addNewTile(emptyTiles)

    expect(result.length).toBe(1)
    expect([2, 4]).toContain(result[0].value)
  })
})

describe('initializeGame', () => {
  it('should return correct GameState structure', () => {
    const gameState = initializeGame()

    expect(gameState).toHaveProperty('tiles')
    expect(gameState).toHaveProperty('score')
    expect(gameState).toHaveProperty('status')
    expect(Array.isArray(gameState.tiles)).toBeTruthy()
  })

  it('should create tiles array with exactly 2 tiles', () => {
    const { tiles } = initializeGame()

    expect(tiles.length).toBe(2)
    tiles.forEach(tile => {
      expect([2, 4]).toContain(tile.value)
    })
  })

  it('should set initial score to 0', () => {
    const { score } = initializeGame()
    expect(score).toBe(0)
  })

  it('should set initial status to playing', () => {
    const { status } = initializeGame()
    expect(status).toBe('playing')
  })

  it('should place tiles in different positions', () => {
    const { tiles: tiles1 } = initializeGame()
    const { tiles: tiles2 } = initializeGame()

    const pos1 = tiles1.map(t => `${t.x},${t.y}`).sort()
    const pos2 = tiles2.map(t => `${t.x},${t.y}`).sort()

    // Different games should have different tile positions (most of the time)
    expect(pos1).not.toEqual(pos2)
  })
})

describe('moveTilesInDirection', () => {
  describe('when direction is left', () => {
    const direction: Direction = 'left'

    it('should move and merge tiles correctly', () => {
      const { tiles } = moveTilesInDirection(fullTiles, direction)

      // Check first row: [2,4,2,2] → [2,4,4,null]
      const firstRowTiles = tiles
        .filter(t => t.y === 0)
        .sort((a, b) => a.x - b.x)
      expect(firstRowTiles.length).toBe(3)
      expect(firstRowTiles[0]).toEqual(
        expect.objectContaining({ x: 0, y: 0, value: 2 })
      )
      expect(firstRowTiles[1]).toEqual(
        expect.objectContaining({ x: 1, y: 0, value: 4 })
      )
      expect(firstRowTiles[2]).toEqual(
        expect.objectContaining({ x: 2, y: 0, value: 4 })
      )
    })

    it('should calculate total score from multiple rows', () => {
      const { earnedScore } = moveTilesInDirection(fullTiles, direction)
      expect(earnedScore).toBe(16) // 4 rows, each with one merge of 2+2=4
    })

    it('should not mutate original tiles', () => {
      const originalLength = fullTiles.length
      const { tiles } = moveTilesInDirection(fullTiles, direction)

      expect(fullTiles.length).toBe(originalLength)
      expect(tiles).not.toBe(fullTiles)
    })
  })

  describe('when direction is right', () => {
    const direction: Direction = 'right'

    it('should move and merge tiles correctly', () => {
      const { tiles } = moveTilesInDirection(fullTiles, direction)

      // Check first row: [2,4,2,2] → [null,2,4,4]
      const firstRowTiles = tiles
        .filter(t => t.y === 0)
        .sort((a, b) => a.x - b.x)
      expect(firstRowTiles.length).toBe(3)
      expect(firstRowTiles[0]).toEqual(
        expect.objectContaining({ x: 1, y: 0, value: 2 })
      )
      expect(firstRowTiles[1]).toEqual(
        expect.objectContaining({ x: 2, y: 0, value: 4 })
      )
      expect(firstRowTiles[2]).toEqual(
        expect.objectContaining({ x: 3, y: 0, value: 4 })
      )
    })
  })

  describe('when direction is up', () => {
    const direction: Direction = 'up'

    it('should move and merge tiles correctly', () => {
      const { tiles, earnedScore } = moveTilesInDirection(fullTiles, direction)

      // Check first column: [2,2,2,2] → [4,4,null,null]
      const firstColTiles = tiles
        .filter(t => t.x === 0)
        .sort((a, b) => a.y - b.y)
      expect(firstColTiles.length).toBe(2)
      expect(firstColTiles[0]).toEqual(
        expect.objectContaining({ x: 0, y: 0, value: 4 })
      )
      expect(firstColTiles[1]).toEqual(
        expect.objectContaining({ x: 0, y: 1, value: 4 })
      )

      expect(earnedScore).toBe(40) // Each column: 2+2=4, 2+2=4 → 8 points per column × 4 columns = 32... wait let me recalculate
    })
  })

  describe('integration', () => {
    it('should handle empty tiles', () => {
      const { tiles } = moveTilesInDirection(emptyTiles, 'left')
      expect(tiles).toEqual([])
    })
  })
})
