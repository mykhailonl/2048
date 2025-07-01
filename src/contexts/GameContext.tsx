import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  useEffect,
  useReducer,
} from 'react'

import type { Direction, Tile } from '../types/TileTypes.ts'
import {
  addNewTile,
  getStatus,
  initializeGame,
  moveTilesInDirection,
  tilesEqual,
} from '../utils/gameLogic.ts'

export type GameStatus = 'idle' | 'playing' | 'win' | 'lose'

export interface GameState {
  tiles: Tile[]
  score: number
  status: GameStatus
  commandQueue: Direction[]
  isProcessingCommand: boolean
}

type GameAction =
  | {
      type: 'NEW_GAME'
    }
  | { type: 'MOVE'; direction: Direction }
  | { type: 'RESTART' }
  | { type: 'QUEUE_COMMAND'; direction: Direction }
  | { type: 'START_PROCESSING' }
  | { type: 'FINISH_PROCESSING' }

interface GameContextType {
  state: GameState
  dispatch: Dispatch<GameAction>
}

const initialState: GameState = initializeGame()

export const GameContext = createContext<GameContextType | undefined>(undefined)

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'NEW_GAME':
      return {
        ...initialState,
        commandQueue: [],
        isProcessingCommand: false,
      }
    case 'RESTART':
      return {
        ...initialState,
        commandQueue: [],
        isProcessingCommand: false,
      }
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
      const { tiles: newTiles, earnedScore } = moveTilesInDirection(
        state.tiles,
        action.direction
      )

      if (tilesEqual(state.tiles, newTiles)) {
        return state
      }

      const tilesWithNewTile = addNewTile(newTiles)

      return {
        ...state,
        tiles: tilesWithNewTile,
        score: state.score + earnedScore,
        status: getStatus(tilesWithNewTile),
      }
    }
    default:
      return state
  }
}

export const GameProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(gameReducer, initialState)

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

  return <GameContext value={{ state, dispatch }}>{children}</GameContext>
}
