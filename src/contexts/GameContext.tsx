import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  useEffect,
  useReducer,
} from 'react'

import { useLocalStorage } from '../hooks/useLocalStorage.ts'
import type { Direction, Tile } from '../types/TileTypes.ts'
import {
  addNewTile,
  getStatus,
  initializeGame,
  moveTilesInDirection,
  tilesEqual,
} from '../utils/gameLogic.ts'

export type GameStatus = 'idle' | 'playing' | 'win' | 'lose'
const MAX_HISTORY_SIZE = 15

export interface GameState {
  tiles: Tile[]
  score: number
  status: GameStatus
  commandQueue: Direction[]
  isProcessingCommand: boolean
  undoCharges: number
  stateHistory: Array<{ tiles: Tile[]; score: number }>
}

type GameAction =
  | {
      type: 'NEW_GAME'
    }
  | { type: 'MOVE'; direction: Direction }
  | { type: 'QUEUE_COMMAND'; direction: Direction }
  | { type: 'START_PROCESSING' }
  | { type: 'FINISH_PROCESSING' }
  | { type: 'UNDO' }

interface GameContextType {
  state: GameState
  dispatch: Dispatch<GameAction>
}

const initialState: GameState = initializeGame()

export const GameContext = createContext<GameContextType | undefined>(undefined)

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'NEW_GAME':
      localStorage.removeItem('2048-game-state')

      return initializeGame()
    case 'QUEUE_COMMAND': {
      // restricting command queue to max 3 commands to avoid bad ux exp
      if (state.commandQueue.length >= 3) {
        return state
      }

      return {
        ...state,
        commandQueue: [...state.commandQueue, action.direction],
      }
    }

    case 'START_PROCESSING': {
      return {
        ...state,
        isProcessingCommand: true,
      }
    }

    case 'FINISH_PROCESSING': {
      return {
        ...state,
        commandQueue: state.commandQueue.slice(1),
        isProcessingCommand: false,
      }
    }

    case 'MOVE': {
      const newHistory = [
        ...state.stateHistory.slice(-MAX_HISTORY_SIZE + 1),
        {
          tiles: state.tiles,
          score: state.score,
        },
      ]

      const {
        tiles: newTiles,
        earnedScore,
        earnedUndoes,
      } = moveTilesInDirection(state.tiles, action.direction)

      if (tilesEqual(state.tiles, newTiles)) {
        return state
      }

      const tilesWithNewTile = addNewTile(newTiles)

      return {
        ...state,
        tiles: tilesWithNewTile,
        score: state.score + earnedScore,
        status: getStatus(tilesWithNewTile),
        undoCharges: state.undoCharges + earnedUndoes,
        stateHistory: newHistory,
      }
    }

    case 'UNDO': {
      if (state.undoCharges > 0 && state.stateHistory.length > 0) {
        const prevState = state.stateHistory[state.stateHistory.length - 1]

        return {
          ...state,
          tiles: prevState.tiles,
          score: prevState.score,
          undoCharges: state.undoCharges - 1,
          stateHistory: state.stateHistory.slice(0, -1),
        }
      }

      return state
    }

    default:
      return state
  }
}

type SavedGameState = {
  tiles: Tile[]
  score: number
  status: GameStatus
  undoCharges: number
  stateHistory: Array<{ tiles: Tile[]; score: number }>
}

export const GameProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const [, saveGameState] = useLocalStorage<SavedGameState | null>(
    '2048-game-state',
    null
  )

  useEffect(() => {
    if (state.commandQueue.length > 0 && !state.isProcessingCommand) {
      const nextDirection = state.commandQueue[0]

      dispatch({ type: 'START_PROCESSING' })

      dispatch({ type: 'MOVE', direction: nextDirection })

      setTimeout(() => {
        dispatch({ type: 'FINISH_PROCESSING' })
      }, 150)
    }
  }, [state.commandQueue, state.isProcessingCommand])

  useEffect(() => {
    saveGameState({
      tiles: state.tiles,
      score: state.score,
      status: state.status,
      undoCharges: state.undoCharges,
      stateHistory: state.stateHistory,
    })
  }, [
    state.tiles,
    state.score,
    state.status,
    state.undoCharges,
    state.stateHistory,
    saveGameState,
  ])

  return <GameContext value={{ state, dispatch }}>{children}</GameContext>
}
