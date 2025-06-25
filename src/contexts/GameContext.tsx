import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  useReducer,
} from 'react'

import type { CellValue, Direction } from '../types/BoardTypes.ts'
import {
  addNewTile,
  boardsEqual,
  getStatus,
  initializeGame,
  moveBoardInDirection,
} from '../utils/gameLogic.ts'

export type GameBoard = CellValue[]
export type GameStatus = 'idle' | 'playing' | 'win' | 'lose'

export interface GameState {
  board: GameBoard
  score: number
  status: GameStatus
}

type GameAction =
  | {
      type: 'NEW_GAME'
    }
  | { type: 'MOVE'; direction: Direction }
  | { type: 'RESTART' }

interface GameContextType {
  state: GameState
  dispatch: Dispatch<GameAction>
}

const initialState: GameState = initializeGame()

export const GameContext = createContext<GameContextType | undefined>(undefined)

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'NEW_GAME':
      return { ...initialState }
    case 'RESTART':
      return { ...initialState }
    case 'MOVE': {
      const { board: newBoard, earnedScore } = moveBoardInDirection(
        state.board,
        action.direction
      )

      if (boardsEqual(state.board, newBoard)) {
        return state
      }

      const boardWithNewTile = addNewTile(newBoard)

      return {
        ...state,
        board: boardWithNewTile,
        score: state.score + earnedScore,
        status: getStatus(boardWithNewTile),
      }
    }
    default:
      return state
  }
}

export const GameProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  return <GameContext value={{ state, dispatch }}>{children}</GameContext>
}
