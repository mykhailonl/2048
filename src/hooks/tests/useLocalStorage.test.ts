import { renderHook, act } from '@testing-library/react'

import { useLocalStorage } from '../useLocalStorage'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Replace global localStorage with our mock
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should return startValue when localStorage is empty', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'default-value')
      )

      expect(result.current[0]).toBe('default-value')
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key')
    })

    it('should return parsed value from localStorage when available', () => {
      mockLocalStorage.getItem.mockReturnValue('"stored-value"')

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'default-value')
      )

      expect(result.current[0]).toBe('stored-value')
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key')
    })

    it('should handle complex objects from localStorage', () => {
      const storedObject = { name: 'John', age: 30, active: true }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedObject))

      const { result } = renderHook(() => useLocalStorage('user-data', {}))

      expect(result.current[0]).toEqual(storedObject)
    })

    it('should return startValue when JSON parsing fails', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json{')

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'fallback-value')
      )

      expect(result.current[0]).toBe('fallback-value')
    })

    it('should handle different data types', () => {
      // Test with number
      mockLocalStorage.getItem.mockReturnValue('42')
      const { result: numberResult } = renderHook(() =>
        useLocalStorage('number-key', 0)
      )
      expect(numberResult.current[0]).toBe(42)

      // Test with boolean
      mockLocalStorage.getItem.mockReturnValue('true')
      const { result: boolResult } = renderHook(() =>
        useLocalStorage('bool-key', false)
      )
      expect(boolResult.current[0]).toBe(true)

      // Test with array
      mockLocalStorage.getItem.mockReturnValue('[1,2,3]')
      const { result: arrayResult } = renderHook(() =>
        useLocalStorage('array-key', [] as number[])
      )
      expect(arrayResult.current[0]).toEqual([1, 2, 3])
    })
  })

  describe('saving values', () => {
    it('should save string value to localStorage and update state', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      )

      act(() => {
        result.current[1]('new-value')
      })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        '"new-value"'
      )
      expect(result.current[0]).toBe('new-value')
    })

    it('should save object to localStorage and update state', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useLocalStorage('object-key', {}))

      const newObject = { id: 1, name: 'Test' }

      act(() => {
        result.current[1](newObject)
      })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'object-key',
        JSON.stringify(newObject)
      )
      expect(result.current[0]).toEqual(newObject)
    })

    it('should save number to localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useLocalStorage('number-key', 0))

      act(() => {
        result.current[1](100)
      })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('number-key', '100')
      expect(result.current[0]).toBe(100)
    })

    it('should save boolean to localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useLocalStorage('bool-key', false))

      act(() => {
        result.current[1](true)
      })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('bool-key', 'true')
      expect(result.current[0]).toBe(true)
    })
  })

  describe('multiple updates', () => {
    it('should handle multiple save operations', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useLocalStorage('counter', 0))

      act(() => {
        result.current[1](1)
      })

      expect(result.current[0]).toBe(1)

      act(() => {
        result.current[1](2)
      })

      expect(result.current[0]).toBe(2)
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2)
    })

    it('should maintain save function reference stability', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const { result, rerender } = renderHook(
        props => useLocalStorage(props.key, props.defaultValue),
        { initialProps: { key: 'test', defaultValue: 'initial' } }
      )

      const initialSaveFunction = result.current[1]

      rerender({ key: 'test', defaultValue: 'initial' })

      expect(result.current[1]).toBe(initialSaveFunction)
    })
  })

  describe('different keys', () => {
    it('should handle different keys independently', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const { result: result1 } = renderHook(() =>
        useLocalStorage('key1', 'value1')
      )

      const { result: result2 } = renderHook(() =>
        useLocalStorage('key2', 'value2')
      )

      act(() => {
        result1.current[1]('updated1')
      })

      act(() => {
        result2.current[1]('updated2')
      })

      expect(result1.current[0]).toBe('updated1')
      expect(result2.current[0]).toBe('updated2')

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'key1',
        '"updated1"'
      )
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'key2',
        '"updated2"'
      )
    })
  })

  describe('TypeScript generics', () => {
    it('should work with typed objects', () => {
      interface User {
        id: number
        name: string
        email: string
      }

      const defaultUser: User = { id: 0, name: '', email: '' }
      mockLocalStorage.getItem.mockReturnValue(null)

      const { result } = renderHook(() =>
        useLocalStorage<User>('user', defaultUser)
      )

      const newUser: User = { id: 1, name: 'John', email: 'john@example.com' }

      act(() => {
        result.current[1](newUser)
      })

      expect(result.current[0]).toEqual(newUser)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(newUser)
      )
    })
  })
})
