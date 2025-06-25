export type CellValue = number | null
export type BoardIndex = 0 | 1 | 2 | 3
export type RowIndex = BoardIndex
export type ColIndex = BoardIndex
export type Coordinates = [ColIndex, RowIndex]
export type BoardRow = [CellValue, CellValue, CellValue, CellValue]

export interface MoveReducer {
  result: CellValue[]
  lastValue: CellValue
  canMerge: boolean
  earnedScore: number
}

export type Direction = 'left' | 'right' | 'up' | 'down'
