import type { GameState, GameStatus } from '../types/GameTypes.ts'
import type { Direction, MoveResult, Tile } from '../types/TileTypes.ts'

import { moveTilesInLine } from './moveUtils.ts'
import {
  findTileAt,
  generateTileId,
  getEmptyPositions,
  getTilesInColumn,
  getTilesInRow,
} from './tileUtils.ts'

export const moveTilesInDirection = (
  tiles: Tile[],
  direction: Direction
): MoveResult => {
  const newTiles: Tile[] = []
  let totalEarnedScore = 0
  let totalUndoes = 0

  if (direction === 'left' || direction === 'right') {
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      const rowTiles = getTilesInRow(tiles, rowIndex)
      const {
        tiles: rowResult,
        earnedScore,
        earnedUndoes,
      } = moveTilesInLine(rowTiles, direction, rowIndex)

      totalEarnedScore += earnedScore
      newTiles.push(...rowResult)
      totalUndoes += earnedUndoes
    }
  }

  if (direction === 'up' || direction === 'down') {
    for (let colIndex = 0; colIndex < 4; colIndex++) {
      const colTiles = getTilesInColumn(tiles, colIndex)
      const {
        tiles: colResult,
        earnedScore,
        earnedUndoes,
      } = moveTilesInLine(colTiles, direction, colIndex)

      totalEarnedScore += earnedScore
      newTiles.push(...colResult)
      totalUndoes += earnedUndoes
    }
  }

  return {
    tiles: newTiles,
    earnedScore: totalEarnedScore,
    earnedUndoes: totalUndoes,
  }
}

export const tilesEqual = (tiles1: Tile[], tiles2: Tile[]): boolean => {
  if (tiles1.length !== tiles2.length) return false

  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      const tile1 = findTileAt(tiles1, x, y)
      const tile2 = findTileAt(tiles2, x, y)

      if (tile1?.value !== tile2?.value) return false
    }
  }

  return true
}

export const hasAvailableMoves = (tiles: Tile[]): boolean => {
  const emptyPositions = getEmptyPositions(tiles)

  if (emptyPositions.length > 0) return true

  for (const tile of tiles) {
    const rightNeighbor = findTileAt(tiles, tile.x + 1, tile.y)

    if (rightNeighbor && rightNeighbor.value === tile.value) return true

    const bottomNeighbor = findTileAt(tiles, tile.x, tile.y + 1)

    if (bottomNeighbor && bottomNeighbor.value === tile.value) return true
  }

  return false
}

export const checkWinCondition = (tiles: Tile[]): boolean => {
  return tiles.some(tile => tile.value === 2048)
}

export const checkLoseCondition = (tiles: Tile[]): boolean => {
  return !hasAvailableMoves(tiles)
}

export const getStatus = (tiles: Tile[]): GameStatus => {
  if (checkWinCondition(tiles)) return 'win'

  if (checkLoseCondition(tiles)) return 'lose'

  return 'playing'
}

/**
 * @returns {number} 2 or 4, 4 has 10% chance to be generated
 */
export const generateNewTile = (): number => {
  return Math.random() < 0.9 ? 2 : 4
}

export const addNewTile = (tiles: Tile[]): Tile[] => {
  const emptyPositions = getEmptyPositions(tiles)

  if (emptyPositions.length === 0) {
    return tiles
  }

  const randomPosition =
    emptyPositions[Math.floor(Math.random() * emptyPositions.length)]

  return [
    ...tiles,
    {
      id: generateTileId(),
      value: generateNewTile(),
      x: randomPosition.x,
      y: randomPosition.y,
    },
  ]
}

export const initializeGame = (): GameState => {
  const saved = localStorage.getItem('2048-game-state')

  if (saved) {
    try {
      const parsedObj = JSON.parse(saved)

      return {
        tiles: parsedObj.tiles,
        score: parsedObj.score,
        status: parsedObj.status,
        commandQueue: [],
        isProcessingCommand: false,
        undoCharges: parsedObj.undoCharges,
        stateHistory: parsedObj.stateHistory,
      }
    } catch (error) {
      console.warn('Failed to parse saved game state:', error)

      localStorage.removeItem('2048-game-state')
    }
  }

  let tiles: Tile[] = []

  tiles = addNewTile(tiles)
  tiles = addNewTile(tiles)

  return {
    tiles,
    score: 0,
    status: 'playing',
    commandQueue: [],
    isProcessingCommand: false,
    undoCharges: 0,
    stateHistory: [],
  }
}
