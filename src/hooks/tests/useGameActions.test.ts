import { act, renderHook } from '@testing-library/react'

import { useGameActions } from '../useGameActions'

// Mock useGameContext
const mockDispatch = vi.fn()

vi.mock('../useGameContext', () => ({
  useGameContext: () => ({
    dispatch: mockDispatch,
  }),
}))

describe('useGameActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('returned functions', () => {
    it('should return newGame and undo functions', () => {
      const { result } = renderHook(() => useGameActions())

      expect(result.current).toHaveProperty('newGame')
      expect(result.current).toHaveProperty('undo')
      expect(typeof result.current.newGame).toBe('function')
      expect(typeof result.current.undo).toBe('function')
    })

    it('should return the same function references on re-renders', () => {
      const { result, rerender } = renderHook(() => useGameActions())

      const initialNewGame = result.current.newGame
      const initialUndo = result.current.undo

      rerender()

      expect(result.current.newGame).toBe(initialNewGame)
      expect(result.current.undo).toBe(initialUndo)
    })
  })

  describe('newGame function', () => {
    it('should dispatch NEW_GAME action when called', () => {
      const { result } = renderHook(() => useGameActions())

      act(() => {
        result.current.newGame()
      })

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'NEW_GAME' })
      expect(mockDispatch).toHaveBeenCalledTimes(1)
    })

    it('should dispatch NEW_GAME action on multiple calls', () => {
      const { result } = renderHook(() => useGameActions())

      act(() => {
        result.current.newGame()
        result.current.newGame()
        result.current.newGame()
      })

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'NEW_GAME' })
      expect(mockDispatch).toHaveBeenCalledTimes(3)
    })

    it('should not call dispatch on function creation', () => {
      renderHook(() => useGameActions())

      expect(mockDispatch).not.toHaveBeenCalled()
    })
  })

  describe('undo function', () => {
    it('should dispatch UNDO action when called', () => {
      const { result } = renderHook(() => useGameActions())

      act(() => {
        result.current.undo()
      })

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'UNDO' })
      expect(mockDispatch).toHaveBeenCalledTimes(1)
    })

    it('should dispatch UNDO action on multiple calls', () => {
      const { result } = renderHook(() => useGameActions())

      act(() => {
        result.current.undo()
        result.current.undo()
      })

      expect(mockDispatch).toHaveBeenCalledWith({ type: 'UNDO' })
      expect(mockDispatch).toHaveBeenCalledTimes(2)
    })
  })

  describe('mixed function calls', () => {
    it('should handle mixed newGame and undo calls', () => {
      const { result } = renderHook(() => useGameActions())

      act(() => {
        result.current.newGame()
        result.current.undo()
        result.current.newGame()
        result.current.undo()
      })

      expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: 'NEW_GAME' })
      expect(mockDispatch).toHaveBeenNthCalledWith(2, { type: 'UNDO' })
      expect(mockDispatch).toHaveBeenNthCalledWith(3, { type: 'NEW_GAME' })
      expect(mockDispatch).toHaveBeenNthCalledWith(4, { type: 'UNDO' })
      expect(mockDispatch).toHaveBeenCalledTimes(4)
    })
  })

  describe('dispatch dependency', () => {
    it('should call the same dispatch function from context', () => {
      const { result } = renderHook(() => useGameActions())

      act(() => {
        result.current.newGame()
      })

      act(() => {
        result.current.undo()
      })

      // Verify that the same mockDispatch instance is used
      expect(mockDispatch).toHaveBeenCalledTimes(2)
    })
  })

  describe('function behavior', () => {
    it('should not throw errors when called', () => {
      const { result } = renderHook(() => useGameActions())

      expect(() => {
        act(() => {
          result.current.newGame()
        })
      }).not.toThrow()

      expect(() => {
        act(() => {
          result.current.undo()
        })
      }).not.toThrow()
    })

    it('should work with rapid successive calls', () => {
      const { result } = renderHook(() => useGameActions())

      act(() => {
        // Rapid calls
        for (let i = 0; i < 10; i++) {
          result.current.newGame()
        }
      })

      expect(mockDispatch).toHaveBeenCalledTimes(10)
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'NEW_GAME' })
    })
  })
})
