import { moveLineLeft } from '../moveUtils'

describe('moveLineLeft', () => {
  it('should merge two identical numbers', () => {
    const input = [2, 2, null, null]

    const result = moveLineLeft(input)

    expect(result.row).toEqual([4, null, null, null])
    expect(result.earnedScore).toBe(4)
  })

  it('should handle no merges', () => {
    const input = [2, 4, 8, 16]
    const { row, earnedScore } = moveLineLeft(input)

    expect(row).toEqual([2, 4, 8, 16])
    expect(earnedScore).toBe(0)
  })

  it('should handle empty line', () => {
    const input = [null, null, null, null]
    const { row, earnedScore } = moveLineLeft(input)

    expect(row).toEqual([null, null, null, null])
    expect(earnedScore).toBe(0)
  })

  it('should merge multiple pairs', () => {
    const input = [4, 4, 8, 8]
    const { row, earnedScore } = moveLineLeft(input)

    expect(row).toEqual([8, 16, null, null])
    expect(earnedScore).toBe(24)
  })
})
