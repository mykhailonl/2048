import type {
  BoardRow,
  CellValue,
  Direction,
  MoveReducer,
} from '../types/BoardTypes.ts'

/**
 * Performs a left move for a single row/column in 2048 game
 *
 * Algorithm:
 * 1. Removes empty cells (null)
 * 2. Merges identical adjacent numbers (2+2=4)
 * 3. Each number can participate in only one merge per move
 * 4. Fills the result to 4 elements with empty cells
 * 5. Calculates score from merged tiles (merged value = earned points)
 *
 * @param boardRow - Array of 4 elements (board row or column)
 * @returns Object with transformed array and earned score
 *
 * @example
 * moveLineLeft([2, null, 2, 4]) => { row: [4, 4, null, null], earnedScore: 4 }
 * moveLineLeft([2, 2, 4, 4])    => { row: [4, 8, null, null], earnedScore: 12 }
 * moveLineLeft([2, 4, 8, 16])   => { row: [2, 4, 8, 16], earnedScore: 0 }
 */
export const moveLineLeft = (
  boardRow: CellValue[]
): {
  row: BoardRow
  earnedScore: number
} => {
  const result = boardRow.reduce<MoveReducer>(
    (acc, curr) => {
      if (curr === null) {
        return acc
      }

      if (acc.result.length === 0) {
        return {
          result: [...acc.result, curr],
          lastValue: curr,
          canMerge: true,
          earnedScore: acc.earnedScore,
        }
      }

      if (curr === acc.lastValue && acc.canMerge) {
        const lastValue = acc.result[acc.result.length - 1]
        const resultWithoutLast = acc.result.slice(0, -1)
        const newValue = lastValue! + curr

        return {
          result: [...resultWithoutLast, newValue],
          lastValue: newValue,
          canMerge: false,
          earnedScore: acc.earnedScore + newValue,
        }
      }

      return {
        result: [...acc.result, curr],
        lastValue: curr,
        canMerge: true,
        earnedScore: acc.earnedScore,
      }
    },
    {
      result: [],
      lastValue: null,
      canMerge: true,
      earnedScore: 0,
    }
  )

  return {
    row: [
      ...result.result,
      ...Array(4 - result.result.length).fill(null),
    ] as BoardRow,
    earnedScore: result.earnedScore,
  }
}

/**
 * Universal move function for any direction
 *
 * Uses moveLineLeft as base logic, applying transformations:
 * - left/up: passes array as is
 * - right/down: reverses array, applies moveLineLeft, reverses back
 *
 * @param row - Array of 4 elements to process
 * @param direction - Move direction ('left' | 'right' | 'up' | 'down')
 * @returns Object with result of movement in specified direction and earned score
 *
 * @example
 * moveLineInDirection([null, 2, 2, null], 'left')  => { row: [4, null, null, null], earnedScore: 4 }
 * moveLineInDirection([null, 2, 2, null], 'right') => { row: [null, null, null, 4], earnedScore: 4 }
 */
export const moveLineInDirection = (
  row: CellValue[],
  direction: Direction
): { row: BoardRow; earnedScore: number } => {
  switch (direction) {
    case 'left': {
      const { row: result, earnedScore } = moveLineLeft(row)

      return {
        row: result as BoardRow,
        earnedScore,
      }
    }
    case 'right': {
      const reversed = [...row].reverse()
      const { row: result, earnedScore } = moveLineLeft(reversed)

      return {
        row: result.reverse() as BoardRow,
        earnedScore,
      }
    }

    case 'up': {
      const { row: result, earnedScore } = moveLineLeft(row)

      return {
        row: result as BoardRow,
        earnedScore,
      }
    }

    case 'down': {
      const reversed = [...row].reverse()
      const { row: result, earnedScore } = moveLineLeft(reversed)

      return {
        row: result.reverse() as BoardRow,
        earnedScore,
      }
    }

    default:
      return {
        row: row as BoardRow,
        earnedScore: 0,
      }
  }
}
