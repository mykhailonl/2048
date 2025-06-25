import type {
  GameBoard,
  GameState,
  GameStatus,
} from '../contexts/GameContext.tsx'
import type { ColIndex, Direction, RowIndex } from '../types/BoardTypes.ts'

import { coordsToIndex, getColumn, getRow } from './boardUtils.ts'
import { moveLineInDirection } from './moveUtils.ts'

/**
 * Moves entire game board in specified direction
 *
 * Algorithm:
 * 1. For horizontal moves: processes each row using moveLineInDirection
 * 2. For vertical moves: processes each column using moveLineInDirection
 * 3. Accumulates earned score from all processed lines
 * 4. Returns transformed board with total earned score
 *
 * @param board - 16-element game board array
 * @param direction - Move direction ('left' | 'right' | 'up' | 'down')
 * @returns Object with new board state and total earned score from the move
 *
 * @example
 * // Board with mergeable tiles in multiple rows
 * moveBoardInDirection(board, 'left') => { board: newBoard, earnedScore: 24 }
 */
export const moveBoardInDirection = (
  board: GameBoard,
  direction: Direction
): { board: GameBoard; earnedScore: number } => {
  const newBoard = [...board]
  let totalEarnedScore = 0

  if (direction === 'left' || direction === 'right') {
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      const targetRow = getRow(board, rowIndex as RowIndex)
      const { row: rowResult, earnedScore } = moveLineInDirection(
        targetRow,
        direction
      )

      totalEarnedScore += earnedScore

      rowResult.forEach((value, colIndex) => {
        const index = coordsToIndex(colIndex as ColIndex, rowIndex as RowIndex)
        if (index !== null) newBoard[index] = value
      })
    }
  }

  if (direction === 'up' || direction === 'down') {
    for (let colIndex = 0; colIndex < 4; colIndex++) {
      const targetCol = getColumn(board, colIndex as ColIndex)
      const { row: colResult, earnedScore } = moveLineInDirection(
        targetCol,
        direction
      )

      totalEarnedScore += earnedScore

      colResult.forEach((value, rowIndex) => {
        const index = coordsToIndex(colIndex as ColIndex, rowIndex as RowIndex)
        if (index !== null) newBoard[index] = value
      })
    }
  }

  return { board: newBoard, earnedScore: totalEarnedScore }
}

export const boardsEqual = (board1: GameBoard, board2: GameBoard): boolean => {
  return board1.every((cell, index) => cell === board2[index])
}

/**
 * Checks if the player has any available moves on the current board
 *
 * Algorithm:
 * 1. If there are empty cells (null), moves are available
 * 2. If no empty cells, simulates moves in all 4 directions
 * 3. Compares original board with result of each simulated move
 * 4. Returns true if any direction produces a different board
 *
 * @param board - 16-element game board array to check
 * @returns Boolean indicating whether any moves are possible
 *
 * @example
 * hasAvailableMoves([2,4,8,16, null,2,4,8, ...]) => true  // has empty cell
 * hasAvailableMoves([2,4,2,4, 4,2,4,2, ...])     => true  // can merge 2+2
 * hasAvailableMoves([2,4,8,16, 4,8,16,32, ...])  => false // no moves possible
 */
export const hasAvailableMoves = (board: GameBoard): boolean => {
  if (board.some(cell => cell === null)) return true

  const directions: Direction[] = ['down', 'up', 'right', 'left']

  return directions.some(direction => {
    const { board: newBoard } = moveBoardInDirection(board, direction)

    return !boardsEqual(board, newBoard)
  })
}

export const checkWinCondition = (board: GameBoard): boolean => {
  return board.some(cell => cell === 2048)
}

export const checkLoseCondition = (board: GameBoard): boolean => {
  return !hasAvailableMoves(board)
}

export const getStatus = (board: GameBoard): GameStatus => {
  if (checkWinCondition(board)) return 'win'

  if (checkLoseCondition(board)) return 'lose'

  return 'playing'
}

/**
 * @returns {number} 2 or 4, 4 has 10% chance to be generated
 */
export const generateNewTile = (): number => {
  return Math.random() < 0.9 ? 2 : 4
}

export const addNewTile = (board: GameBoard) => {
  const emptyIndices = board
    .map((cell, index) => (cell === null ? index : null))
    .filter(index => index !== null) as number[]

  if (emptyIndices.length === 0) {
    return board
  }

  const randomIndex =
    emptyIndices[Math.floor(Math.random() * emptyIndices.length)]

  const newBoard = [...board]

  newBoard[randomIndex] = generateNewTile()

  return newBoard
}

export const initializeGame = (): GameState => {
  let board: GameBoard = Array(16).fill(null)

  board = addNewTile(board)
  board = addNewTile(board)

  return {
    board,
    score: 0,
    status: 'playing',
  }
}
