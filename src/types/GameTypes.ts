import type { Dispatch } from 'react'

import type { Direction, Tile } from './TileTypes.ts'

export type GameStatus = 'idle' | 'playing' | 'win' | 'lose'

export interface GameState {
  tiles: Tile[]
  score: number
  status: GameStatus
  commandQueue: Direction[]
  isProcessingCommand: boolean
  undoCharges: number
  stateHistory: Array<{ tiles: Tile[]; score: number }>
}

export type GameAction =
  | {
      type: 'NEW_GAME'
    }
  | { type: 'MOVE'; direction: Direction }
  | { type: 'QUEUE_COMMAND'; direction: Direction }
  | { type: 'START_PROCESSING' }
  | { type: 'FINISH_PROCESSING' }
  | { type: 'UNDO' }

export interface GameContextType {
  state: GameState
  dispatch: Dispatch<GameAction>
}

export type SavedGameState = {
  tiles: Tile[]
  score: number
  status: GameStatus
  undoCharges: number
  stateHistory: Array<{ tiles: Tile[]; score: number }>
}
