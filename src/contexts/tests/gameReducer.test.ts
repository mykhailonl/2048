import type { GameAction, GameState } from '../../types/GameTypes'
import type { Direction, Tile } from '../../types/TileTypes'
import {
  addNewTile,
  getStatus,
  initializeGame,
  moveTilesInDirection,
  tilesEqual,
} from '../../utils/gameLogic'
import { gameReducer } from '../GameContext.tsx'

// Mock all the utilities the reducer uses
vi.mock('../../utils/gameLogic', () => ({
  moveTilesInDirection: vi.fn(),
  addNewTile: vi.fn(),
  getStatus: vi.fn(),
  tilesEqual: vi.fn(),
  initializeGame: vi.fn(),
}))

// Mock localStorage
const mockLocalStorage = {
  removeItem: vi.fn(),
  setItem: vi.fn(),
  getItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

// Mock implementations
const mockMoveTilesInDirection = vi.mocked(moveTilesInDirection)
const mockAddNewTile = vi.mocked(addNewTile)
const mockGetStatus = vi.mocked(getStatus)
const mockTilesEqual = vi.mocked(tilesEqual)
const mockInitializeGame = vi.mocked(initializeGame)

// Helper functions
const createTile = (x: number, y: number, value: number): Tile => ({
  id: `tile-${x}-${y}-${value}`,
  value,
  x,
  y,
})

const MAX_HISTORY_SIZE = 15

const createInitialState = (overrides?: Partial<GameState>): GameState => ({
  tiles: [],
  score: 0,
  status: 'playing',
  commandQueue: [],
  isProcessingCommand: false,
  undoCharges: 0,
  stateHistory: [],
  ...overrides,
})

describe('gameReducer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('NEW_GAME action', () => {
    it('should clear localStorage and return initialized game', () => {
      const newGameState = createInitialState({
        tiles: [createTile(0, 0, 2)],
        score: 100,
      })

      mockInitializeGame.mockReturnValue(newGameState)

      const currentState = createInitialState({
        score: 1000,
        tiles: [createTile(1, 1, 4)],
        undoCharges: 5,
      })

      const action: GameAction = { type: 'NEW_GAME' }
      const result = gameReducer(currentState, action)

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
        '2048-game-state'
      )
      expect(mockInitializeGame).toHaveBeenCalled()
      expect(result).toBe(newGameState)
    })

    it('should work regardless of current state', () => {
      const newGameState = createInitialState()
      mockInitializeGame.mockReturnValue(newGameState)

      const complexState = createInitialState({
        tiles: [createTile(0, 0, 2048)],
        score: 50000,
        status: 'win',
        commandQueue: ['left', 'right'] as Direction[],
        isProcessingCommand: true,
        undoCharges: 10,
        stateHistory: [{ tiles: [], score: 100 }],
      })

      const action: GameAction = { type: 'NEW_GAME' }
      const result = gameReducer(complexState, action)

      expect(result).toBe(newGameState)
    })
  })

  describe('QUEUE_COMMAND action', () => {
    it('should add command to empty queue', () => {
      const state = createInitialState()
      const action: GameAction = { type: 'QUEUE_COMMAND', direction: 'left' }

      const result = gameReducer(state, action)

      expect(result.commandQueue).toEqual(['left'])
      expect(result).not.toBe(state)
    })

    it('should add multiple commands up to limit', () => {
      let state = createInitialState()

      state = gameReducer(state, { type: 'QUEUE_COMMAND', direction: 'left' })
      expect(state.commandQueue).toEqual(['left'])

      state = gameReducer(state, { type: 'QUEUE_COMMAND', direction: 'right' })
      expect(state.commandQueue).toEqual(['left', 'right'])

      state = gameReducer(state, { type: 'QUEUE_COMMAND', direction: 'up' })
      expect(state.commandQueue).toEqual(['left', 'right', 'up'])
    })

    it('should not add command when queue is at limit (3 commands)', () => {
      const state = createInitialState({
        commandQueue: ['left', 'right', 'up'] as Direction[],
      })

      const action: GameAction = { type: 'QUEUE_COMMAND', direction: 'down' }
      const result = gameReducer(state, action)

      expect(result).toBe(state)
      expect(result.commandQueue).toEqual(['left', 'right', 'up'])
    })

    it('should preserve other state properties', () => {
      const state = createInitialState({
        score: 100,
        undoCharges: 2,
        tiles: [createTile(0, 0, 4)],
      })

      const action: GameAction = { type: 'QUEUE_COMMAND', direction: 'left' }
      const result = gameReducer(state, action)

      expect(result.score).toBe(100)
      expect(result.undoCharges).toBe(2)
      expect(result.tiles).toEqual(state.tiles)
      expect(result.commandQueue).toEqual(['left'])
    })
  })

  describe('MOVE action', () => {
    it('should process successful move', () => {
      const initialTiles = [createTile(0, 0, 2)]
      const newTiles = [createTile(1, 0, 2)]
      const tilesWithNewTile = [createTile(1, 0, 2), createTile(0, 1, 2)]

      mockMoveTilesInDirection.mockReturnValue({
        tiles: newTiles,
        earnedScore: 4,
        earnedUndoes: 1,
      })
      mockTilesEqual.mockReturnValue(false)
      mockAddNewTile.mockReturnValue(tilesWithNewTile)
      mockGetStatus.mockReturnValue('playing')

      const state = createInitialState({
        tiles: initialTiles,
        score: 100,
        undoCharges: 0,
        stateHistory: [],
      })

      const action: GameAction = { type: 'MOVE', direction: 'right' }
      const result = gameReducer(state, action)

      expect(mockMoveTilesInDirection).toHaveBeenCalledWith(
        initialTiles,
        'right'
      )
      expect(mockTilesEqual).toHaveBeenCalledWith(initialTiles, newTiles)
      expect(mockAddNewTile).toHaveBeenCalledWith(newTiles)
      expect(mockGetStatus).toHaveBeenCalledWith(tilesWithNewTile)

      expect(result.tiles).toBe(tilesWithNewTile)
      expect(result.score).toBe(104)
      expect(result.undoCharges).toBe(1)
      expect(result.status).toBe('playing')
      expect(result.stateHistory).toHaveLength(1)
      expect(result.stateHistory[0]).toEqual({
        tiles: initialTiles,
        score: 100,
      })
    })

    it('should not change state when no move is possible', () => {
      const tiles = [createTile(0, 0, 2)]

      mockMoveTilesInDirection.mockReturnValue({
        tiles,
        earnedScore: 0,
        earnedUndoes: 0,
      })
      mockTilesEqual.mockReturnValue(true)

      const state = createInitialState({ tiles })
      const action: GameAction = { type: 'MOVE', direction: 'left' }
      const result = gameReducer(state, action)

      expect(result).toBe(state)
      expect(mockAddNewTile).not.toHaveBeenCalled()
      expect(mockGetStatus).not.toHaveBeenCalled()
    })

    it('should limit history size to MAX_HISTORY_SIZE', () => {
      const longHistory = Array.from({ length: 20 }, (_, i) => ({
        tiles: [],
        score: i * 10,
      }))

      mockMoveTilesInDirection.mockReturnValue({
        tiles: [createTile(0, 0, 4)],
        earnedScore: 4,
        earnedUndoes: 0,
      })
      mockTilesEqual.mockReturnValue(false)
      mockAddNewTile.mockReturnValue([createTile(0, 0, 4)])
      mockGetStatus.mockReturnValue('playing')

      const state = createInitialState({
        tiles: [createTile(0, 0, 2)],
        stateHistory: longHistory,
      })

      const action: GameAction = { type: 'MOVE', direction: 'right' }
      const result = gameReducer(state, action)

      expect(result.stateHistory).toHaveLength(MAX_HISTORY_SIZE)
      expect(result.stateHistory[0].score).toBe(60)
      expect(result.stateHistory[MAX_HISTORY_SIZE - 1]).toEqual({
        tiles: [createTile(0, 0, 2)],
        score: 0,
      })
    })

    it('should handle win condition', () => {
      mockMoveTilesInDirection.mockReturnValue({
        tiles: [createTile(0, 0, 2048)],
        earnedScore: 2048,
        earnedUndoes: 0,
      })
      mockTilesEqual.mockReturnValue(false)
      mockAddNewTile.mockReturnValue([createTile(0, 0, 2048)])
      mockGetStatus.mockReturnValue('win')

      const state = createInitialState()
      const action: GameAction = { type: 'MOVE', direction: 'up' }
      const result = gameReducer(state, action)

      expect(result.status).toBe('win')
    })
  })

  describe('UNDO action', () => {
    it('should restore previous state when charges and history available', () => {
      const previousState = {
        tiles: [createTile(0, 0, 2)],
        score: 50,
      }

      const state = createInitialState({
        tiles: [createTile(1, 1, 4)],
        score: 100,
        undoCharges: 2,
        stateHistory: [previousState],
      })

      const action: GameAction = { type: 'UNDO' }
      const result = gameReducer(state, action)

      expect(result.tiles).toEqual(previousState.tiles)
      expect(result.score).toBe(previousState.score)
      expect(result.undoCharges).toBe(1)
      expect(result.stateHistory).toHaveLength(0)
    })

    it('should not change state when no undo charges', () => {
      const state = createInitialState({
        undoCharges: 0,
        stateHistory: [{ tiles: [], score: 50 }],
      })

      const action: GameAction = { type: 'UNDO' }
      const result = gameReducer(state, action)

      expect(result).toBe(state)
    })

    it('should not change state when no history available', () => {
      const state = createInitialState({
        undoCharges: 5,
        stateHistory: [],
      })

      const action: GameAction = { type: 'UNDO' }
      const result = gameReducer(state, action)

      expect(result).toBe(state)
    })

    it('should handle multiple undoes', () => {
      const history = [
        { tiles: [createTile(0, 0, 2)], score: 0 },
        { tiles: [createTile(1, 0, 2)], score: 4 },
      ]

      let state = createInitialState({
        tiles: [createTile(2, 0, 4)],
        score: 8,
        undoCharges: 3,
        stateHistory: history,
      })

      state = gameReducer(state, { type: 'UNDO' })
      expect(state.score).toBe(4)
      expect(state.undoCharges).toBe(2)
      expect(state.stateHistory).toHaveLength(1)

      state = gameReducer(state, { type: 'UNDO' })
      expect(state.score).toBe(0)
      expect(state.undoCharges).toBe(1)
      expect(state.stateHistory).toHaveLength(0)
    })
  })
})
