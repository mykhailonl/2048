import type { GameBoard } from '../contexts/GameContext.tsx'
import type {
  BoardIndex,
  BoardRow,
  CellValue,
  ColIndex,
  Coordinates,
  RowIndex,
} from '../types/BoardTypes.ts'

const isValidBoardIndex = (index: number): index is BoardIndex =>
  index >= 0 && index <= 3

export const indexToCoords = (index: number): Coordinates | null => {
  if (index > 15 || index < 0) return null

  return [index % 4, Math.floor(index / 4)] as Coordinates
}

export const coordsToIndex = (
  colIndex: ColIndex,
  rowIndex: RowIndex
): number | null => {
  if (!isValidBoardIndex(colIndex) || !isValidBoardIndex(rowIndex)) return null

  return colIndex + rowIndex * 4
}

export const getCell = (
  board: GameBoard,
  coordinates: Coordinates
): CellValue => {
  const [colIndex, rowIndex] = coordinates
  const targetIndex = coordsToIndex(colIndex, rowIndex)

  if (targetIndex === null) {
    return null
  }

  return board[targetIndex]
}

export const getRow = (board: GameBoard, rowIndex: RowIndex): BoardRow => {
  const startIndex = rowIndex * 4

  return board.slice(startIndex, startIndex + 4) as BoardRow
}

export const getColumn = (board: GameBoard, colIndex: ColIndex): BoardRow => {
  return [
    getCell(board, [colIndex, 0]),
    getCell(board, [colIndex, 1]),
    getCell(board, [colIndex, 2]),
    getCell(board, [colIndex, 3]),
  ]
}
