import type { GameBoard } from '../../contexts/GameContext.tsx'
import type { Direction } from '../../types/BoardTypes.ts'
import {
  addNewTile,
  boardsEqual,
  checkLoseCondition,
  checkWinCondition,
  getStatus,
  hasAvailableMoves,
  initializeGame,
  moveBoardInDirection,
} from '../gameLogic'

const emptyBoard: GameBoard = Array(16).fill(null)
const winBoard: GameBoard = [
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
]
const fullBoard: GameBoard = [
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
]
const noMovesFullBoard = [
  2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2, 4, 8, 16, 32, 64,
]
const noMovesFullWinBoard = [
  2, 4, 8, 16, 32, 64, 128, 2048, 512, 1024, 2, 4, 8, 16, 32, 64,
]

describe('boardsEqual', () => {
  it('should return true for identical boards', () => {
    const boardCopy = [...fullBoard]

    expect(boardsEqual(boardCopy, fullBoard)).toBeTruthy()
  })

  it('should return false for different boards', () => {
    expect(boardsEqual(fullBoard, noMovesFullBoard)).toBeFalsy()
  })

  it('should handle empty boards', () => {
    const testBoard: GameBoard = Array(16).fill(null)

    expect(boardsEqual(emptyBoard, testBoard)).toBeTruthy()
  })

  it('should handle boards with null values', () => {
    const boardCopy: GameBoard = [...winBoard]

    expect(boardsEqual(winBoard, boardCopy)).toBeTruthy()
  })
})

describe('checkWinCondition', () => {
  it('should return true when board contains 2048', () => {
    expect(checkWinCondition(winBoard)).toBeTruthy()
  })
  it('should return false when board does not contain 2048', () => {
    expect(checkWinCondition(fullBoard)).toBeFalsy()
  })
  it('should handle board with multiple 2048 tiles', () => {
    const board: GameBoard = [2048, ...Array(14).fill(null), 2048]

    expect(checkWinCondition(board)).toBeTruthy()
  })
  it('should handle empty board', () => {
    expect(checkWinCondition(emptyBoard)).toBeFalsy()
  })
})

describe('checkLoseCondition', () => {
  it('should return true when no moves are available', () => {
    expect(checkLoseCondition(noMovesFullBoard)).toBeTruthy()
  })

  it('should return false when moves are available', () => {
    expect(checkLoseCondition(fullBoard)).toBeFalsy()
  })

  it('should handle board with empty cells', () => {
    expect(checkLoseCondition(emptyBoard)).toBeFalsy()
  })
})

describe('getStatus', () => {
  it('should return "win" when win condition is met', () => {
    expect(getStatus(winBoard)).toBe('win')
  })

  it('should return "lose" when lose condition is met', () => {
    expect(getStatus(noMovesFullBoard)).toBe('lose')
  })

  it('should return "playing" when game continues', () => {
    expect(getStatus(fullBoard)).toBe('playing')
  })

  it('should prioritize win over lose when both conditions could apply', () => {
    expect(getStatus(noMovesFullWinBoard)).toBe('win')
  })
})

describe('hasAvailableMoves', () => {
  it('should return true when board has empty cells', () => {
    expect(hasAvailableMoves([null, ...Array(14).fill(2), null])).toBeTruthy()
  })

  it('should handle full board with possible merges', () => {
    expect(hasAvailableMoves(fullBoard)).toBeTruthy()
  })

  it('should return false when no moves are available', () => {
    expect(hasAvailableMoves(noMovesFullBoard)).toBeFalsy()
  })

  it('should return true when merges are possible', () => {
    const testBoard: GameBoard = [
      ...Array(4).fill(null),
      ...Array(8).fill(2),
      ...Array(4).fill(8),
    ]

    expect(hasAvailableMoves(testBoard)).toBeTruthy()
  })
})

describe('addNewTile', () => {
  it('should add tile to empty cell', () => {
    let testBoard: GameBoard = [null, ...Array(15).fill(256)]

    testBoard = addNewTile(testBoard)

    expect([2, 4]).toContain(testBoard[0])
  })

  it('should not modify board when no empty cells', () => {
    const fullBoardCopy = [...fullBoard]
    const originalFullBoard = [...fullBoard]

    const result = addNewTile(fullBoardCopy)

    expect(result).toBe(fullBoardCopy)
    expect(fullBoardCopy).toEqual(originalFullBoard)
  })

  it('should not mutate original board', () => {
    const board = [null, 2, null, ...Array(13).fill(4)]
    const originalBoard = [...board]

    const result = addNewTile(board)

    expect(board).toEqual(originalBoard)
    expect(result).not.toBe(board)
  })

  it('should handle board with multiple empty cells', () => {
    const result = addNewTile(emptyBoard)

    const occurrences = result.filter(cell => cell === 2 || cell === 4)

    expect(occurrences.length).toBe(1)
  })
})

describe('initializeGame', () => {
  it('should return correct GameState structure', () => {
    const gameState = initializeGame()

    expect(gameState).toHaveProperty('board')
    expect(gameState).toHaveProperty('score')
    expect(gameState).toHaveProperty('status')
    expect(gameState.board).toHaveLength(16)
  })

  it('should create board with exactly 2 tiles', () => {
    const { board } = initializeGame()

    const occurrences = board.filter(cell => cell === 2 || cell === 4)

    expect(occurrences.length).toBe(2)
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
    const { board: board1 } = initializeGame()
    const { board: board2 } = initializeGame()

    expect(board1).not.toEqual(board2)
  })
})

describe('moveBoardInDirection', () => {
  describe('when direction is left', () => {
    const direction: Direction = 'left'

    it('should move and merge tiles correctly', () => {
      const { board } = moveBoardInDirection(fullBoard, direction)

      expect(board).toEqual([
        2,
        4,
        4,
        null,
        2,
        4,
        4,
        null,
        2,
        4,
        4,
        null,
        2,
        4,
        4,
        null,
      ])
    })

    it('should calculate total score from multiple rows', () => {
      const { board, earnedScore } = moveBoardInDirection(fullBoard, direction)

      expect(board).toEqual([
        2,
        4,
        4,
        null,
        2,
        4,
        4,
        null,
        2,
        4,
        4,
        null,
        2,
        4,
        4,
        null,
      ])
      expect(earnedScore).toBe(16)
    })

    it('should not mutate original board', () => {
      const fullBoardCopy = [...fullBoard]
      const { board } = moveBoardInDirection(fullBoard, direction)

      expect(fullBoard).not.toBe(board)
      expect(fullBoardCopy).toEqual(fullBoard)
    })
  })

  describe('when direction is right', () => {
    const direction: Direction = 'right'

    it('should move and merge tiles correctly', () => {
      const { board } = moveBoardInDirection(fullBoard, direction)

      expect(board).toEqual([
        null,
        2,
        4,
        4,
        null,
        2,
        4,
        4,
        null,
        2,
        4,
        4,
        null,
        2,
        4,
        4,
      ])
    })
    it('should calculate total score from multiple rows', () => {
      const { board, earnedScore } = moveBoardInDirection(fullBoard, direction)

      expect(board).toEqual([
        null,
        2,
        4,
        4,
        null,
        2,
        4,
        4,
        null,
        2,
        4,
        4,
        null,
        2,
        4,
        4,
      ])
      expect(earnedScore).toBe(16)
    })
  })

  describe('when direction is up', () => {
    const direction: Direction = 'up'

    it('should move and merge tiles correctly', () => {
      const { board } = moveBoardInDirection(fullBoard, direction)

      expect(board).toEqual([
        4,
        8,
        4,
        4,
        4,
        8,
        4,
        4,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ])
    })

    it('should calculate total score from multiple columns', () => {
      const { board, earnedScore } = moveBoardInDirection(fullBoard, direction)

      expect(board).toEqual([
        4,
        8,
        4,
        4,
        4,
        8,
        4,
        4,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ])
      expect(earnedScore).toBe(40)
    })
  })

  describe('when direction is down', () => {
    const direction: Direction = 'down'

    it('should move and merge tiles correctly', () => {
      const { board } = moveBoardInDirection(fullBoard, direction)

      expect(board).toEqual([
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        4,
        8,
        4,
        4,
        4,
        8,
        4,
        4,
      ])
    })

    it('should calculate total score from multiple columns', () => {
      const { board, earnedScore } = moveBoardInDirection(fullBoard, direction)

      expect(board).toEqual([
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        4,
        8,
        4,
        4,
        4,
        8,
        4,
        4,
      ])
      expect(earnedScore).toBe(40)
    })
  })

  describe('integration', () => {
    it('should handle empty board', () => {
      const { board } = moveBoardInDirection(emptyBoard, 'left')
      const testBoard = [...Array(16).fill(null)]

      expect(board).toEqual(testBoard)
    })
  })
})
