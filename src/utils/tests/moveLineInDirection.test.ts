import type { Direction } from '../../types/BoardTypes.ts'
import { moveLineInDirection, moveLineLeft } from '../moveUtils'

describe('moveLineInDirection', () => {
  describe('when direction is left', () => {
    const direction: Direction = 'left'

    it('should merge tiles correctly', () => {
      const input = [4, 4, null, 8]
      const { row, earnedScore } = moveLineInDirection(input, direction)

      expect(row).toEqual([8, 8, null, null])
      expect(earnedScore).toBe(8)
    })

    it('should handle empty spaces', () => {
      const input = [null, null, null, null]
      const { row, earnedScore } = moveLineInDirection(input, direction)

      expect(row).toEqual([null, null, null, null])
      expect(earnedScore).toBe(0)
    })

    it('should produce same result as moveLineLeft when direction is left', () => {
      const input = [2, 2, 4, null]

      const resultFromDirection = moveLineInDirection(input, 'left')
      const resultFromDirect = moveLineLeft(input)

      expect(resultFromDirection).toEqual(resultFromDirect)
      expect(resultFromDirection.earnedScore).toBe(resultFromDirect.earnedScore)
    })
  })

  describe('when direction is right', () => {
    const direction: Direction = 'right'

    it('should merge tiles correctly', () => {
      const input = [32, 32, null, 128]
      const { row, earnedScore } = moveLineInDirection(input, direction)

      expect(row).toEqual([null, null, 64, 128])
      expect(earnedScore).toBe(64)
    })

    it('should handle empty spaces', () => {
      const input = [null, null, null, null]
      const { row, earnedScore } = moveLineInDirection(input, direction)

      expect(row).toEqual([null, null, null, null])
      expect(earnedScore).toBe(0)
    })

    it('should produce same result as moveLineLeft when direction is right', () => {
      const input = [2, 2, 4, null]

      const resultFromDirection = moveLineInDirection(input, 'right')
      const resultFromDirect = moveLineLeft(input)

      expect(resultFromDirection.row).toEqual(resultFromDirect.row.reverse())
      expect(resultFromDirection.earnedScore).toBe(resultFromDirect.earnedScore)
    })
  })

  describe('when direction is up', () => {
    const direction: Direction = 'up'

    it('should merge tiles correctly', () => {
      const input = [128, 256, 256, 512]
      const { row, earnedScore } = moveLineInDirection(input, direction)

      expect(row).toEqual([128, 512, 512, null])
      expect(earnedScore).toBe(512)
    })

    it('should handle empty spaces', () => {
      const input = [null, null, null, null]
      const { row, earnedScore } = moveLineInDirection(input, direction)

      expect(row).toEqual([null, null, null, null])
      expect(earnedScore).toBe(0)
    })

    it('should produce same result as moveLineLeft when direction is up', () => {
      const input = [1024, 1024, null, 4]

      const resultFromDirection = moveLineInDirection(input, direction)
      const resultFromDirect = moveLineLeft(input)

      expect(resultFromDirection.row).toEqual(resultFromDirect.row)
      expect(resultFromDirection.earnedScore).toBe(resultFromDirect.earnedScore)
    })
  })

  describe('when direction is down', () => {
    const direction: Direction = 'down'

    it('should merge tiles correctly', () => {
      const input = [64, 128, null, 128]
      const { row, earnedScore } = moveLineInDirection(input, direction)

      expect(row).toEqual([null, null, 64, 256])
      expect(earnedScore).toBe(256)
    })

    it('should handle empty spaces', () => {
      const input = [null, null, null, null]
      const { row, earnedScore } = moveLineInDirection(input, direction)

      expect(row).toEqual([null, null, null, null])
      expect(earnedScore).toBe(0)
    })

    it('should produce same result as moveLineLeft when direction is down', () => {
      const input = [2, 2, 4, null]

      const resultFromDirection = moveLineInDirection(input, 'down')
      const resultFromDirect = moveLineLeft(input)

      expect(resultFromDirection.row).toEqual(resultFromDirect.row.reverse())
      expect(resultFromDirection.earnedScore).toBe(resultFromDirect.earnedScore)
    })
  })

  describe('cross-direction behavior', () => {
    it('should produce mirrored results for left vs right', () => {
      const input = [2, 2, null, 4]

      const leftResult = moveLineInDirection(input, 'left')
      const rightResult = moveLineInDirection([...input].reverse(), 'right')

      expect(leftResult.row).toEqual(rightResult.row.reverse())
      expect(leftResult.earnedScore).toBe(rightResult.earnedScore)
    })

    it('should produce mirrored results for up vs down', () => {
      const input = [4, null, 4, 8]

      const upResult = moveLineInDirection(input, 'up')
      const downResult = moveLineInDirection([...input].reverse(), 'down')

      expect(upResult.row).toEqual(downResult.row.reverse())
      expect(upResult.earnedScore).toBe(downResult.earnedScore)
    })

    it('should maintain score consistency across directions', () => {
      const input = [2, 2, 4, 4]

      const leftScore = moveLineInDirection(input, 'left').earnedScore
      const rightScore = moveLineInDirection(input, 'right').earnedScore
      const upScore = moveLineInDirection(input, 'up').earnedScore
      const downScore = moveLineInDirection(input, 'down').earnedScore

      expect(leftScore).toBe(rightScore)
      expect(leftScore).toBe(upScore)
      expect(leftScore).toBe(downScore)
    })
  })
})
