export interface Tile {
  id: string
  value: number
  x: number
  y: number
}

export type Direction = 'left' | 'right' | 'up' | 'down'

export interface MoveResult {
  tiles: Tile[]
  earnedScore: number
  earnedUndoes: number
}
