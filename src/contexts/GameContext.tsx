import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  useReducer,
} from 'react'

interface GameState {
  board: (number | null)[]
  score: number
  status: 'idle' | 'playing' | 'win' | 'lose'
}

type Direction = 'up' | 'down' | 'left' | 'right'

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

const initialState: GameState = {
  board: [
    2,
    null,
    null,
    4,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  score: 0,
  status: 'playing',
}

export const GameContext = createContext<GameContextType | undefined>(undefined)

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'NEW_GAME':
      return { ...initialState }
    case 'RESTART':
      return { ...initialState }
    case 'MOVE':
      return state
    default:
      return state
  }
}

export const GameProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  return <GameContext value={{ state, dispatch }}>{children}</GameContext>
}
