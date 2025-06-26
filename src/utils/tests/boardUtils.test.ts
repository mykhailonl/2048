import type { GameBoard } from '../../contexts/GameContext.tsx'
import {
  coordsToIndex,
  getCell,
  indexToCoords,
  getRow,
  getColumn,
} from '../boardUtils'

const board: GameBoard = [
  2,
  2,
  4,
  null,
  16,
  null,
  null,
  32,
  null,
  null,
  256,
  null,
  64,
  null,
  2,
  null,
]

describe('indexToCoords', () => {
  it('should convert valid indices to correct coordinates', () => {
    expect(indexToCoords(1)).toEqual([1, 0])
    expect(indexToCoords(6)).toEqual([2, 1])
    expect(indexToCoords(8)).toEqual([0, 2])
    expect(indexToCoords(9)).toEqual([1, 2])
    expect(indexToCoords(11)).toEqual([3, 2])
    expect(indexToCoords(14)).toEqual([2, 3])
  })

  it('should return null for invalid indices', () => {
    expect(indexToCoords(-1)).toBeNull()
    expect(indexToCoords(16)).toBeNull()
    expect(indexToCoords(100)).toBeNull()
  })

  it('should handle boundary values correctly', () => {
    expect(indexToCoords(0)).toEqual([0, 0])
    expect(indexToCoords(3)).toEqual([3, 0])
    expect(indexToCoords(12)).toEqual([0, 3])
    expect(indexToCoords(15)).toEqual([3, 3])
  })
})

describe('coordsToIndex', () => {
  it('should convert coordinates to index using correct formula', () => {
    expect(coordsToIndex(0, 0)).toBe(0)
    expect(coordsToIndex(2, 0)).toBe(2)
    expect(coordsToIndex(3, 0)).toBe(3)
    expect(coordsToIndex(1, 2)).toBe(9)
    expect(coordsToIndex(0, 3)).toBe(12)
    expect(coordsToIndex(3, 3)).toBe(15)
  })
})

describe('getCell', () => {
  it('should return correct cell value from the board', () => {
    expect(getCell(board, [0, 0])).toBe(2)
    expect(getCell(board, [3, 0])).toBeNull()
    expect(getCell(board, [1, 1])).toBeNull()
    expect(getCell(board, [2, 2])).toBe(256)
    expect(getCell(board, [0, 3])).toBe(64)
    expect(getCell(board, [3, 3])).toBeNull()
  })
})

describe('getRow', () => {
  it('should return correct row from the board', () => {
    expect(getRow(board, 0)).toEqual([2, 2, 4, null])
    expect(getRow(board, 1)).toEqual([16, null, null, 32])
    expect(getRow(board, 2)).toEqual([null, null, 256, null])
    expect(getRow(board, 3)).toEqual([64, null, 2, null])
  })
})

describe('getColumn', () => {
  it('should return correct column from the board', () => {
    expect(getColumn(board, 0)).toEqual([2, 16, null, 64])
    expect(getColumn(board, 1)).toEqual([2, null, null, null])
    expect(getColumn(board, 2)).toEqual([4, null, 256, 2])
    expect(getColumn(board, 3)).toEqual([null, 32, null, null])
  })
})
